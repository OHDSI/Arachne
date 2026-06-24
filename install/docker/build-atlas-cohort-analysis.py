#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import shutil
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


ROOT = Path(__file__).resolve().parent
TEMPLATE_DIR = ROOT / "atlas-cohort-template"
OUT_ROOT = ROOT / "atlas-cohort-packages"


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-+", "-", value).strip("-")
    return value or "atlas-cohort-analysis"


def render_template(text: str, values: dict[str, str]) -> str:
    for key, value in values.items():
        text = text.replace("{{" + key + "}}", value)
    return text


def zip_dir(source_dir: Path, zip_path: Path) -> None:
    with ZipFile(zip_path, "w", ZIP_DEFLATED) as archive:
        for path in sorted(source_dir.rglob("*")):
            if path.is_file():
                archive.write(path, path.relative_to(source_dir))


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Build an Arachne-ready HADES package from exported ATLAS cohort SQL."
    )
    parser.add_argument("--cohort-sql", required=True, type=Path, help="Path to SQL exported from ATLAS")
    parser.add_argument("--cohort-id", required=True, type=int, help="Target cohort ID used in results.cohort")
    parser.add_argument("--name", required=True, help="Analysis name shown in Arachne")
    parser.add_argument("--target-cohort-table", default="cohort", help="Target cohort table name; default: cohort")
    parser.add_argument("--out-dir", default=OUT_ROOT, type=Path, help="Output directory for package folder and zip")
    args = parser.parse_args()

    cohort_sql = args.cohort_sql.resolve()
    if not cohort_sql.exists():
        raise SystemExit(f"Cohort SQL file not found: {cohort_sql}")

    slug = slugify(args.name)
    package_dir = args.out_dir.resolve() / slug
    zip_path = args.out_dir.resolve() / f"{slug}.zip"

    if package_dir.exists():
        shutil.rmtree(package_dir)
    package_dir.mkdir(parents=True)
    (package_dir / "sql").mkdir()

    shutil.copyfile(cohort_sql, package_dir / "sql" / "cohort.sql")

    values = {
        "ANALYSIS_NAME": args.name.replace("\\", "\\\\").replace('"', '\\"'),
        "COHORT_ID": str(args.cohort_id),
        "TARGET_COHORT_TABLE": args.target_cohort_table,
    }

    run_template = (TEMPLATE_DIR / "run.R").read_text()
    (package_dir / "run.R").write_text(render_template(run_template, values))

    metadata = {
        "analysisName": args.name,
        "studyName": args.name,
        "analysisType": "CUSTOM",
        "dockerRuntimeEnvironmentImage": "odysseusinc/r-hades:latest",
        "entryPoint": "run.R",
        "runtimeEnvironmentName": "",
        "EnvironmentVariables": {
            "RESULTS_SCHEMA": "results"
        },
    }
    (package_dir / "metadata.json").write_text(json.dumps(metadata, indent=2) + "\n")

    readme = f"""# {args.name}

This package was generated from ATLAS cohort SQL.

Upload `{zip_path.name}` to Arachne Central as a `Files in archive` / `CUSTOM` analysis.

The DataNode runs `run.R`, which:
- executes `sql/cohort.sql`
- writes cohort membership to `results.{args.target_cohort_table}`
- returns aggregate CSV outputs under `my_results/`

No patient-level rows are exported.
"""
    (package_dir / "README.md").write_text(readme)

    args.out_dir.resolve().mkdir(parents=True, exist_ok=True)
    if zip_path.exists():
        zip_path.unlink()
    zip_dir(package_dir, zip_path)

    print(f"Created package directory: {package_dir}")
    print(f"Created Arachne upload zip: {zip_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
