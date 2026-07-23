import type { LevelConfig } from '../core/types';

export const GAME_CONFIG = {
  defaultDuration: 60,
  cutRadius: 0.8,
  grassDensity: 80, // 每平方米草叶数
  fieldWidth: 10,
  fieldHeight: 16,
  cameraFrustum: 10,
  bladeHeight: 0.4,
  bladeWidth: 0.06,
  cutAnimationSpeed: 3.0,
  particleCount: 5,
  trailFadeSpeed: 2.0,
} as const;

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: '第一关',
    duration: 60,
    grassDensity: 80,
    fieldWidth: 10,
    fieldHeight: 16,
    cutRadius: 0.8,
  },
];
