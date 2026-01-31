import type { Effect } from '../types/effects';

// 内部キーと表示名のマッピング
export const EFFECT_DISPLAY_NAMES: Record<string, string> = {
  Booster_Preamp: 'Booster / Preamp',
  'SUPER OverDrive': 'SUPER Over Drive',
};

// 画像ファイル名とエフェクト名のマッピング
export const EFFECT_IMAGES: Record<string, string> = {
  Booster_Preamp: '/images/generated/webp/Booster_Preamp.webp',
  'Blues Driver': '/images/generated/webp/Blues Driver.webp',
  'SUPER OverDrive': '/images/generated/webp/SUPER OverDrive.webp',
  Distortion: '/images/generated/webp/Distortion.webp',
  Fuzz: '/images/generated/webp/Fuzz.webp',
  'Metal Zone': '/images/generated/webp/Metal Zone.webp',
  'Heavy Metal': '/images/generated/webp/Heavy Metal.webp',
  Chorus: '/images/generated/webp/Chorus.webp',
  Dimension: '/images/generated/webp/Dimension.webp',
  Vibrato: '/images/generated/webp/Vibrato.webp',
  Delay: '/images/generated/webp/Delay.webp',
};

// デフォルトパラメータ（BOSS実機の音響特性に準拠）
export const DEFAULT_PARAMS: Record<string, Record<string, number>> = {
  Booster_Preamp: { gain_db: 6 },
  'Blues Driver': { drive_db: 10 },
  'SUPER OverDrive': { drive_db: 15 },
  Distortion: { drive_db: 22 },
  Fuzz: { drive_db: 28 },
  'Metal Zone': { drive_db: 30 },
  'Heavy Metal': { drive_db: 35 },
  Chorus: { rate_hz: 1.0, depth: 0.25 },
  Dimension: { rate_hz: 0.5, depth: 0.15 },
  Vibrato: { rate_hz: 5.0, depth: 0.5, mix: 1.0 },
  Delay: { delay_seconds: 0.35, feedback: 0.4 },
};

// 初期エフェクトリスト（未選択状態）
export function createInitialEffects(): Effect[] {
  return Object.entries(EFFECT_IMAGES).map(([key, image], index) => ({
    id: `effect-${index}`,
    name: EFFECT_DISPLAY_NAMES[key] || key,
    apiName: key, // バックエンドAPI用のキー
    image,
    enabled: false,
    params: { ...DEFAULT_PARAMS[key] },
    defaultParams: { ...DEFAULT_PARAMS[key] },
  }));
}

// エフェクトをAPIリクエスト用の形式に変換
export function effectsToChain(
  effects: Effect[],
): { name: string; params?: Record<string, number> }[] {
  return effects
    .filter((e) => e.enabled)
    .map((e) => ({
      name: e.apiName,
      params: e.params,
    }));
}
