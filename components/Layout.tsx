import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';

/**
 * Layout
 * -------
 * Shared page container used across screens.
 * - Provides a consistent background color.
 * - Adds safe-area handling for notches and system UI.
 * - Keeps the app mobile-first, but works on web as well.
 */
export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

