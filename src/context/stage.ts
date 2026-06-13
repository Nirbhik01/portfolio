import { createContext } from 'react';

/**
 * Whether the panel a component lives in is the one currently in view.
 *
 * StageDeck provides this per panel; components like Section / ScrambleText read
 * it to trigger their entrance effects only when their panel becomes active.
 * Defaults to `false` so components rendered outside a deck (e.g. in unit tests)
 * render their final, static state.
 */
export const StageActiveContext = createContext(false);
