import React from 'react';
import { Pressable, Text, StyleSheet, GestureResponderEvent } from 'react-native';

type Props = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
};

/**
 * Button
 * ------
 * Simple primary button component built from React Native primitives.
 * - Works consistently across iOS, Android, and web.
 * - Avoids any platform-specific UI libraries.
 */
export const Button: React.FC<Props> = ({ label, onPress, disabled }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.root,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#007aff',
    borderRadius: 8,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    backgroundColor: '#b0b0b0',
  },
  label: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

