import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'me.ultimate.zentrix',
  appName: 'Zentrix',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '1081704696779-p54joiqdcdck56d1951q175r73ekmomm.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
