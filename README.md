# Echo Eye Presets (EEP)

A Bondage Club userscript that saves and loads **ECHO Clothing Ext** eye looks (left / right Luzi eye slots) as named presets, grouped into **packs** (for example “red eyes”, “blue eyes”). Switch looks from a draggable chat dropdown or from the Extensions settings screen, with an optional **blink** animation when changing presets in chat.

**Current version:** `0.3.7`  
**Chat command:** `/eyes`  
**Settings path:** Preferences → Extensions → **Echo Eye Presets**

---

## Requirements

| Requirement | Notes |
|---|---|
| [Bondage Club](https://www.bondageprojects.com/) (browser) | Official / Europe / Asia mirrors supported |
| [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/) | Userscript manager |
| [ECHO Clothing Ext](https://github.com/) (or equivalent ECHO eye mod) | Provides groups `左眼_Luzi` / `右眼_Luzi` |
| [bcModSdk](https://github.com/Jomshir98/bondage-club-mod-sdk) | Loaded automatically via `@require` (CDN) |

Without ECHO eye groups the mod still loads, but save/load will warn that eye slots were not found.

---

## Installation (Tampermonkey)

### Option A — Install from GitHub (recommended)

1. Install Tampermonkey (or Violentmonkey).
2. Open the **raw** script URL (must end with `.user.js`), for example:

https://raw.githubusercontent.com/yormi3538/echo-eye-presets/main/echo-eye-presets.user.js

3. Tampermonkey will open the install page — click **Install**.
4. Refresh Bondage Club (or log in again).
5. You should see a local chat message like:  
   `v0.3.6 ready. Menu: Extensions → Echo Eye Presets · /eyes help`

### Option B — Install from a local file

1. Open Tampermonkey → **Dashboard** → **Utilities**.
2. Use **Import from file** / paste the contents of `echo-eye-presets.user.js` into a new script.
3. Save and reload the club.

---

## Electron / desktop client

For the Bondage Club **Electron** app (no Tampermonkey `@require`), use:

```text
echo-eye-presets.electron.user.js
```

1. Copy the file into:

   ```text
   %APPDATA%\Bondage Club\Electron App\
   ```

2. In the app: **Script** menu → refresh, or restart the client.

The Electron build loads `bcModSdk` from a CDN at runtime instead of using `@require`.

---

## What the mod does

### Eye packs

A **pack** is a named set of eye looks (presets). Typical use:

| Pack | Contents |
|---|---|
| Pack 1 — “Red eyes” | Look right, look left, look forward, … |
| Pack 2 — “Blue eyes” | Look right, look left, look forward, … |

- Up to **12 packs**
- Up to **12 presets per pack**
- Only the **active pack** is shown in the chat dropdown
- Pack selection and editing are done in **Extensions settings** only


### Chat dropdown

In a chat room, if chat buttons are enabled:

- A small **E** button appears (position can follow BCAR-style corners or a custom saved position).
- **Click** — open/close the list of presets from the active pack.
- **Drag** — move the button; position is saved.
- Click a preset row — **load** that look (with blink, if enabled).

Empty presets are shown in white; saved ones are highlighted in green.

### Blink animation

When you pick a preset from the **chat dropdown** (and Blink is ON):

1. The ECHO eye look is applied first (gaze / style change).
2. After the configured delay, facial expression is set to **`Closed`** (BC Eyes expression — soft closed lids).
3. After the same delay again, the previous Eyes / Eyes2 expression is restored.

Loading from the settings screen or via `/eyes eyeloadN` does **not** run the blink (instant apply).

Blink delay is adjustable in settings (default **100 ms**; range effectively 0–2000 ms).

### Language

UI language can be switched in the Extensions screen:

- **Russian (RU)** — default  
- **English (EN)**

The choice is stored in extension settings.

---

## Settings screen

**Preferences → Extensions → Echo Eye Presets**

### Pack row

| Control | Action |
|---|---|
| `<` `>` | Switch active pack |
| **Pack name** | Rename the current pack |
| **+ Pack** / **− Pack** | Add a pack / remove the current pack |
| **Blink: ON/OFF** | Toggle blink on dropdown load |
| **`Nms`** | Prompt to set blink delay in milliseconds |

### Preset row

| Control | Action |
|---|---|
| **Buttons: ON/OFF** | Show/hide the chat E dropdown |
| **+ Preset** / **− Preset** | Add/remove a look slot in the active pack |
| **Reset pos.** | Clear custom dropdown button position |
| **Name** | Rename a look |
| **Save** | Snapshot current left/right ECHO eyes into this slot |
| **Load** | Apply this slot (no blink) |
| **Clear** | Clear saved eye data (keeps the name) |

Pagination appears when you have more than 4 presets on the page.

---

## How to set up a pack (example)

1. Equip the ECHO eyes you want (color, style, look direction).
2. Open **Echo Eye Presets** in Extensions.
3. Create or select a pack (e.g. name it `Red eyes`).
4. For slot 1: pose eyes looking **right** → **Save** → rename to `Right`.
5. For slot 2: pose eyes looking **left** → **Save** → rename to `Left`.
6. Repeat for other directions.
7. Create another pack for a different eye style and fill its slots the same way.
8. In chat, use the **E** menu to switch looks from the **active** pack. Switch packs only in settings when you want a different style set.

---

## Chat commands

Type in chat (autocomplete is supported):

| Command | Description |
|---|---|
| `/eyes help` | Show help |
| `/eyes status` | Buttons, active pack, blink, all presets, current eyes |
| `/eyes buttons` | Toggle chat dropdown on/off |
| `/eyes add` | Add a preset slot to the active pack |
| `/eyes remove` | Remove the last preset slot |
| `/eyes eyeN` | Save current eyes to preset **N** |
| `/eyes eyeloadN` | Load preset **N** (no blink) |
| `/eyes eyeclearN` | Clear preset **N** (keep name) |

Examples:

```text
/eyes eye1
/eyes eyeload2
/eyes status
```

---

## Supported sites

The Tampermonkey script matches:

- `https://bondageprojects.elementfx.com/*`
- `https://www.bondageprojects.elementfx.com/*`
- `https://bondage-europe.com/*`
- `https://www.bondage-europe.com/*`
- `https://www.bondage-asia.com/*`
- Localhost (any port) via `@include` regex for development

---

## Data & privacy

- Settings are stored in Bondage Club **`Player.ExtensionSettings.EchoEyePresets`** and synced with the usual club extension settings sync when available.
- Presets store eye asset name, color, description, and property JSON for left/right ECHO slots.
- Nothing is uploaded to a third-party server by this mod beyond normal BC extension sync.

---

## Troubleshooting

| Problem | What to try |
|---|---|
| Mod never starts / old `wait timeout (Player.MemberNumber)` | Update to **0.3.5+** (waits for login without a hard timeout). Refresh after logging in. |
| Tampermonkey “Bad pattern localhost:*” | Update to **0.3.6+** (uses `@include` regex for localhost). |
| “ECHO Clothing Ext not loaded” | Install/enable ECHO (or the mod that adds `左眼_Luzi` / `右眼_Luzi`), then reload. |
| Dropdown missing in chat | Open settings → enable **Buttons**; check you are in a chat room. |
| Blink feels wrong / expression stuck | Adjust blink delay; ensure Blink is ON only for dropdown use; load from settings to apply without blink. |
| Pack list empty after update | Should auto-migrate; if not, re-save presets. Check `/eyes status`. |
| bcModSdk failed | Allow CDN access (`cdn.jsdelivr.net` / `unpkg.com`), or check network/adblock. |

Open the browser console (F12) and look for `[EEP]` log lines for more detail.

---

## Files in this repository

| File | Purpose |
|---|---|
| `echo-eye-presets.user.js` | Main Tampermonkey / Violentmonkey script |
| `echo-eye-presets.electron.user.js` | Electron Bondage Club variant (runtime SDK load) |
| `README.md` | This documentation |

---

## License / credits

- Built for Bondage Club with [bcModSdk](https://github.com/Jomshir98/bondage-club-mod-sdk).
- Depends on ECHO-style custom eye asset groups for full functionality.
- Not affiliated with Bondage Projects; use at your own risk and follow club rules for third-party scripts.

---

## Quick start checklist

1. Install Tampermonkey.  
2. Install this script from the raw GitHub `.user.js` link.  
3. Confirm ECHO eyes are available in-game.  
4. Open **Extensions → Echo Eye Presets**, create a pack, save a few looks.  
5. In chat, use the **E** button (or `/eyes eyeload1`) to switch.  
6. Optionally enable Blink and tune the delay (e.g. `50`–`200` ms).
