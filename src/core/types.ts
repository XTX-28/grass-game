// 游戏事件类型
export enum GameEvent {
  // 输入事件
  INPUT_MOVE = 'input:move',
  INPUT_START = 'input:start',
  INPUT_END = 'input:end',

  // 游戏事件
  GAME_START = 'game:start',
  GAME_TICK = 'game:tick',
  GAME_OVER = 'game:over',
  GAME_RESET = 'game:reset',
  GAME_CUT = 'game:cut',
  GAME_PAUSE = 'game:pause',
  GAME_RESUME = 'game:resume',

  // Combo 事件
  COMBO_UPDATE = 'combo:update',
  COMBO_RESET = 'combo:reset',

  // 分数事件
  SCORE_UPDATE = 'score:update',

  // UI 事件
  UI_RESTART = 'ui:restart',
  UI_START_CLICK = 'ui:start_click',
  UI_PAUSE_CLICK = 'ui:pause_click',
}

// 游戏状态枚举
export enum GameStateType {
  READY = 'ready',
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAME_OVER = 'game_over',
}

// 输入坐标
export interface InputCoord {
  x: number;
  y: number;
  worldX: number;
  worldZ: number;
}

// 分数更新数据
export interface ScoreData {
  coverage: number; // 0-100
  cutCount: number;
  totalCount: number;
  timeLeft: number;
}

// 关卡配置
export interface LevelConfig {
  id: number;
  name: string;
  duration: number; // 秒
  grassDensity: number; // 每平方米草叶数
  fieldWidth: number;
  fieldHeight: number;
  cutRadius: number; // 割草半径
}

// 草叶数据
export interface GrassBladeData {
  x: number;
  z: number;
  height: number;
  rotation: number;
  cutProgress: number; // 0 = 未割, 1 = 完全倒伏
}
