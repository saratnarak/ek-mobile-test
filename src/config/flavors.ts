/**
 * Flavor configs — the React Native equivalent of Flutter's `FlavorTemplate`.
 * Pick one with `EXPO_PUBLIC_FLAVOR` (see package.json `start:*` scripts).
 */
export type FlavorName = 'local' | 'dev' | 'prod';

export type Flavor = {
  name: FlavorName;
  appName: string;
  apiURL: string;
  photoURL: string;
};

const flavors: Record<FlavorName, Flavor> = {
  local: {
    name: 'local',
    appName: 'Ekmong - Local',
    apiURL: 'http://192.168.103.21:3000/api/v1/mobile',
    photoURL: 'http://192.168.103.21:3000/uploads',
  },
  dev: {
    name: 'dev',
    appName: 'Ekmong - Dev',
    apiURL: 'https://dev-api.ekmong.com/api/v1/mobile',
    photoURL: 'https://dev-api.ekmong.com/uploads',
  },
  prod: {
    name: 'prod',
    appName: 'Ekmong',
    apiURL: 'https://api.ekmong.com/api/v1/mobile',
    photoURL: 'https://api.ekmong.com/uploads',
  },
};

// NOTE: must be written as `process.env.EXPO_PUBLIC_*` literally so Expo can inline it.
const selected = (process.env.EXPO_PUBLIC_FLAVOR ?? 'local') as FlavorName;

const base = flavors[selected] ?? flavors.local;

export const flavor: Flavor = {
  ...base,
  // Optional one-off override from .env without editing code.
  apiURL: process.env.EXPO_PUBLIC_API_BASE_URL || base.apiURL,
};
