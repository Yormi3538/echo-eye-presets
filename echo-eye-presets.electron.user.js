// ==UserScript==
// @name         Echo Eye Presets
// @namespace    https://www.bondageprojects.com/
// @version      0.3.6-electron
// @description  Echo eye packs for Electron Bondage Club (no Tampermonkey @require)
// @author       local
// @match        https://*.bondageprojects.elementfx.com/R*/*
// @match        https://*.bondage-europe.com/R*/*
// @match        https://*.bondageprojects.com/R*/*
// @match        https://*.bondage-asia.com/club/R*
// @include      /^http:\/\/localhost(:\d+)?\/.*$/
// @run-at       document-end
// @grant        none
// ==/UserScript==
//
// Install: copy this file into
//   %APPDATA%\Bondage Club\Electron App\
// then Script menu → refresh / restart app.
// Do NOT double-click this file (Windows Script Host error is expected).
//

/* global Player, ServerIsConnected, ServerSocket, ServerPlayerExtensionSettingsSync,
          AssetGroupGet, AssetGet, InventoryGet, InventoryWear, InventoryRemove,
          CharacterRefresh, CharacterSetFacialExpression,
          ChatRoomCharacterItemUpdate, ChatRoomCharacterUpdate,
          ChatRoomSendLocal, CommandCombine, ElementValue, CurrentScreen,
          DrawButton, DrawText, DrawCharacter,
          MouseX, MouseY, MouseIn, MainCanvas,
          CanvasWidth, CanvasHeight,
          bcModSdk, bcModSDK, PreferenceRegisterExtensionSetting,
          PreferenceSubscreenExtensionsClear */

