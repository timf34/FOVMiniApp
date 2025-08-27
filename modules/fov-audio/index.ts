import { requireNativeModule } from 'expo-modules-core';

type FOVAudioModule = {
  ping(msg: string): Promise<string>;
  add(a: number, b: number): Promise<number>;
};

export default requireNativeModule<FOVAudioModule>('FOVAudio');
