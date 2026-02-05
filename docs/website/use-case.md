# Use case & user story

## User story

**As a researcher running studies**, I want to use **Arachne** (and its Study Repository) so that I can:

- Install study packages from a central catalog  
- Run them on my machine with my own database and settings  
- See results in an interactive app  
- Clean up when I’m done  

—without dealing with uploads or generic “submissions.”

---

## What I can do

### Set where studies come from

In Arachne I can open **Settings** and type in the address of the study catalog (e.g. a Docker registry). That’s the only place I need to configure the “repo.”

### See what’s on my machine

I open **Study Repository** in Arachne and see a list of study packages that are already downloaded on this machine. Each one is linked to that catalog and I can tell at a glance what I have.

### Keep studies up to date

For any study in the list, I can click **Update** to get the latest version from the catalog. I don’t have to re-download or re-install manually.

### Install a new study

I type the name of a study (as it appears in the catalog) in a box and click **Install**. Arachne downloads that study to my machine and it shows up in the list. I don’t have to find files or upload anything.

### Run a study I’ve installed

I choose **Run this study** for one of the studies in the list. Arachne starts the study environment (I see a short “starting…” state). When it’s ready, it opens an editor with a single script where I enter my database connection and study run details. I edit that script, save it, and click **Run study**. The study runs and I can watch the log. When it finishes successfully, I get a clear message that the run completed without error.

### Use my edits next time

The script I edited (database connection, settings, etc.) is saved with that study. If I stop and start the study again later, my edits are still there. I don’t have to re-enter everything.

### Look at outputs

After a run, I can browse the output files the study produced (tables, plots, etc.) from the same place I ran the study.

### View results in an interactive app

I can click **View results**. Arachne starts an interactive results viewer (e.g. a Shiny app) for that study and gives me a link. I can open it in a new browser tab and explore results there. The link is shown in the UI so I can copy it or open it again.

### Stop and remove cleanly

When I’m done with a run, I can **Shutdown study** to stop the study environment. If I no longer want that study on my machine at all, I can **Delete study** to remove it. I stay in control of what’s installed and what’s running.
