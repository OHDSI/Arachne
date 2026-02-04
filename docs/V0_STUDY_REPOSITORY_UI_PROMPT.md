# v0.app Prompt: Study Repository UI

Copy the prompt below into v0.app to generate a new UI that matches the current Arachne datanode look and feel and implements the Study Repository user story.

---

## Prompt for v0.app

Build a **Study Repository** web app UI with the following design system and feature set.

### Design system (match this look and feel)

**Colors:**
- **Primary / links / accents:** `#019cb3` (teal)
- **Primary dark (headings, emphasis):** `#006c75` (darker teal)
- **Header bar:** `#28393a` (dark teal-gray), white text
- **Page background:** `#f5f3fa` (light lavender-gray)
- **Card/panel background:** `#ffffff` or `#eeeef4` (slightly darker panels)
- **Borders:** `#cac3d2` (light gray-purple)
- **Secondary text / labels:** `#798395` (gray)
- **Body text:** `#474850` (dark gray)
- **Info/success:** `#11b7c6`; **Error:** `#f33889`; **Success:** `#79d082`
- **Secondary UI (chips, muted):** `#adafd3`

**Layout:**
- **Left sidebar (fixed):** ~70px wide, white background, subtle shadow; holds logo at top, icon-only nav items (with tooltips on hover), and small branding at bottom.
- **Main area:** Top bar (full width, header color `#28393a`, 50px height) with breadcrumbs on the left and user menu on the right; content below with padding.
- **Content:** Min height ~calc(100vh - 50px), white or light gray background; use cards/panels with 4px border radius and soft shadows (e.g. `0 3px 13px 0 rgba(0,0,0,0.16)`).
- **Typography:** Roboto / system font stack; 14px body, 24px h1, 18px h2; headings in `#006c75`.

**Icons:**
- Use a simple, consistent icon set (e.g. Lucide or Heroicons): folder/library for “Study Repository,” gear for settings, download/arrow-down for Install/Update, play for Run, file-text for script/editor, folder-open for outputs, external-link for “View results,” stop for Shutdown, trash for Delete.
- Nav items: icon-only in the left sidebar; primary color when active, same color when inactive (or slightly muted).

**Components:**
- Buttons: primary = teal `#019cb3`, secondary = outline with border `#cac3d2`.
- Tables/lists: header row with background tint of info color; rows with borders; hover state with light background.
- Inputs: standard text fields with border `#cac3d2`, focus ring in primary.
- Chips/tags: small pills (e.g. status) with white or light background and primary-colored text where appropriate.

---

### User story to implement

**Product name in UI:** “Study Repository.” Users are researchers who run studies locally: they install study packages from a catalog, run them with their own database and settings, view results in an interactive app, and clean up when done—no uploads or generic “submissions.”

---

**1. Set where studies come from**
- In **Settings** (e.g. under a gear in the header or a “Settings” nav item), provide a single configuration: **Study catalog address** (e.g. Docker registry URL).
- One text input and Save; optional short hint: “e.g. Docker registry URL.” That’s the only place the user configures the “repo.”

---

**2. See what’s on my machine**
- **Study Repository** is a main nav item (e.g. “Study Repository” with a library/folder icon).
- Opening it shows a **list of study packages** already on the machine.
- Each row/card: study name, version (if available), and that it’s linked to the catalog; at a glance the user sees what’s installed.

---

**3. Keep studies up to date**
- For each study in the list, an **Update** action (button or icon).
- Clicking it fetches the latest version from the catalog (no manual re-download/re-install). Show a short loading state, then refresh the list.

---

**4. Install a new study**
- A clear **Install** area: text input for “Study name” (as it appears in the catalog) and an **Install** button.
- On Install: app “downloads” the study to the machine and it appears in the list. No file picker or upload.

---

**5. Run a study I’ve installed**
- For each study: **Run this study** action.
- After clicking: show a short **“Starting…”** state (spinner or message).
- When ready: open an **editor** view with a **single script** (e.g. `codeToRun.R` or placeholder) where the user enters database connection and study run details.
- User can **edit the script**, **Save**, and click **Run study**. Show a **log viewer** (streaming or static) while the study runs.
- On **successful completion**: clear message “Run completed without error” (or similar).

---

**6. Use my edits next time**
- The script (database connection, settings) is **saved with that study**. If the user stops and starts the study again later, the same script/edits are still there—no re-entry.

---

**7. Look at outputs**
- After a run, from the same place (study run / editor view), provide **Browse outputs** or **Output files**: list of output files (tables, plots, etc.) the study produced, with ability to open or download.

---

**8. View results in an interactive app**
- **View results** button: starts the interactive results viewer (e.g. Shiny app) for that study.
- Show a **link** (URL) in the UI that the user can open in a new tab or copy. Optional: “Open in new tab” button next to the link.

---

**9. Stop and remove cleanly**
- **Shutdown study**: stops the study environment (container/runtime). Show confirmation if needed.
- **Delete study**: removes the study from the machine entirely. Use a distinct, cautious action (e.g. red/danger style) and confirm before deleting.
- User stays in control of what’s installed and what’s running.

---

### UI structure summary

- **Sidebar:** Logo, **Study Repository** (main), **Settings**, (optional) user/profile.
- **Study Repository page:**  
  - Install section (input + Install).  
  - List of installed studies: name, version, actions [Update | Run this study | View results | Browse outputs | Shutdown study | Delete study].  
- **Run flow:** Run this study → Starting… → Editor (script) → Save → Run study → Log viewer → “Run completed without error” + Output files + View results (link).  
- **Settings:** One field “Study catalog address” and Save.

Use the colors, layout, and icon style above so the result feels like the same product (Arachne) with a new “Study Repository” workflow. Prefer clear labels and a linear flow over clutter; use modals or inline expansion where it keeps the main list simple.
