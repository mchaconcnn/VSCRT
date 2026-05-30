const vscode = require("vscode");

const CONFIG_SECTION = "terminal.integrated";
const CONFIG_KEY = "fontFamily";
const AUTO_SETTING = "vscrt.autoTerminalFont";
const PREV_FONT_STATE_KEY = "vscrt.previousTerminalFontFamily";
const MANAGED_STATE_KEY = "vscrt.hasManagedTerminalFont";

const THEME_FONT_MAP = {
  "VSCRT Amber Monitor": "PxPlus IBM VGA8, Perfect DOS VGA 437 Win, IBM VGA 8x16, Cascadia Mono",
  "VSCRT Green Monitor": "PxPlus IBM VGA8, Perfect DOS VGA 437 Win, IBM VGA 8x16, Cascadia Mono",
  "VSCRT Commodore 64": "C64 Pro Mono, C64 Pro, Monaco, Menlo, SF Mono",
  "VSCRT Apple IIc": "Print Char 21, Monaco, Menlo, SF Mono"
};

const VSCRT_THEME_LABELS = new Set(Object.keys(THEME_FONT_MAP));
const VSCRT_FONT_VALUES = new Set(Object.values(THEME_FONT_MAP));

function getCurrentTerminalFont() {
  const terminalConfig = vscode.workspace.getConfiguration(CONFIG_SECTION);
  return terminalConfig.get(CONFIG_KEY);
}

async function setCurrentTerminalFont(value) {
  const terminalConfig = vscode.workspace.getConfiguration(CONFIG_SECTION);
  await terminalConfig.update(CONFIG_KEY, value, vscode.ConfigurationTarget.Global);
}

async function synchronizeTerminalFont(context) {
  const autoEnabled = vscode.workspace.getConfiguration().get(AUTO_SETTING, true);
  const activeThemeLabel = vscode.window.activeColorTheme.label;

  if (!autoEnabled) {
    return;
  }

  const managed = context.globalState.get(MANAGED_STATE_KEY, false);
  const currentFont = getCurrentTerminalFont();
  const targetFont = THEME_FONT_MAP[activeThemeLabel];

  if (targetFont) {
    if (!managed) {
      await context.globalState.update(PREV_FONT_STATE_KEY, currentFont);
    } else if (!VSCRT_FONT_VALUES.has(currentFont)) {
      // Respect user edits done while managed by updating the restore target.
      await context.globalState.update(PREV_FONT_STATE_KEY, currentFont);
    }

    if (currentFont !== targetFont) {
      await setCurrentTerminalFont(targetFont);
    }

    await context.globalState.update(MANAGED_STATE_KEY, true);
    return;
  }

  if (!managed || VSCRT_THEME_LABELS.has(activeThemeLabel)) {
    return;
  }

  const previousFont = context.globalState.get(PREV_FONT_STATE_KEY);

  if (currentFont !== previousFont) {
    await setCurrentTerminalFont(previousFont);
  }

  await context.globalState.update(MANAGED_STATE_KEY, false);
}

function registerThemeSync(context) {
  context.subscriptions.push(
    vscode.window.onDidChangeActiveColorTheme(async () => {
      try {
        await synchronizeTerminalFont(context);
      } catch (error) {
        console.error("VSCRT: Failed to update terminal font on theme change", error);
      }
    })
  );
}

function registerCommands(context) {
  const reapplyCommand = vscode.commands.registerCommand(
    "vscrt.reapplyTerminalFont",
    async () => {
      try {
        await synchronizeTerminalFont(context);
        await vscode.window.showInformationMessage(
          "VSCRT terminal font synchronized with the active theme."
        );
      } catch (error) {
        console.error("VSCRT: Failed to re-apply terminal font", error);
        await vscode.window.showErrorMessage(
          "VSCRT could not re-apply the terminal font. See logs for details."
        );
      }
    }
  );

  context.subscriptions.push(reapplyCommand);
}

async function activate(context) {
  registerThemeSync(context);
  registerCommands(context);

  try {
    await synchronizeTerminalFont(context);
  } catch (error) {
    console.error("VSCRT: Failed to synchronize terminal font on activate", error);
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
