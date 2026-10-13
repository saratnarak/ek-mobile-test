import type { ExpoConfig } from 'expo/config';

const profile = process.env.EXPO_PUBLIC_BUILD_PROFILE ?? 'development';
const suffix = profile === 'production' ? '' : `.${profile}`;

const config: ExpoConfig = {
  name: profile === 'production' ? 'Ekmong' : `Ekmong (${profile})`,
  slug: 'ekmong-mobile',
  version: '0.1.0',
  orientation: 'portrait',
  scheme: 'ekmong',
  userInterfaceStyle: 'automatic',
  ios: { bundleIdentifier: `com.ekmong.app${suffix}`, supportsTablet: false },
  android: { package: `com.ekmong.app${suffix}` },
  plugins: [
    'expo-secure-store',
    'expo-sqlite',
    ['expo-camera', { cameraPermission: 'Scan table QR codes to start ordering.' }],
    'expo-notifications',
    'expo-apple-authentication',
    // TODO(T-03): enable once implemented
    // './plugins/with-sqlcipher',
    // './plugins/with-bank-app-queries',
    // './plugins/with-push-entitlements',
  ],
  extra: { buildProfile: profile },
};

export default config;
