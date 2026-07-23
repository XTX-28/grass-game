import type { LevelConfig } from '../core/types';

export const GAME_CONFIG = {
  defaultDuration: 60,
  cutRadius: 0.8,
  grassDensity: 80, // 每平方米草叶数 (桌面端)
  mobileGrassDensity: 40, // 移动端草叶密度
  fieldWidth: 10,
  fieldHeight: 16,
  cameraFrustum: 10,
  bladeHeight: 0.6,
  bladeWidth: 0.12,
  cutAnimationSpeed: 3.0,
  particleCount: 10,
  trailFadeSpeed: 2.0,
  screenShakeIntensity: 0.05,
  screenShakeDuration: 0.1,
  // 星级评价阈值
  starThresholds: { oneStar: 30, twoStar: 60, threeStar: 90 },
} as const;

export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || ('ontouchstart' in window);
}

export function getGrassDensity(): number {
  return isMobile() ? GAME_CONFIG.mobileGrassDensity : GAME_CONFIG.grassDensity;
}

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
