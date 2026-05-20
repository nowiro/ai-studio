/**
 * Public types for the Pong game library. Framework-agnostic — no Angular import.
 * @see docs/analytical/specs/2026-05-08-pong-game/plan.md
 */

/** Side of the play area. */
export type Side = 'player' | 'cpu';

/** Vertical input direction from the human player. */
export type PlayerInput = 'up' | 'down' | 'idle';

/** Tunable configuration. All units are pixels and pixels-per-second. */
export interface PongConfig {
  readonly width: number;
  readonly height: number;
  readonly paddleWidth: number;
  readonly paddleHeight: number;
  readonly paddleSpeed: number;
  readonly ballSize: number;
  readonly ballSpeed: number;
  readonly aiSpeed: number;
  readonly winScore: number;
}

/** Default config — chosen so AC-4 (perfect AI play impossible) holds. */
export const DEFAULT_PONG_CONFIG: PongConfig = {
  width: 800,
  height: 600,
  paddleWidth: 12,
  paddleHeight: 96,
  paddleSpeed: 480,
  ballSize: 12,
  ballSpeed: 360,
  aiSpeed: 320,
  winScore: 5,
};

/** Score line. Immutable on every update. */
export interface PongScore {
  readonly player: number;
  readonly cpu: number;
}

/** Discriminated union of state-change events fired by `PongState`. */
export type PongEvent =
  | { readonly type: 'score'; readonly score: PongScore; readonly scoredBy: Side }
  | { readonly type: 'paddle-hit'; readonly side: Side }
  | { readonly type: 'wall-hit'; readonly side: 'top' | 'bottom' }
  | { readonly type: 'game-over'; readonly winner: Side; readonly score: PongScore }
  | { readonly type: 'started' }
  | { readonly type: 'paused' }
  | { readonly type: 'resumed' }
  | { readonly type: 'reset' };

/** Subscriber signature. */
export type PongEventHandler = (event: PongEvent) => void;

/** Lifecycle status of the game. */
export type PongStatus = 'idle' | 'playing' | 'paused' | 'over';

/**
 * Public surface returned by `createGame`. The Angular host bridges this to signals.
 * No Phaser type leaks across this boundary.
 */
export interface GameApi {
  /** Start a fresh round. Resets score and serves the ball. */
  readonly start: () => void;
  /** Pause the simulation. */
  readonly pause: () => void;
  /** Resume from a paused state. */
  readonly resume: () => void;
  /** Reset to the menu state without starting a round. */
  readonly reset: () => void;
  /** Toggle audio mute. */
  readonly mute: (muted: boolean) => void;
  /** Set audio volume (0..1). `0` is equivalent to muted. */
  readonly setVolume: (volume: number) => void;
  /** Runtime player paddle speed multiplier (1 = config default). */
  readonly setPlayerSpeedMultiplier: (multiplier: number) => void;
  /** Subscribe to game events; returns the unsubscribe function. */
  readonly subscribe: (handler: PongEventHandler) => () => void;
  /** Read-only view of the current score. */
  readonly score: () => PongScore;
  /** Read-only view of the current status. */
  readonly status: () => PongStatus;
  /** Tear down the underlying game instance and remove all listeners. */
  readonly destroy: () => void;
}
