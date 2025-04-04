import { SetGamePF2e } from "@scripts/set-game-pf2e.ts";
import { InlineRollLinks } from "@scripts/ui/inline-roll-links.ts";
import { DestroyableManager } from "@util/destroyables.ts";
import { registerSheets } from "../register-sheets.ts";

/** This runs after game data has been requested and loaded from the servers, so entities exist */
export const Setup = {
    listen: (): void => {
        Hooks.once("setup", () => {
            InlineRollLinks.activatePF2eListeners();

            // Have the destroyable manager start observing the document body
            DestroyableManager.initialize();

            // Register actor and item sheets
            registerSheets();

            // Some of game.pf2e must wait until the setup phase
            SetGamePF2e.onSetup();

            // Forced panning is intrinsically annoying: change default to false
            game.settings.settings.get("core.chatBubblesPan").default = false;
            // Improve discoverability of map notes
            game.settings.settings.get("core.notesDisplayToggle").default = true;
            // Use grid fit mode
            if (game.release.generation >= 12 && game.release.build >= 331) {
                game.settings.settings.get("core.dynamicTokenRingFitMode").default = "grid";
            }

            // Set Hover by Owner as defaults for Default Token Configuration
            const defaultTokenSettingsDefaults = game.settings.settings.get("core.defaultToken").default;
            defaultTokenSettingsDefaults.displayName = CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER;
            defaultTokenSettingsDefaults.displayBars = CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER;
        });
    },
};
