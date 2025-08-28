import React, { useMemo, useState, useEffect } from 'react';
import { SafeAreaView, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Platform } from 'react-native';
import { NativeModulesProxy, requireNativeModule } from 'expo-modules-core';

export default function App() {
  const [logs, setLogs] = useState([]);
  const [fullLogText, setFullLogText] = useState('');

  const addLog = (message, data = null) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      message,
      data: data ? JSON.stringify(data, null, 2) : null
    };
    
    console.log(`[${timestamp}] ${message}`, data || '');
    setLogs(prev => [...prev, logEntry]);
  };

  const probe = useMemo(() => {
    addLog('Starting probe...');
    
    let info = {};
    
    try {
      addLog('Checking NativeModulesProxy...');
      info.proxyKeys = Object.keys(NativeModulesProxy).sort();
      info.hasFOVAudioInProxy = !!NativeModulesProxy.FOVAudio;
      addLog('NativeModulesProxy check completed', {
        proxyKeys: info.proxyKeys,
        hasFOVAudioInProxy: info.hasFOVAudioInProxy
      });
    } catch (e) {
      info.proxyError = String(e);
      addLog('Error checking NativeModulesProxy', { error: info.proxyError });
    }

    try {
      addLog('Attempting to require FOVAudio module...');
      const mod = requireNativeModule('FOVAudio');
      info.requiredOk = !!mod;
      info.methods = mod ? Object.keys(mod) : [];
      addLog('FOVAudio module require completed', {
        requiredOk: info.requiredOk,
        methods: info.methods
      });
    } catch (e) {
      info.requireError = String(e);
      addLog('Error requiring FOVAudio module', { error: info.requireError });
    }

    addLog('Probe completed', info);
    return info;
  }, []);

  useEffect(() => {
    // Create a comprehensive log text for easy copying
    const logText = logs.map(log => {
      let text = `[${log.timestamp}] ${log.message}`;
      if (log.data) {
        text += `\n${log.data}`;
      }
      return text;
    }).join('\n\n');
    
    setFullLogText(logText);
  }, [logs]);

  const copyToClipboard = () => {
    // For React Native, we'll show an alert with the full log text
    // Users can then copy from the alert or use the displayed text
    Alert.alert(
      'Full Log Text',
      'The complete log text is displayed below. You can select and copy it, or check the console for the same information.',
      [{ text: 'OK' }]
    );
  };

  const clearLogs = () => {
    setLogs([]);
    setFullLogText('');
  };

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
      
      <View style={{ marginTop: 16, flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity 
          style={{ backgroundColor: '#007AFF', padding: 8, borderRadius: 4 }}
          onPress={copyToClipboard}
        >
          <Text style={{ color: 'white' }}>Copy Logs</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ backgroundColor: '#FF3B30', padding: 8, borderRadius: 4 }}
          onPress={clearLogs}
        >
          <Text style={{ color: 'white' }}>Clear Logs</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ marginTop: 16, fontWeight: '600', fontSize: 16 }}>Live Logs ({logs.length} entries):</Text>
      <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5', padding: 8, borderRadius: 4, marginTop: 8 }}>
        {logs.map((log, index) => (
          <View key={index} style={{ marginBottom: 8, padding: 8, backgroundColor: 'white', borderRadius: 4 }}>
            <Text style={{ fontWeight: '600', color: '#007AFF' }}>[{log.timestamp}]</Text>
            <Text style={{ marginTop: 2 }}>{log.message}</Text>
            {log.data && (
              <Text style={{ marginTop: 4, fontFamily: 'monospace', fontSize: 12, color: '#666' }}>
                {log.data}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>

      <Text style={{ marginTop: 16, fontWeight: '600', fontSize: 16 }}>Full Log Text (for copying):</Text>
      <ScrollView style={{ flex: 1, backgroundColor: '#f0f0f0', padding: 8, borderRadius: 4, marginTop: 8 }}>
        <Text style={{ fontFamily: 'monospace', fontSize: 12, color: '#333' }}>{fullLogText}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