(function () {
  "use strict";

  var MOD_NAME = "Echo Eye Presets";
  var MOD_SHORT = "EEP";
  var MOD_VERSION = "0.3.6-electron";
  var EXT_KEY = "EchoEyePresets";
  var CMD_TAG = "eyes";

  var EYE_LEFT = "左眼_Luzi";
  var EYE_RIGHT = "右眼_Luzi";
  var EYE_GROUPS = [EYE_LEFT, EYE_RIGHT];
  /** BC Eyes expression used for blink flash (closed lids). */
  var BLINK_EXPRESSION = "Closed";

  var DEFAULT_PRESET_COUNT = 2;
  var MIN_PRESETS = 1;
  var MAX_PRESETS = 12;
  var MIN_PACKS = 1;
  var MAX_PACKS = 12;
  var PRESETS_PER_PAGE = 4;
  var DEFAULT_BLINK_MS = 100;

  var MSG_STYLE =
    "background-color:#1a1a2e;color:#EEEEEE;padding:4px 8px;border-left:3px solid #e94560;";

  var I18N = {
    ru: {
      empty: "(пусто)",
      presetDefault: "Пресет {0}",
      packDefault: "Пак {0}",
      noPreset: "Нет пресета #{0}",
      noPack: "Нет пака #{0}",
      renamePrompt: "Имя пресета #{0}:",
      renamePackPrompt: "Имя пака #{0}:",
      renamed: "Пресет #{0}: «{1}»",
      packRenamed: "Пак #{0}: «{1}»",
      echoMissing: "ECHO Clothing Ext не загружен — слоты глаз не найдены.",
      saved:
        "Пресет <b>{0}</b> сохранён.<br>Left: {1}<br>Right: {2}",
      loaded:
        "Пресет <b>{0}</b> загружен.<br>Left: {1}<br>Right: {2}",
      emptyPreset: "Пресет #{0} пуст. Сначала сохраните глаза.",
      cleared: "Пресет «{0}» очищен (имя сохранено).",
      maxPresets: "Максимум пресетов: {0}",
      added: "Добавлен пресет #{0}. Кнопок в чате: {0}",
      minPresets: "Минимум пресетов: {0}",
      removed: "Удалён пресет #{0}. Кнопок в чате: {1}",
      maxPacks: "Максимум паков: {0}",
      minPacks: "Минимум паков: {0}",
      packAdded: "Добавлен пак #{0}",
      packRemoved: "Удалён пак #{0}",
      packActive: "Активный пак: «{0}» ({1}/{2})",
      statusButtons: "Кнопки: {0}",
      statusPack: "Пак: «{0}» ({1}/{2})",
      statusCount: "Пресеттов: {0}",
      statusBlink: "Blink: {0} ({1} ms)",
      statusLine: "#{0} «{1}»: {2}",
      statusCurrent: "Сейчас: L={0} | R={1}",
      helpIntro: "v{0} — пресеты глаз ECHO (паки).",
      helpMenu: "Меню: Настройки → Расширения → {0}",
      helpEye: "/{0} eyeN — сохранить пресет N",
      helpLoad: "/{0} eyeloadN — загрузить",
      helpClear: "/{0} eyeclearN — очистить",
      helpAdd: "/{0} add | remove — +/− слот пресета",
      helpMisc: "/{0} buttons | status | help",
      buttonsToggled: "Кнопки в чате: <b>{0}</b>",
      unknown: "Неизвестно. <b>/{0} help</b>",
      posReset: "Позиция кнопки сброшена.",
      tipShow: "Показать пресеты глаз (тяните, чтобы переместить)",
      tipHide: "Скрыть пресеты глаз",
      tipDrag: "Перемещение…",
      countLine: "Пак «{0}»  |  Пресеттов: {1}  |  Кнопок: {1}",
      buttonsOn: "Кнопки: ВКЛ",
      buttonsOff: "Кнопки: ВЫКЛ",
      buttonsStatus: "Кнопки в чате: {0}",
      on: "ВКЛ",
      off: "ВЫКЛ",
      addPreset: "+ Пресет",
      removePreset: "− Пресет",
      resetPos: "Сброс поз.",
      addPack: "+ Пак",
      removePack: "− Пак",
      renamePack: "Имя пака",
      blinkOn: "Blink: ВКЛ",
      blinkOff: "Blink: ВЫКЛ",
      blinkStatus: "Blink: {0} ({1} ms)",
      blinkDelayPrompt: "Задержка blink (мс):",
      tipButtons: "Кнопки пресетов в чате",
      tipAdd: "Добавить слот пресета",
      tipRemove: "Удалить последний слот",
      tipResetPos: "Сбросить позицию кнопки в чате",
      tipPrev: "Предыдущая страница",
      tipNext: "Следующая страница",
      tipPrevPack: "Предыдущий пак",
      tipNextPack: "Следующий пак",
      tipAddPack: "Добавить пак глаз",
      tipRemovePack: "Удалить текущий пак",
      tipRenamePack: "Переименовать пак",
      tipBlink: "Blink выражения при смене в чате",
      tipBlinkDelay: "Задать задержку blink",
      tipRename: "Переименовать пресет #{0}",
      tipSave: "Сохранить текущие глаза в #{0}",
      tipLoad: "Загрузить пресет #{0}",
      tipClear: "Очистить пресет #{0}",
      page: "Страница {0} / {1}",
      rename: "Имя",
      save: "Сохранить",
      load: "Загрузить",
      clear: "Очистить",
      langBtn: "Язык: RU",
      langTip: "Переключить язык / Switch language",
      langSet: "Язык: русский",
      ready: "v{0} ready. Меню: Расширения → {1} · <b>/{2} help</b>",
      echoWarn: "<br><b>Warning:</b> ECHO Clothing Ext не обнаружен.",
    },
    en: {
      empty: "(empty)",
      presetDefault: "Preset {0}",
      packDefault: "Pack {0}",
      noPreset: "No preset #{0}",
      noPack: "No pack #{0}",
      renamePrompt: "Preset #{0} name:",
      renamePackPrompt: "Pack #{0} name:",
      renamed: "Preset #{0}: “{1}”",
      packRenamed: "Pack #{0}: “{1}”",
      echoMissing: "ECHO Clothing Ext not loaded — eye slots not found.",
      saved: "Preset <b>{0}</b> saved.<br>Left: {1}<br>Right: {2}",
      loaded: "Preset <b>{0}</b> loaded.<br>Left: {1}<br>Right: {2}",
      emptyPreset: "Preset #{0} is empty. Save eyes first.",
      cleared: "Preset “{0}” cleared (name kept).",
      maxPresets: "Maximum presets: {0}",
      added: "Added preset #{0}. Chat buttons: {0}",
      minPresets: "Minimum presets: {0}",
      removed: "Removed preset #{0}. Chat buttons: {1}",
      maxPacks: "Maximum packs: {0}",
      minPacks: "Minimum packs: {0}",
      packAdded: "Added pack #{0}",
      packRemoved: "Removed pack #{0}",
      packActive: "Active pack: “{0}” ({1}/{2})",
      statusButtons: "Buttons: {0}",
      statusPack: "Pack: “{0}” ({1}/{2})",
      statusCount: "Presets: {0}",
      statusBlink: "Blink: {0} ({1} ms)",
      statusLine: "#{0} “{1}”: {2}",
      statusCurrent: "Now: L={0} | R={1}",
      helpIntro: "v{0} — ECHO eye presets (packs).",
      helpMenu: "Menu: Settings → Extensions → {0}",
      helpEye: "/{0} eyeN — save preset N",
      helpLoad: "/{0} eyeloadN — load",
      helpClear: "/{0} eyeclearN — clear",
      helpAdd: "/{0} add | remove — +/− preset slot",
      helpMisc: "/{0} buttons | status | help",
      buttonsToggled: "Chat buttons: <b>{0}</b>",
      unknown: "Unknown. <b>/{0} help</b>",
      posReset: "Button position reset.",
      tipShow: "Show eye presets (drag to move)",
      tipHide: "Hide eye presets",
      tipDrag: "Dragging…",
      countLine: "Pack “{0}”  |  Presets: {1}  |  Buttons: {1}",
      buttonsOn: "Buttons: ON",
      buttonsOff: "Buttons: OFF",
      buttonsStatus: "Chat buttons: {0}",
      on: "ON",
      off: "OFF",
      addPreset: "+ Preset",
      removePreset: "− Preset",
      resetPos: "Reset pos.",
      addPack: "+ Pack",
      removePack: "− Pack",
      renamePack: "Pack name",
      blinkOn: "Blink: ON",
      blinkOff: "Blink: OFF",
      blinkStatus: "Blink: {0} ({1} ms)",
      blinkDelayPrompt: "Blink delay (ms):",
      tipButtons: "Toggle chatroom preset buttons",
      tipAdd: "Add preset slot",
      tipRemove: "Remove last preset slot",
      tipResetPos: "Reset dropdown button position",
      tipPrev: "Previous page",
      tipNext: "Next page",
      tipPrevPack: "Previous pack",
      tipNextPack: "Next pack",
      tipAddPack: "Add eye pack",
      tipRemovePack: "Remove current pack",
      tipRenamePack: "Rename pack",
      tipBlink: "Expression blink when switching in chat",
      tipBlinkDelay: "Set blink delay",
      tipRename: "Rename preset #{0}",
      tipSave: "Save current eyes to #{0}",
      tipLoad: "Load preset #{0}",
      tipClear: "Clear preset #{0}",
      page: "Page {0} / {1}",
      rename: "Name",
      save: "Save",
      load: "Load",
      clear: "Clear",
      langBtn: "Lang: EN",
      langTip: "Switch language / Переключить язык",
      langSet: "Language: English",
      ready: "v{0} ready. Menu: Extensions → {1} · <b>/{2} help</b>",
      echoWarn: "<br><b>Warning:</b> ECHO Clothing Ext not detected.",
    },
  };

  var prefStatus = "";
  var prefPage = 0;
  var blinkTimer = null;

  function getLang() {
    try {
      var s = Player && Player.ExtensionSettings && Player.ExtensionSettings[EXT_KEY];
      if (s && s.language === "en") return "en";
    } catch (e) {
      /* ignore */
    }
    return "ru";
  }

  function t(key) {
    var dict = I18N[getLang()] || I18N.ru;
    var str = dict[key] != null ? dict[key] : I18N.ru[key] != null ? I18N.ru[key] : key;
    var args = Array.prototype.slice.call(arguments, 1);
    return String(str).replace(/\{(\d+)\}/g, function (_, i) {
      return args[i] != null ? args[i] : "";
    });
  }

  function toggleLanguage() {
    var s = ensureSettings();
    s.language = getLang() === "en" ? "ru" : "en";
    saveSettings();
    prefStatus = t("langSet");
  }

  /** timeoutMs <= 0 means wait forever (needed on login screen). */
  function waitFor(predicate, timeoutMs, intervalMs, label) {
    if (timeoutMs == null) timeoutMs = 120000;
    intervalMs = intervalMs || 200;
    label = label || "condition";
    return new Promise(function (resolve, reject) {
      var start = Date.now();
      var tick = function () {
        try {
          if (predicate()) return resolve(true);
        } catch (e) {
          /* keep waiting */
        }
        if (timeoutMs > 0 && Date.now() - start > timeoutMs) {
          return reject(new Error(MOD_SHORT + ": wait timeout (" + label + ")"));
        }
        setTimeout(tick, intervalMs);
      };
      tick();
    });
  }

  function playerReady() {
    return (
      typeof Player !== "undefined" &&
      Player &&
      typeof Player.MemberNumber === "number" &&
      Player.MemberNumber > 0
    );
  }

  function serverReady() {
    return !!(
      (typeof ServerIsConnected !== "undefined" && ServerIsConnected) &&
      (typeof ServerSocket !== "undefined" && ServerSocket)
    );
  }

  function getSdk() {
    return (
      window.bcModSdk ||
      window.bcModSDK ||
      (typeof bcModSdk !== "undefined" ? bcModSdk : null) ||
      (typeof bcModSDK !== "undefined" ? bcModSDK : null)
    );
  }

  /** Electron-BC has no Tampermonkey @require — load SDK at runtime if needed. */
  function loadSdk() {
    return new Promise(function (resolve, reject) {
      var existing = getSdk();
      if (existing && typeof existing.registerMod === "function") {
        resolve(existing);
        return;
      }
      var urls = [
        "https://cdn.jsdelivr.net/npm/bondage-club-mod-sdk@1.2.0/dist/bcmodsdk.js",
        "https://unpkg.com/bondage-club-mod-sdk@1.2.0/dist/bcmodsdk.js",
      ];
      var tryUrl = function (i) {
        if (i >= urls.length) {
          reject(new Error("bcModSdk load failed"));
          return;
        }
        var s = document.createElement("script");
        s.src = urls[i];
        s.async = true;
        s.onload = function () {
          var sdk = getSdk();
          if (sdk && typeof sdk.registerMod === "function") resolve(sdk);
          else tryUrl(i + 1);
        };
        s.onerror = function () {
          tryUrl(i + 1);
        };
        (document.head || document.documentElement).appendChild(s);
      };
      tryUrl(0);
    });
  }

  function hit(x, y, w, h) {
    if (typeof MouseIn === "function") return MouseIn(x, y, w, h);
    return MouseX >= x && MouseX < x + w && MouseY >= y && MouseY < y + h;
  }

  function localMsg(html) {
    if (typeof ChatRoomSendLocal === "function") {
      ChatRoomSendLocal(
        "<p style='" + MSG_STYLE + "'><b>" + MOD_NAME + "</b><br>" + html + "</p>"
      );
    } else {
      console.log("[" + MOD_SHORT + "]", String(html).replace(/<[^>]+>/g, " "));
    }
  }

  function echoLoaded() {
    try {
      var family = (Player && Player.AssetFamily) || "Female3DCG";
      if (typeof AssetGet === "function") {
        if (AssetGet(family, EYE_LEFT, "眼睛1") || AssetGet(family, EYE_RIGHT, "眼睛1")) {
          return true;
        }
      }
      if (typeof AssetGroupGet === "function") {
        if (AssetGroupGet(family, EYE_LEFT) && AssetGroupGet(family, EYE_RIGHT)) {
          return true;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  function emptyPreset() {
    return { saved: false, left: null, right: null, name: "" };
  }

  function makePack(name) {
    var presets = {};
    var i;
    for (i = 1; i <= DEFAULT_PRESET_COUNT; i++) {
      presets[i] = emptyPreset();
    }
    return {
      name: typeof name === "string" ? name : "",
      presetCount: DEFAULT_PRESET_COUNT,
      presets: presets,
    };
  }

  function defaultSettings() {
    return {
      version: MOD_VERSION,
      language: "ru",
      buttonsEnable: true,
      buttonX: null,
      buttonY: null,
      activePackId: 1,
      packCount: 1,
      blinkEnable: true,
      blinkDelayMs: DEFAULT_BLINK_MS,
      packs: { 1: makePack("") },
    };
  }

  function normalizePack(pack, fallbackName) {
    if (!pack || typeof pack !== "object") pack = makePack(fallbackName || "");
    if (typeof pack.name !== "string") pack.name = fallbackName || "";
    if (!pack.presets || typeof pack.presets !== "object") pack.presets = {};
    var count = parseInt(pack.presetCount, 10);
    if (isNaN(count)) {
      var keys = Object.keys(pack.presets)
        .map(Number)
        .filter(function (k) {
          return k > 0;
        });
      count = keys.length ? Math.max.apply(null, keys) : DEFAULT_PRESET_COUNT;
    }
    if (count < MIN_PRESETS) count = MIN_PRESETS;
    if (count > MAX_PRESETS) count = MAX_PRESETS;
    pack.presetCount = count;
    var i;
    for (i = 1; i <= count; i++) {
      if (!pack.presets[i]) pack.presets[i] = emptyPreset();
      if (typeof pack.presets[i].name !== "string") pack.presets[i].name = "";
    }
    return pack;
  }

  function migrateToPacks(s) {
    if (s.packs && typeof s.packs === "object") return;
    var oldPresets = s.presets && typeof s.presets === "object" ? s.presets : {};
    var oldCount = parseInt(s.presetCount, 10);
    if (isNaN(oldCount)) {
      var keys = Object.keys(oldPresets)
        .map(Number)
        .filter(function (k) {
          return k > 0;
        });
      oldCount = keys.length ? Math.max.apply(null, keys) : DEFAULT_PRESET_COUNT;
    }
    var pack = {
      name: "",
      presetCount: oldCount,
      presets: oldPresets,
    };
    s.packs = { 1: normalizePack(pack, "") };
    s.packCount = 1;
    s.activePackId = 1;
    delete s.presets;
    delete s.presetCount;
  }

  function ensureSettings() {
    if (!Player.ExtensionSettings) Player.ExtensionSettings = {};
    if (!Player.ExtensionSettings[EXT_KEY]) {
      Player.ExtensionSettings[EXT_KEY] = defaultSettings();
    }
    var s = Player.ExtensionSettings[EXT_KEY];
    if (s.language !== "en" && s.language !== "ru") s.language = "ru";
    if (typeof s.buttonsEnable !== "boolean") s.buttonsEnable = true;
    if (s.buttonX != null && typeof s.buttonX !== "number") s.buttonX = null;
    if (s.buttonY != null && typeof s.buttonY !== "number") s.buttonY = null;
    if (typeof s.blinkEnable !== "boolean") s.blinkEnable = true;
    var delay = parseInt(s.blinkDelayMs, 10);
    if (isNaN(delay) || delay < 0) delay = DEFAULT_BLINK_MS;
    if (delay > 2000) delay = 2000;
    s.blinkDelayMs = delay;

    migrateToPacks(s);
    if (!s.packs || typeof s.packs !== "object") s.packs = { 1: makePack("") };

    var packCount = parseInt(s.packCount, 10);
    if (isNaN(packCount)) {
      var pkeys = Object.keys(s.packs)
        .map(Number)
        .filter(function (k) {
          return k > 0;
        });
      packCount = pkeys.length ? Math.max.apply(null, pkeys) : 1;
    }
    if (packCount < MIN_PACKS) packCount = MIN_PACKS;
    if (packCount > MAX_PACKS) packCount = MAX_PACKS;
    s.packCount = packCount;

    var pid;
    for (pid = 1; pid <= packCount; pid++) {
      s.packs[pid] = normalizePack(s.packs[pid], "");
    }

    var active = parseInt(s.activePackId, 10);
    if (isNaN(active) || active < 1 || active > packCount) active = 1;
    s.activePackId = active;

    // compatibility mirrors for dropdown fill checks that used s.presets
    s.presets = s.packs[active].presets;
    s.presetCount = s.packs[active].presetCount;

    Player[EXT_KEY] = s;
    return s;
  }

  function getActivePack() {
    var s = ensureSettings();
    return s.packs[s.activePackId];
  }

  function getPackCount() {
    return ensureSettings().packCount;
  }

  function getPresetCount() {
    var pack = getActivePack();
    return pack.presetCount;
  }

  function getPackName(id) {
    var s = ensureSettings();
    var pack = s.packs[id];
    if (pack && typeof pack.name === "string" && pack.name.trim()) return pack.name.trim();
    return t("packDefault", id);
  }

  function getActivePackName() {
    return getPackName(ensureSettings().activePackId);
  }

  function saveSettings() {
    var s = ensureSettings();
    Player.ExtensionSettings[EXT_KEY] = s;
    if (typeof ServerPlayerExtensionSettingsSync === "function") {
      ServerPlayerExtensionSettingsSync(EXT_KEY);
    }
  }

  function cloneJson(value) {
    if (value == null) return value;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (e) {
      return value;
    }
  }

  function cloneColor(color) {
    if (color == null) return "Default";
    return cloneJson(color);
  }

  function snapshotEye(groupName) {
    var item = InventoryGet(Player, groupName);
    if (!item || !item.Asset || !item.Asset.Name) return null;
    return {
      name: item.Asset.Name,
      color: cloneColor(item.Color),
      description: item.Asset.Description || item.Asset.Name,
      property: cloneJson(item.Property) || {},
    };
  }

  function describeSlot(slot) {
    if (!slot) return "None";
    return slot.description || slot.name || "None";
  }

  function describePreset(p) {
    if (!p || !p.saved) return t("empty");
    return "L:" + describeSlot(p.left) + " / R:" + describeSlot(p.right);
  }

  function getPresetName(n) {
    var pack = getActivePack();
    var p = pack.presets[n];
    if (p && typeof p.name === "string" && p.name.trim()) return p.name.trim();
    return t("presetDefault", n);
  }

  function truncateLabel(text, maxLen) {
    text = String(text || "");
    maxLen = maxLen || 14;
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen - 1) + "\u2026";
  }

  function renamePreset(n) {
    var pack = getActivePack();
    if (n < 1 || n > getPresetCount()) {
      notify(t("noPreset", n));
      return false;
    }
    if (!pack.presets[n]) pack.presets[n] = emptyPreset();
    var current = pack.presets[n].name || getPresetName(n);
    var next = window.prompt(t("renamePrompt", n), current);
    if (next == null) return false;
    next = String(next).trim();
    if (next.length > 40) next = next.slice(0, 40);
    pack.presets[n].name = next;
    saveSettings();
    notify(t("renamed", n, getPresetName(n)));
    return true;
  }

  function renamePack() {
    var s = ensureSettings();
    var id = s.activePackId;
    var pack = s.packs[id];
    if (!pack) {
      notify(t("noPack", id));
      return false;
    }
    var current = pack.name || getPackName(id);
    var next = window.prompt(t("renamePackPrompt", id), current);
    if (next == null) return false;
    next = String(next).trim();
    if (next.length > 40) next = next.slice(0, 40);
    pack.name = next;
    saveSettings();
    notify(t("packRenamed", id, getPackName(id)));
    return true;
  }

  function setActivePack(id) {
    var s = ensureSettings();
    if (id < 1 || id > s.packCount) return;
    s.activePackId = id;
    prefPage = 0;
    saveSettings();
    prefStatus = t("packActive", getPackName(id), id, s.packCount);
  }

  function addPack() {
    var s = ensureSettings();
    if (s.packCount >= MAX_PACKS) {
      notify(t("maxPacks", MAX_PACKS));
      return;
    }
    s.packCount += 1;
    s.packs[s.packCount] = makePack("");
    s.activePackId = s.packCount;
    prefPage = 0;
    saveSettings();
    notify(t("packAdded", s.packCount));
  }

  function removePack() {
    var s = ensureSettings();
    if (s.packCount <= MIN_PACKS) {
      notify(t("minPacks", MIN_PACKS));
      return;
    }
    var removed = s.activePackId;
    // Always remove the last pack if active is not last; if active is last, remove it.
    // Simpler UX: remove active pack and reindex remaining packs 1..n-1
    var nextPacks = {};
    var nextId = 1;
    var pid;
    for (pid = 1; pid <= s.packCount; pid++) {
      if (pid === removed) continue;
      nextPacks[nextId] = s.packs[pid];
      nextId++;
    }
    s.packs = nextPacks;
    s.packCount = nextId - 1;
    if (s.activePackId > s.packCount) s.activePackId = s.packCount;
    prefPage = 0;
    saveSettings();
    notify(t("packRemoved", removed));
  }

  function applyEye(groupName, slot) {
    if (!slot || !slot.name) {
      InventoryRemove(Player, groupName);
      return;
    }
    var item = InventoryWear(Player, slot.name, groupName, cloneColor(slot.color));
    if (item) {
      item.Property = slot.property ? cloneJson(slot.property) : {};
    }
  }

  /**
   * Sync ECHO eye items.
   * light=true: only item updates — full ChatRoomCharacterUpdate resets Eyes expression
   * and was causing: standard → squint → standard.
   */
  function refreshEyes(light) {
    var i;
    for (i = 0; i < EYE_GROUPS.length; i++) {
      if (typeof ChatRoomCharacterItemUpdate === "function" && CurrentScreen === "ChatRoom") {
        ChatRoomCharacterItemUpdate(Player, EYE_GROUPS[i]);
      }
    }
    if (light) return;
    if (CurrentScreen === "ChatRoom" && typeof ChatRoomCharacterUpdate === "function") {
      ChatRoomCharacterUpdate(Player);
    } else if (typeof CharacterRefresh === "function") {
      CharacterRefresh(Player, false);
    }
  }

  /** Read current Eyes/Eyes2 expression name, or null for default. */
  function readEyeExpression(group) {
    try {
      var item = InventoryGet(Player, group);
      if (item && item.Property && typeof item.Property.Expression === "string") {
        if (item.Property.Expression) return item.Property.Expression;
      }
    } catch (e) {
      /* ignore */
    }
    try {
      if (Player && Player.ActiveExpression) {
        var ae = Player.ActiveExpression[group];
        if (typeof ae === "string" && ae) return ae;
      }
    } catch (e2) {
      /* ignore */
    }
    return null;
  }

  /** Only facial expression — do not refresh appearance/items. */
  function setEyeExpression(group, expression) {
    var value = expression == null || expression === "" ? null : expression;
    if (typeof CharacterSetFacialExpression === "function") {
      CharacterSetFacialExpression(Player, group, value);
      return;
    }
    try {
      var item = InventoryGet(Player, group);
      if (item) {
        if (!item.Property) item.Property = {};
        if (value == null) delete item.Property.Expression;
        else item.Property.Expression = value;
      }
    } catch (e) {
      /* ignore */
    }
  }

  function applyPresetEyes(preset, light) {
    applyEye(EYE_LEFT, preset.left);
    applyEye(EYE_RIGHT, preset.right);
    refreshEyes(!!light);
  }

  function notify(msg, asHtml) {
    prefStatus = String(msg).replace(/<[^>]+>/g, " ");
    if (CurrentScreen === "ChatRoom") {
      localMsg(asHtml ? msg : prefStatus);
    }
  }

  function savePreset(n) {
    if (!echoLoaded()) {
      notify(t("echoMissing"));
      return false;
    }
    var pack = getActivePack();
    if (n < 1 || n > getPresetCount()) {
      notify(t("noPreset", n));
      return false;
    }
    var keepName = (pack.presets[n] && pack.presets[n].name) || "";
    pack.presets[n] = {
      saved: true,
      name: keepName,
      left: snapshotEye(EYE_LEFT),
      right: snapshotEye(EYE_RIGHT),
    };
    saveSettings();
    notify(
      t(
        "saved",
        getPresetName(n),
        describeSlot(pack.presets[n].left),
        describeSlot(pack.presets[n].right)
      ),
      true
    );
    return true;
  }

  function loadPreset(n, quiet) {
    if (!echoLoaded()) {
      notify(t("echoMissing"));
      return false;
    }
    var s = ensureSettings();
    var pack = getActivePack();
    if (n < 1 || n > getPresetCount()) {
      notify(t("noPreset", n));
      return false;
    }
    var preset = pack.presets[n];
    if (!preset || !preset.saved) {
      notify(t("emptyPreset", n));
      return false;
    }

    var useBlink = !!quiet && s.blinkEnable;
    // Capture expression BEFORE touching anything (e.g. squint)
    var prevEyes = readEyeExpression("Eyes");
    var prevEyes2 = readEyeExpression("Eyes2");

    // 1) Gaze change first, keep current expression (light sync — no full CharUpdate)
    applyPresetEyes(preset, true);

    if (!useBlink) {
      // Full sync when not blinking
      refreshEyes(false);
      if (!quiet) {
        notify(
          t(
            "loaded",
            getPresetName(n),
            describeSlot(preset.left),
            describeSlot(preset.right)
          ),
          true
        );
      }
      return true;
    }

    // Target sequence:
    //   look new direction (keep expression) → Closed (blink) → restore expression
    // Must NOT call applyPresetEyes after restoring expression.
    var delay = Math.max(16, s.blinkDelayMs || DEFAULT_BLINK_MS);

    if (blinkTimer) {
      clearTimeout(blinkTimer);
      blinkTimer = null;
    }

    blinkTimer = setTimeout(function () {
      // 2) Closed lids (menu: soft closed eyes)
      setEyeExpression("Eyes", BLINK_EXPRESSION);
      setEyeExpression("Eyes2", BLINK_EXPRESSION);

      blinkTimer = setTimeout(function () {
        blinkTimer = null;
        // 3) Restore original expression — last step, no eye re-apply after this
        setEyeExpression("Eyes", prevEyes);
        setEyeExpression("Eyes2", prevEyes2);
      }, delay);
    }, delay);

    return true;
  }

  function clearPreset(n) {
    var pack = getActivePack();
    if (n < 1 || n > getPresetCount()) {
      notify(t("noPreset", n));
      return false;
    }
    var keepName = (pack.presets[n] && pack.presets[n].name) || "";
    pack.presets[n] = emptyPreset();
    pack.presets[n].name = keepName;
    saveSettings();
    notify(t("cleared", getPresetName(n)));
    return true;
  }

  function addPresetSlot() {
    var pack = getActivePack();
    if (getPresetCount() >= MAX_PRESETS) {
      notify(t("maxPresets", MAX_PRESETS));
      return;
    }
    pack.presetCount = getPresetCount() + 1;
    pack.presets[pack.presetCount] = emptyPreset();
    saveSettings();
    prefPage = Math.floor((pack.presetCount - 1) / PRESETS_PER_PAGE);
    notify(t("added", pack.presetCount));
  }

  function removePresetSlot() {
    var pack = getActivePack();
    var n = getPresetCount();
    if (n <= MIN_PRESETS) {
      notify(t("minPresets", MIN_PRESETS));
      return;
    }
    delete pack.presets[n];
    pack.presetCount = n - 1;
    saveSettings();
    var maxPage = Math.max(0, Math.ceil(pack.presetCount / PRESETS_PER_PAGE) - 1);
    if (prefPage > maxPage) prefPage = maxPage;
    notify(t("removed", n, pack.presetCount));
  }

  function promptBlinkDelay() {
    var s = ensureSettings();
    var next = window.prompt(t("blinkDelayPrompt"), String(s.blinkDelayMs));
    if (next == null) return;
    var n = parseInt(next, 10);
    if (isNaN(n) || n < 0) n = DEFAULT_BLINK_MS;
    if (n > 2000) n = 2000;
    s.blinkDelayMs = n;
    saveSettings();
    prefStatus = t("blinkStatus", s.blinkEnable ? t("on") : t("off"), s.blinkDelayMs);
  }

  function getSubcommands() {
    var n = getPresetCount();
    var list = ["help", "status", "buttons", "add", "remove"];
    var i;
    for (i = 1; i <= n; i++) {
      list.push("eye" + i);
      list.push("eyeload" + i);
      list.push("eyeclear" + i);
    }
    return list;
  }

  function showStatus() {
    var s = ensureSettings();
    var n = getPresetCount();
    var pack = getActivePack();
    var lines = [
      t("statusButtons", s.buttonsEnable ? "ON" : "OFF"),
      t("statusPack", getActivePackName(), s.activePackId, s.packCount),
      t("statusCount", n),
      t("statusBlink", s.blinkEnable ? "ON" : "OFF", s.blinkDelayMs),
    ];
    var i;
    for (i = 1; i <= n; i++) {
      lines.push(t("statusLine", i, getPresetName(i), describePreset(pack.presets[i])));
    }
    lines.push(
      t(
        "statusCurrent",
        describeSlot(snapshotEye(EYE_LEFT)),
        describeSlot(snapshotEye(EYE_RIGHT))
      )
    );
    localMsg(lines.join("<br>"));
  }

  function showHelp() {
    localMsg(
      [
        t("helpIntro", MOD_VERSION),
        t("helpMenu", MOD_NAME),
        "",
        t("helpEye", CMD_TAG),
        t("helpLoad", CMD_TAG),
        t("helpClear", CMD_TAG),
        t("helpAdd", CMD_TAG),
        t("helpMisc", CMD_TAG),
      ].join("<br>")
    );
  }

  function handleCommand(rawArgs) {
    var parts = String(rawArgs || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    var cmd = (parts[0] || "help").toLowerCase();
    var s;

    if (cmd === "help") return showHelp();
    if (cmd === "status") return showStatus();
    if (cmd === "buttons") {
      s = ensureSettings();
      s.buttonsEnable = !s.buttonsEnable;
      saveSettings();
      localMsg(t("buttonsToggled", s.buttonsEnable ? "ON" : "OFF"));
      return;
    }
    if (cmd === "add") return addPresetSlot();
    if (cmd === "remove") return removePresetSlot();

    var saveMatch = /^eye(\d+)$/.exec(cmd);
    if (saveMatch) return savePreset(Number(saveMatch[1]));

    var loadMatch = /^eyeload(\d+)$/.exec(cmd);
    if (loadMatch) return loadPreset(Number(loadMatch[1]), false);

    var clearMatch = /^eyeclear(\d+)$/.exec(cmd);
    if (clearMatch) return clearPreset(Number(clearMatch[1]));

    localMsg(t("unknown", CMD_TAG));
  }

  /** One toggle button + expandable preset list (canvas dropdown), draggable. */
  var dropdownOpen = false;
  var BTN_W = 45;
  var BTN_H = 45;
  var DRAG_THRESHOLD = 12;
  var drag = {
    pointerId: null,
    pending: false,
    active: false,
    moved: false,
    suppressClick: false,
    startGX: 0,
    startGY: 0,
    originX: 0,
    originY: 0,
  };
  var dragBound = false;

  function defaultAnchorPos() {
    var bcar = Player && Player.BCAR && Player.BCAR.bcarSettings;
    var pos = (bcar && bcar.animationButtonsPosition) || "upperleft";
    var x0 = 0;
    var y0 = 270;
    if (pos === "lowerleft") {
      x0 = 0;
      y0 = 700;
    } else if (pos === "lowerright") {
      x0 = 955;
      y0 = 700;
    }
    return { x: x0, y: y0 };
  }

  function clampButtonPos(x, y) {
    var maxX = 2000 - BTN_W;
    var maxY = 1000 - BTN_H;
    if (typeof CanvasWidth === "number" && CanvasWidth > 0) maxX = CanvasWidth - BTN_W;
    if (typeof CanvasHeight === "number" && CanvasHeight > 0) maxY = CanvasHeight - BTN_H;
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > maxX) x = maxX;
    if (y > maxY) y = maxY;
    return { x: x, y: y };
  }

  function getDropdownAnchor() {
    var s = ensureSettings();
    var def = defaultAnchorPos();
    var x = typeof s.buttonX === "number" ? s.buttonX : def.x;
    var y = typeof s.buttonY === "number" ? s.buttonY : def.y;
    var c = clampButtonPos(x, y);
    return { x: c.x, y: c.y, w: BTN_W, h: BTN_H };
  }

  function resetButtonPosition() {
    var s = ensureSettings();
    s.buttonX = null;
    s.buttonY = null;
    saveSettings();
    notify(t("posReset"));
  }

  function getGameCanvasEl() {
    if (typeof MainCanvas !== "undefined" && MainCanvas) {
      if (MainCanvas.canvas) return MainCanvas.canvas;
      if (typeof HTMLCanvasElement !== "undefined" && MainCanvas instanceof HTMLCanvasElement) {
        return MainCanvas;
      }
    }
    return document.getElementById("MainCanvas") || document.querySelector("canvas");
  }

  function clientToGame(clientX, clientY) {
    var el = getGameCanvasEl();
    if (!el || !el.getBoundingClientRect) {
      return { x: MouseX, y: MouseY };
    }
    var rect = el.getBoundingClientRect();
    var gw = typeof CanvasWidth === "number" && CanvasWidth > 0 ? CanvasWidth : 2000;
    var gh = typeof CanvasHeight === "number" && CanvasHeight > 0 ? CanvasHeight : 1000;
    return {
      x: ((clientX - rect.left) / Math.max(1, rect.width)) * gw,
      y: ((clientY - rect.top) / Math.max(1, rect.height)) * gh,
    };
  }

  function hitCoords(gx, gy, x, y, w, h) {
    return gx >= x && gx < x + w && gy >= y && gy < y + h;
  }

  function bindDragListeners() {
    if (dragBound) return;
    dragBound = true;
    var opts = { capture: true, passive: false };

    document.addEventListener(
      "pointerdown",
      function (e) {
        if (e.button != null && e.button !== 0) return;
        if (CurrentScreen !== "ChatRoom") return;
        var s = ensureSettings();
        if (!s.buttonsEnable) return;
        var g = clientToGame(e.clientX, e.clientY);
        var a = getDropdownAnchor();
        if (!hitCoords(g.x, g.y, a.x, a.y, a.w, a.h)) return;
        drag.pointerId = e.pointerId;
        drag.pending = true;
        drag.active = false;
        drag.moved = false;
        drag.startGX = g.x;
        drag.startGY = g.y;
        drag.originX = a.x;
        drag.originY = a.y;
      },
      opts
    );

    document.addEventListener(
      "pointermove",
      function (e) {
        if (!drag.pending && !drag.active) return;
        if (drag.pointerId != null && e.pointerId !== drag.pointerId) return;
        var g = clientToGame(e.clientX, e.clientY);
        var dx = g.x - drag.startGX;
        var dy = g.y - drag.startGY;
        if (!drag.active) {
          if (dx * dx + dy * dy < DRAG_THRESHOLD * DRAG_THRESHOLD) return;
          drag.active = true;
          drag.moved = true;
          dropdownOpen = false;
        }
        var s = ensureSettings();
        var c = clampButtonPos(drag.originX + dx, drag.originY + dy);
        s.buttonX = c.x;
        s.buttonY = c.y;
      },
      opts
    );

    function endDrag(e) {
      if (!drag.pending && !drag.active) return;
      if (e && drag.pointerId != null && e.pointerId !== drag.pointerId) return;
      if (drag.active) {
        saveSettings();
        drag.suppressClick = true;
      }
      drag.pending = false;
      drag.active = false;
      drag.pointerId = null;
    }

    document.addEventListener("pointerup", endDrag, opts);
    document.addEventListener("pointercancel", endDrag, opts);
  }

  function getGameWidth() {
    return typeof CanvasWidth === "number" && CanvasWidth > 0 ? CanvasWidth : 2000;
  }

  function getGameHeight() {
    return typeof CanvasHeight === "number" && CanvasHeight > 0 ? CanvasHeight : 1000;
  }

  function findChatLeftGameX() {
    var canvas = getGameCanvasEl();
    if (!canvas || !canvas.getBoundingClientRect) return null;
    var cRect = canvas.getBoundingClientRect();
    var gw = getGameWidth();
    var selectors = [
      "#TextAreaChatLog",
      "#ChatRoomChatLog",
      "#InputChat",
      "textarea#InputChat",
      "div[id*='ChatLog']",
      "div[id*='chat-log' i]",
    ];
    var i;
    for (i = 0; i < selectors.length; i++) {
      var el = null;
      try {
        el = document.querySelector(selectors[i]);
      } catch (e) {
        continue;
      }
      if (!el) continue;
      if (el.tagName === "TEXTAREA" && el.parentElement) el = el.parentElement;
      var r = el.getBoundingClientRect();
      if (r.width < 50 || r.height < 50) continue;
      var leftGame = ((r.left - cRect.left) / Math.max(1, cRect.width)) * gw;
      if (leftGame > 200 && leftGame < gw - 50) return leftGame;
    }
    return null;
  }

  function shouldOpenDropdownLeft(anchor, itemW) {
    if (anchor.x + itemW > getGameWidth() - 8) return true;
    var chatLeft = findChatLeftGameX();
    var mid = chatLeft != null ? chatLeft * 0.5 : getGameWidth() * 0.5;
    return anchor.x + anchor.w / 2 > mid;
  }

  function shouldOpenDropdownUp(anchor, count, itemH) {
    return anchor.y + anchor.h + count * itemH > getGameHeight() - 8;
  }

  function getDropdownItems() {
    var a = getDropdownAnchor();
    var count = getPresetCount();
    var items = [];
    var i;
    var itemH = 40;
    var itemW = 160;
    var openLeft = shouldOpenDropdownLeft(a, itemW);
    var openUp = shouldOpenDropdownUp(a, count, itemH);
    var baseX = openLeft ? a.x + a.w - itemW : a.x;
    if (baseX < 0) baseX = 0;

    for (i = 1; i <= count; i++) {
      var title = getPresetName(i);
      var y = openUp ? a.y - i * itemH : a.y + a.h + (i - 1) * itemH;
      items.push({
        n: i,
        x: baseX,
        y: y,
        w: itemW,
        h: itemH,
        label: truncateLabel(title, 14),
        tip: title,
        openLeft: openLeft,
        openUp: openUp,
      });
    }
    return items;
  }

  function drawDropdownMenu() {
    var a = getDropdownAnchor();
    var label = dropdownOpen ? "E\u25B2" : "E\u25BC";
    var color = "White";
    if (drag.active) color = "#F0A500";
    else if (dropdownOpen) color = "#7EB6FF";
    DrawButton(
      a.x,
      a.y,
      a.w,
      a.h,
      label,
      color,
      "",
      drag.active ? t("tipDrag") : dropdownOpen ? t("tipHide") : t("tipShow")
    );
    if (!dropdownOpen || drag.active) return;
    var items = getDropdownItems();
    var pack = getActivePack();
    var i;
    for (i = 0; i < items.length; i++) {
      var btn = items[i];
      var filled = pack.presets[btn.n] && pack.presets[btn.n].saved;
      DrawButton(
        btn.x,
        btn.y,
        btn.w,
        btn.h,
        btn.label,
        filled ? "#5FBD7A" : "White",
        "",
        btn.tip
      );
    }
  }

  function handleDropdownClick() {
    if (drag.suppressClick || drag.moved) {
      drag.suppressClick = false;
      drag.moved = false;
      return true;
    }
    var a = getDropdownAnchor();
    if (hit(a.x, a.y, a.w, a.h)) {
      dropdownOpen = !dropdownOpen;
      return true;
    }
    if (!dropdownOpen) return false;
    var items = getDropdownItems();
    var i;
    for (i = 0; i < items.length; i++) {
      var btn = items[i];
      if (hit(btn.x, btn.y, btn.w, btn.h)) {
        loadPreset(btn.n, true);
        dropdownOpen = false;
        return true;
      }
    }
    dropdownOpen = false;
    return false;
  }

  function registerHooks(modApi) {
    bindDragListeners();

    modApi.hookFunction("ChatRoomTopMenuSync", 5, function (args, next) {
      var s = ensureSettings();
      if (s.buttonsEnable && CurrentScreen === "ChatRoom") {
        drawDropdownMenu();
      } else {
        dropdownOpen = false;
      }
      return next(args);
    });

    modApi.hookFunction("ChatRoomClick", 5, function (args, next) {
      var s = ensureSettings();
      if (s.buttonsEnable && CurrentScreen === "ChatRoom") {
        if (handleDropdownClick()) return;
      }
      return next(args);
    });
  }

  function registerCommand() {
    if (typeof CommandCombine !== "function") {
      console.warn("[" + MOD_SHORT + "] CommandCombine missing");
      return;
    }
    CommandCombine([
      {
        Tag: CMD_TAG,
        Description: "<b>or /" + CMD_TAG + " help</b>: Echo eye presets.",
        AutoComplete: function (words) {
          var subs = getSubcommands();
          if (!words || words.length === 0) {
            ChatRoomSendLocal(
              "<div style='" + MSG_STYLE + "'><b>" + subs.join("</b> · <b>") + "</b></div>"
            );
            return;
          }
          if (words.length !== 1) return;
          var matches = subs.filter(function (s) {
            return s.indexOf(words[0]) === 0;
          });
          if (matches.length === 1) {
            ElementValue("InputChat", "/" + CMD_TAG + " " + matches[0]);
          } else if (matches.length > 1) {
            ChatRoomSendLocal(
              "<div style='" + MSG_STYLE + "'><b>" + matches.join("</b> · <b>") + "</b></div>"
            );
          }
        },
        Action: function (args) {
          handleCommand(args);
        },
      },
    ]);
  }

  // ─── Preference / Extensions menu ─────────────────────────────────────────

  function prefLoad() {
    prefStatus = "";
    prefPage = 0;
    ensureSettings();
  }

  function prefExit() {
    saveSettings();
    if (typeof PreferenceSubscreenExtensionsClear === "function") {
      PreferenceSubscreenExtensionsClear();
    }
    return true;
  }

  function prefRun() {
    var s = ensureSettings();
    var pack = getActivePack();
    var count = getPresetCount();
    var align = MainCanvas && MainCanvas.textAlign;

    DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
    if (typeof DrawCharacter === "function") {
      DrawCharacter(Player, 50, 50, 0.9);
    }

    if (MainCanvas) MainCanvas.textAlign = "left";
    DrawText("- " + MOD_NAME + " v" + MOD_VERSION + " -", 500, 110, "Black", "Gray");
    DrawText(
      t("countLine", getActivePackName(), count),
      500,
      145,
      "Black",
      "Gray"
    );
    if (MainCanvas) MainCanvas.textAlign = "center";

    DrawButton(1500, 85, 200, 50, t("langBtn"), "White", "", t("langTip"));

    // Pack row
    DrawButton(500, 165, 50, 45, "<", "White", "", t("tipPrevPack"));
    DrawButton(560, 165, 50, 45, ">", "White", "", t("tipNextPack"));
    DrawButton(620, 165, 140, 45, t("renamePack"), "White", "", t("tipRenamePack"));
    DrawButton(770, 165, 110, 45, t("addPack"), "White", "", t("tipAddPack"));
    DrawButton(890, 165, 110, 45, t("removePack"), "White", "", t("tipRemovePack"));
    DrawButton(
      1010,
      165,
      160,
      45,
      s.blinkEnable ? t("blinkOn") : t("blinkOff"),
      s.blinkEnable ? "#5FBD7A" : "#AAAAAA",
      "",
      t("tipBlink")
    );
    DrawButton(1180, 165, 100, 45, s.blinkDelayMs + "ms", "White", "", t("tipBlinkDelay"));

    // Toggle chat buttons / preset slots / reset
    DrawButton(
      500,
      220,
      220,
      45,
      s.buttonsEnable ? t("buttonsOn") : t("buttonsOff"),
      s.buttonsEnable ? "#5FBD7A" : "#AAAAAA",
      "",
      t("tipButtons")
    );
    DrawButton(740, 220, 130, 45, t("addPreset"), "White", "", t("tipAdd"));
    DrawButton(880, 220, 130, 45, t("removePreset"), "White", "", t("tipRemove"));
    DrawButton(1020, 220, 140, 45, t("resetPos"), "White", "", t("tipResetPos"));

    // Pagination
    var pages = Math.max(1, Math.ceil(count / PRESETS_PER_PAGE));
    if (prefPage >= pages) prefPage = pages - 1;
    if (prefPage < 0) prefPage = 0;
    var start = prefPage * PRESETS_PER_PAGE + 1;
    var end = Math.min(count, start + PRESETS_PER_PAGE - 1);

    if (MainCanvas) MainCanvas.textAlign = "left";
    DrawText(t("page", prefPage + 1, pages), 500, 290, "Black", "Gray");
    if (MainCanvas) MainCanvas.textAlign = "center";

    if (pages > 1) {
      DrawButton(700, 265, 90, 40, "<", "White", "", t("tipPrev"));
      DrawButton(800, 265, 90, 40, ">", "White", "", t("tipNext"));
    }

    var row = 0;
    var n;
    for (n = start; n <= end; n++) {
      var y = 310 + row * 95;
      var p = pack.presets[n];

      if (MainCanvas) MainCanvas.textAlign = "left";
      DrawText(
        "#" + n + " «" + getPresetName(n) + "»  —  " + describePreset(p),
        500,
        y + 28,
        "Black",
        "Gray"
      );
      if (MainCanvas) MainCanvas.textAlign = "center";

      DrawButton(500, y + 45, 100, 40, t("rename"), "White", "", t("tipRename", n));
      DrawButton(610, y + 45, 120, 40, t("save"), "#7EB6FF", "", t("tipSave", n));
      DrawButton(740, y + 45, 120, 40, t("load"), "#5FBD7A", "", t("tipLoad", n));
      DrawButton(870, y + 45, 120, 40, t("clear"), "#E07A7A", "", t("tipClear", n));
      row++;
    }

    if (prefStatus) {
      if (MainCanvas) MainCanvas.textAlign = "left";
      DrawText(prefStatus, 500, 920, "Black", "Gray");
      if (MainCanvas) MainCanvas.textAlign = align || "center";
    } else if (MainCanvas) {
      MainCanvas.textAlign = align || "center";
    }
  }

  function prefClick() {
    var s = ensureSettings();
    var count = getPresetCount();

    if (hit(1815, 75, 90, 90)) {
      prefExit();
      return;
    }

    if (hit(1500, 85, 200, 50)) {
      toggleLanguage();
      return;
    }

    if (hit(500, 165, 50, 45)) {
      setActivePack(s.activePackId > 1 ? s.activePackId - 1 : s.packCount);
      return;
    }
    if (hit(560, 165, 50, 45)) {
      setActivePack(s.activePackId < s.packCount ? s.activePackId + 1 : 1);
      return;
    }
    if (hit(620, 165, 140, 45)) {
      renamePack();
      return;
    }
    if (hit(770, 165, 110, 45)) {
      addPack();
      return;
    }
    if (hit(890, 165, 110, 45)) {
      removePack();
      return;
    }
    if (hit(1010, 165, 160, 45)) {
      s.blinkEnable = !s.blinkEnable;
      saveSettings();
      prefStatus = t("blinkStatus", s.blinkEnable ? t("on") : t("off"), s.blinkDelayMs);
      return;
    }
    if (hit(1180, 165, 100, 45)) {
      promptBlinkDelay();
      return;
    }

    if (hit(500, 220, 220, 45)) {
      s.buttonsEnable = !s.buttonsEnable;
      saveSettings();
      prefStatus = t("buttonsStatus", s.buttonsEnable ? t("on") : t("off"));
      return;
    }

    if (hit(740, 220, 130, 45)) {
      addPresetSlot();
      return;
    }

    if (hit(880, 220, 130, 45)) {
      removePresetSlot();
      return;
    }

    if (hit(1020, 220, 140, 45)) {
      resetButtonPosition();
      return;
    }

    var pages = Math.max(1, Math.ceil(count / PRESETS_PER_PAGE));
    if (pages > 1) {
      if (hit(700, 265, 90, 40)) {
        prefPage = Math.max(0, prefPage - 1);
        return;
      }
      if (hit(800, 265, 90, 40)) {
        prefPage = Math.min(pages - 1, prefPage + 1);
        return;
      }
    }

    var start = prefPage * PRESETS_PER_PAGE + 1;
    var end = Math.min(count, start + PRESETS_PER_PAGE - 1);
    var row = 0;
    var n;
    for (n = start; n <= end; n++) {
      var y = 310 + row * 95;
      if (hit(500, y + 45, 100, 40)) {
        renamePreset(n);
        return;
      }
      if (hit(610, y + 45, 120, 40)) {
        savePreset(n);
        return;
      }
      if (hit(740, y + 45, 120, 40)) {
        loadPreset(n, false);
        return;
      }
      if (hit(870, y + 45, 120, 40)) {
        clearPreset(n);
        return;
      }
      row++;
    }
  }

  function registerPreferenceEntry() {
    if (typeof PreferenceRegisterExtensionSetting !== "function") {
      console.warn("[" + MOD_SHORT + "] PreferenceRegisterExtensionSetting missing");
      return;
    }
    try {
      PreferenceRegisterExtensionSetting({
        Identifier: EXT_KEY,
        ButtonText: MOD_NAME,
        Name: function () {
          return MOD_NAME;
        },
        Image: "Icons/Character.png",
        load: prefLoad,
        run: prefRun,
        click: prefClick,
        exit: prefExit,
      });
      console.log("[" + MOD_SHORT + "] Extensions menu registered");
    } catch (e) {
      console.warn("[" + MOD_SHORT + "] Extensions register failed", e);
    }
  }

  async function main() {
    console.log("[" + MOD_SHORT + "] starting v" + MOD_VERSION);

    // Stay alive on the login screen — do not time out before MemberNumber exists
    await waitFor(playerReady, 0, 400, "Player.MemberNumber");
    await waitFor(serverReady, 0, 400, "ServerIsConnected");

    var echoOk = false;
    try {
      await waitFor(echoLoaded, 60000, 250, "ECHO eye groups");
      echoOk = true;
    } catch (e) {
      console.warn("[" + MOD_SHORT + "] ECHO eyes not found yet — continuing");
    }

    ensureSettings();

    var sdk;
    try {
      sdk = await loadSdk();
    } catch (e) {
      console.error("[" + MOD_SHORT + "] bcModSdk missing", e);
      try {
        localMsg("bcModSdk failed to load (network / CDN).");
      } catch (e2) {
        /* ignore */
      }
      return;
    }

    var modApi = sdk.registerMod(
      { name: MOD_SHORT, fullName: MOD_NAME, version: MOD_VERSION },
      { allowReplace: true }
    );

    registerHooks(modApi);
    registerCommand();
    registerPreferenceEntry();

    console.log(
      "[" +
        MOD_SHORT +
        "] v" +
        MOD_VERSION +
        " loaded OK (echo=" +
        echoOk +
        ", packs=" +
        getPackCount() +
        ", presets=" +
        getPresetCount() +
        ")"
    );
    localMsg(
      t("ready", MOD_VERSION, MOD_NAME, CMD_TAG) + (echoOk ? "" : t("echoWarn"))
    );
  }

  main().catch(function (e) {
    console.error("[" + MOD_SHORT + "] init failed", e);
  });
})();
