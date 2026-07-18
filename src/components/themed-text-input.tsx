import { TextInput, type TextInputProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export function ThemedTextInput({ style, ...rest }: TextInputProps) {
  const theme = useTheme();

  return (
    <TextInput
      style={[{ color: theme.text }, style]}
      placeholderTextColor={theme.textSecondary}
      {...rest}
    />
  );
}
