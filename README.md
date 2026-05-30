# VSCRT Theme Pack

VSCRT is a retro-inspired Visual Studio Code theme extension with four variants:

- **VSCRT Amber Monitor**
- **VSCRT Green Monitor**
- **VSCRT Commodore 64**
- **VSCRT Apple IIc**

These themes emulate old CRT displays with high-contrast phosphor text on near-black backgrounds.
The extension sets a default terminal font stack and automatically switches terminal fonts per VSCRT theme.

## Install Locally

From this folder, package and install the extension:

1. Install the VS Code extension packaging tool:
   - `npm install -g @vscode/vsce`
2. Package the extension:
   - `vsce package`
3. If you already installed an older local build, remove it first or install the newly generated higher-version VSIX.
4. In VS Code, open Extensions panel and choose:
   - `Install from VSIX...`
5. Select the generated `.vsix` file.

## Activate Theme

1. Open Command Palette.
2. Run `Preferences: Color Theme`.
3. Select one of:
   - `VSCRT Amber Monitor`
   - `VSCRT Green Monitor`
   - `VSCRT Commodore 64`
   - `VSCRT Apple IIc`

## Notes

- This is a lightweight theme extension with no runtime dependencies.
- You can tweak colors in the files under `themes/` and repackage.
- For the strongest DOS look, install one of these fonts locally: `PxPlus IBM VGA8`, `Perfect DOS VGA 437 Win`, or `IBM VGA 8x16`.
- For the Apple IIc terminal look, install `Print Char 21` (fallbacks: `Monaco`, `Menlo`, `SF Mono`).

## Terminal Font Troubleshooting

- VS Code applies `terminal.integrated.fontFamily` only when those fonts are installed on your OS.
- VSCRT includes runtime logic that updates `terminal.integrated.fontFamily` when you switch between VSCRT themes and restores your previous terminal font when you leave VSCRT themes.
- You can disable this behavior with `"vscrt.autoTerminalFont": false`.
- You can manually force synchronization with the Command Palette action: `VSCRT: Re-apply Terminal Font`.
- If the terminal still looks unchanged, install the required fonts in your OS and reload VS Code.

Example per-theme overrides in your own settings:

```json
{
   "workbench.colorCustomizations": {
      "[VSCRT Commodore 64]": {
         "terminal.foreground": "#B8B8FF"
      }
   },
   "terminal.integrated.fontFamily": "C64 Pro Mono, C64 Pro, Monaco, Menlo, SF Mono"
}
```
