import * as Updates from 'expo-updates';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';

export default function UpdateScreen() {
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleCheckForUpdates() {
    try {
      setChecking(true);
      setMessage(null);

      const result = await Updates.checkForUpdateAsync();

      if (!result.isAvailable) {
        setMessage('You are already on the latest version.');
        return;
      }

      setMessage('Downloading update…');
      await Updates.fetchUpdateAsync();

      setMessage('Update downloaded. Restarting app…');
      await Updates.reloadAsync();
    } catch (error) {
      console.warn(error);
      setMessage('Could not check for updates. Please try again later.');
    } finally {
      setChecking(false);
    }
  }

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>App Updates</Text>
        <Text style={styles.subtitle}>
          Tap the button below to check for the latest version of this app.
        </Text>

        <View style={styles.buttonRow}>
          <Button
            label={checking ? 'Checking…' : 'Check for update'}
            onPress={handleCheckForUpdates}
            disabled={checking}
          />
          {checking && <ActivityIndicator style={{ marginTop: 12 }} />}
        </View>

        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonRow: {
    alignItems: 'center',
  },
  message: {
    marginTop: 16,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});

