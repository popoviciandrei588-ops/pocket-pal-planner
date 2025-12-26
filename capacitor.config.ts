import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.pocketpalplanner',
  appName: 'Money Tracker',
  webDir: 'dist',
  server: {
    url: 'https://38ca52d6-64be-400e-b425-c49f089688f2.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
