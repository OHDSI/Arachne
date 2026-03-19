# How to run studies

This page walks through **using Arachne** to run studies with the Study Repository: from configuring the catalog to running a study, viewing results, and cleaning up.

---

## 1. Set where studies come from

1. Open **Settings** (gear icon or Settings in the navigation).
2. Find **Study catalog address** (or “Docker registry URL”).
3. Enter the registry URL (e.g. `https://ghcr.io` or your organization’s registry).
4. Click **Save**.

That’s the only place you configure the study “repo.” Arachne will use this registry to install and update studies.

---

## 2. See what’s on your machine

1. In Arachne, open **Study Repository** from the main navigation.
2. You’ll see a **list of study packages** already on this machine.
3. Each row shows: study name, version (if available), and that it’s linked to the catalog.

Use this list to see what’s installed at a glance.

---

## 3. Install a new study

1. On the Study Repository page, find the **Install** area.
2. Type the **repo name** (e.g. `darwin-eu-dev/examplestudy`) as it appears in the catalog.
3. Click **Install**.
4. Arachne runs **docker pull** to download the study image from the registry to your computer. When the pull completes, the study appears in the list. Installed studies are Docker images stored locally on your machine.

---

## 4. Keep a study up to date

1. In the list of installed studies, find the study you want to update.
2. Click **Update** for that study.
3. Arachne fetches the latest version from the catalog. After a short loading state, the list refreshes.

You don’t need to re-download or re-install manually.

---

## 5. Run a study

1. In the Study Repository list, choose **Run this study** for the study you want to run.
2. You’ll see a short **“Starting…”** state while Arachne starts the study environment.
3. When ready, an **editor** opens with a **single script** (e.g. `codeToRun.R`) where you enter:
   - Database connection details  
   - Study run parameters  
4. Set or confirm `outputFolder` in the script. Files must be written under `/code/<outputFolder>` to be captured as run outputs.
5. **Edit the script**, then click **Save**.
6. Click **Run study**. A **log viewer** shows progress; watch the log while the study runs.
   - Arachne clears `/code/<outputFolder>` before each run to avoid mixing previous files with the current run.
   - The log includes system lines showing the output folder cleanup and how many files were saved for that run.
   - Keep interactive viewer startup out of `codeToRun.R`; use the dedicated **View results** action after the run completes.
7. When it finishes successfully, you’ll see **“Run completed without error.”** (or a non-success status if execution failed).

Your edits (database connection, settings) are **saved with that study**. If you shutdown and start the study again later, the same script and edits are still there.

---

## 6. Look at outputs

After a run:

1. From the same place you ran the study (editor / run view), open **Browse outputs** or **Output files**.
2. You’ll see a list of output files (tables, plots, etc.) produced by the study.
3. Select a CSV/text file to preview it in a **read-only viewer**.
4. Download files as needed.

You can also open **File explorer** in the run page to browse files in the running container (`/code`) and preview CSV/text files in a read-only panel.

---

## 7. View results in an interactive app

1. For a study that has produced results, click **View results**.
2. Arachne restores the latest saved output snapshot for the most recent completed run, then starts the interactive results viewer (e.g. a Shiny app).
3. A **link (URL)** is shown in the UI—open it in a new browser tab or copy it.
4. Use the link to explore results; you can copy or open it again from the UI.

---

## 8. Stop and remove cleanly

**Shutdown study**

- When you’re done with a run, click **Shutdown study** to stop the study environment (container/runtime).
- Confirm if prompted. The study remains installed; you can run it again later and your saved script will still be there.

**Delete study**

- If you no longer want that study on your machine, click **Delete study**.
- This is a strong action (often in a danger/red style); confirm when prompted.
- The study is removed from your machine. You stay in control of what’s installed and what’s running.

---

## Flow summary

| Step | Action |
|------|--------|
| Configure | Settings → Study catalog address → Save |
| See installed | Study Repository → list of studies |
| Install | Study name → Install |
| Update | Update (per study) |
| Run | Run this study → edit script → Save → Run study → watch log |
| Outputs | Browse outputs / Output files |
| Results | View results → open or copy link |
| Clean up | Shutdown study and/or Delete study |
