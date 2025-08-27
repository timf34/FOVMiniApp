import React, { useMemo } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { Platform } from 'react-native';
import { NativeModulesProxy, requireNativeModule } from 'expo-modules-core';

export default function App() {
  const probe = useMemo(() => {
    let info = {};
    try {
      info.proxyKeys = Object.keys(NativeModulesProxy).sort();
      info.hasFOVAudioInProxy = !!NativeModulesProxy.FOVAudio;
    } catch (e) {
      info.proxyError = String(e);
    }

    try {
      const mod = requireNativeModule('FOVAudio');
      info.requiredOk = !!mod;
      info.methods = mod ? Object.keys(mod) : [];
    } catch (e) {
      info.requireError = String(e);
    }

    return info;
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, alignItems:'flex-start', justifyContent:'flex-start', padding:16 }}>
      <Text style={{ fontWeight:'bold', fontSize:18, marginBottom:8 }}>FOVMini</Text>
      <Text>Platform: {Platform.OS}</Text>
      <Text>Proxy has FOVAudio? {String(probe.hasFOVAudioInProxy)}</Text>
      <Text>requireNativeModule ok? {String(probe.requiredOk)}</Text>
      <Text>require error: {probe.requireError || 'none'}</Text>
      <Text style={{ marginTop:8, fontWeight:'600' }}>Proxy keys:</Text>
      <View>{(probe.proxyKeys || []).map(k => <Text key={k}>• {k || '(empty key)'}</Text>)}</View>
      <Text style={{ marginTop:8, fontWeight:'600' }}>Methods:</Text>
      <View>{(probe.methods || []).map(k => <Text key={k}>• {k}</Text>)}</View>
    </SafeAreaView>
  );
}
