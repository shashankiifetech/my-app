import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'my-app',
  webDir: "out",
  server: {
    url: 'http://192.168.1.38:4000',
    cleartext: true
  }
};

export default config;
