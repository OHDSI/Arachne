# ATLAS Cohort Analysis Template

This template is used by `build-atlas-cohort-analysis.py`.

The intended user-facing demo flow is:

1. Build a cohort definition in ATLAS.
2. Export the generated cohort SQL.
3. Build an Arachne upload package:

```sh
./build-atlas-cohort-analysis.py \
  --cohort-sql /path/to/atlas-exported-cohort.sql \
  --cohort-id 3 \
  --name "Blood EHR Cohort Summary"
```

4. Upload the generated zip from `atlas-cohort-packages/` to Arachne Central.
5. Submit to one or more DataNodes.
6. DataNode admins approve.
7. Central receives aggregate CSV outputs.

The generated package uses `odysseusinc/r-hades:latest` and runs `run.R`.
It executes the ATLAS cohort SQL, writes cohort membership to `results.cohort`,
and returns aggregate CSV files under `my_results/`.

No patient-level rows are exported.
