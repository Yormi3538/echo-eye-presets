Echo Eye Presets (EEP)
A Bondage Club userscript that saves and loads ECHO Clothing Ext eye looks (left / right Luzi eye slots) as named presets, grouped into packs (for example “red eyes”, “blue eyes”). Switch looks from a draggable chat dropdown or from the Extensions settings screen, with an optional blink animation when changing presets in chat.

Current version: 0.3.6
Chat command: /eyes
Settings path: Preferences → Extensions → Echo Eye Presets

Requirements
Bondage Club (browser) — official / Europe / Asia mirrors supported
Tampermonkey or Violentmonkey
ECHO Clothing Ext (or equivalent ECHO eye mod) — provides groups 左眼_Luzi / 右眼_Luzi
bcModSdk — loaded automatically via @require (CDN)
Without ECHO eye groups the mod still loads, but save/load will warn that eye slots were not found.

Installation (Tampermonkey)
Option A — Install from GitHub (recommended)
Install Tampermonkey (or Violentmonkey).
Open the raw script URL (must end with .user.js), for example:
raw.githubusercontent.com/YOUR_USER/YOUR_REP…eye-presets.user.js

Tampermonkey will open the install page — click Install.
Refresh Bondage Club (or log in again).
You should see a local chat message like:
v0.3.6 ready. Menu: Extensions → Echo Eye Presets · /eyes help
Tip: use the Raw button on the file page on GitHub, then copy the URL from the address bar. Do not use the normal GitHub “blob” page URL for installation.

Option B — Install from a local file
Open Tampermonkey → Dashboard → Utilities.
Import from file, or paste the contents of echo-eye-presets.user.js into a new script.
Save and reload the club.
Auto-updates (optional)
If you host the script on GitHub, add these lines to the userscript header (with your real raw URLs):

// @downloadURL raw.githubusercontent.com/YOUR_USER/YOUR_REP…eye-presets.user.js
// @updateURL raw.githubusercontent.com/YOUR_USER/YOUR_REP…eye-presets.user.js

Tampermonkey can then check for new versions automatically.

Electron / desktop client
For the Bondage Club Electron app (no Tampermonkey @require), use:

echo-eye-presets.electron.user.js

Copy the file into:
%APPDATA%\Bondage Club\Electron App\
In the app: Script menu → refresh, or restart the client.
Do not double-click the .user.js file in Windows Explorer (Windows Script Host will error — that is expected).
The Electron build loads bcModSdk from a CDN at runtime instead of using @require.

What the mod does
Eye packs
A pack is a named set of eye looks (presets). Typical use:

Pack 1 — “Red eyes”: look right, look left, look forward, …
Pack 2 — “Blue eyes”: look right, look left, look forward, …
Limits: up to 12 packs, up to 12 presets per pack.
Only the active pack is shown in the chat dropdown.
Pack selection and editing are done in Extensions settings only.

Existing saves from older versions (flat presets without packs) are migrated automatically into Pack 1.

Chat dropdown
In a chat room, if chat buttons are enabled:

A small E button appears (position can follow BCAR-style corners or a custom saved position).
Click — open/close the list of presets from the active pack.
Drag — move the button; position is saved.
Click a preset row — load that look (with blink, if enabled).
Empty presets are shown in white; saved ones are highlighted in green.

Blink animation
When you pick a preset from the chat dropdown (and Blink is ON):

The ECHO eye look is applied first (gaze / style change).
After the configured delay, facial expression is set to Closed (BC Eyes expression — soft closed lids).
After the same delay again, the previous Eyes / Eyes2 expression is restored.
Loading from the settings screen or via /eyes eyeloadN does not run the blink (instant apply).

Blink delay is adjustable in settings (default 100 ms; up to about 2000 ms).

Language
UI language can be switched in the Extensions screen:

Russian (RU) — default
English (EN)
The choice is stored in extension settings.

Settings screen
Preferences → Extensions → Echo Eye Presets

Pack row:

< > — switch active pack
Pack name — rename the current pack
Pack / − Pack — add a pack / remove the current pack
Blink: ON/OFF — toggle blink on dropdown load
Nms — prompt to set blink delay in milliseconds
Preset controls:

Buttons: ON/OFF — show/hide the chat E dropdown
Preset / − Preset — add/remove a look slot in the active pack
Reset pos. — clear custom dropdown button position
Name — rename a look
Save — snapshot current left/right ECHO eyes into this slot
Load — apply this slot (no blink)
Clear — clear saved eye data (keeps the name)
Pagination appears when you have more than 4 presets on the page.

How to set up a pack (example)
Equip the ECHO eyes you want (color, style, look direction).
Open Echo Eye Presets in Extensions.
Create or select a pack (e.g. name it Red eyes).
For slot 1: pose eyes looking right → Save → rename to Right.
For slot 2: pose eyes looking left → Save → rename to Left.
Repeat for other directions.
Create another pack for a different eye style and fill its slots the same way.
In chat, use the E menu to switch looks from the active pack. Switch packs only in settings when you want a different style set.
Chat commands
Type in chat (autocomplete is supported):

/eyes help — show help
/eyes status — buttons, active pack, blink, all presets, current eyes
/eyes buttons — toggle chat dropdown on/off
/eyes add — add a preset slot to the active pack
/eyes remove — remove the last preset slot
/eyes eyeN — save current eyes to preset N
/eyes eyeloadN — load preset N (no blink)
/eyes eyeclearN — clear preset N (keep name)
Examples:

/eyes eye1
/eyes eyeload2
/eyes status
