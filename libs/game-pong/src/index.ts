/**
 * Public API for the Pong game library.
 * @packageDocumentation
 */
export { createGame } from './game.js';
export {
  DEFAULT_PONG_CONFIG,
  type GameApi,
  type PlayerInput,
  type PongConfig,
  type PongEvent,
  type PongEventHandler,
  type PongScore,
  type PongStatus,
  type Side,
} from './types.js';
export { PongState } from './state/pong-state.js';
export { applyScore, isWinningScore, serveDirection } from './logic/scoring.js';
export { reflectBallOnPaddle, reflectBallOnWall, type Ball, type Paddle } from './logic/collision.js';
export { nextAiVelocity } from './logic/ai.js';
export {
  createTournament,
  leaderboard,
  nextMatch,
  recordResult,
  type Match,
  type Player,
  type Tournament,
  type TournamentStatus,
} from './tournament.js';
export { LeaderboardStore } from './leaderboard-store.js';
export { PongHighScoreStore } from './high-score-store.js';
