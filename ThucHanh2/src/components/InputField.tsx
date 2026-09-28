import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { X, AlertCircle } from 'lucide-react-native';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
  prefixIcon?: React.ReactNode;
  onClear?: () => void;
  helperText?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  required,
  prefixIcon,
  onClear,
  helperText,
  value,
  style,
  ...restProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!error;

  return (
    <View style={styles.container}>
      {/* Label Row */}
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {label} {required && <Text style={styles.requiredStar}>*</Text>}
        </Text>
      </View>

      {/* Input Box */}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          hasError && styles.inputError,
        ]}
      >
        {prefixIcon ? (
          <View style={styles.prefixIconWrapper}>{prefixIcon}</View>
        ) : null}

        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#94A3B8"
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...restProps}
        />

        {value && onClear ? (
          <TouchableOpacity
            onPress={onClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.clearBtn}
          >
            <X size={14} color="#94A3B8" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Helper or Error message */}
      {hasError ? (
        <View style={styles.errorRow}>
          <AlertCircle size={13} color="#EF4444" style={{ marginRight: 4 }} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  requiredStar: {
    color: '#EF4444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    minHeight: 48,
  },
  inputFocused: {
    borderColor: '#2563EB',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  prefixIconWrapper: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    paddingVertical: 10,
  },
  clearBtn: {
    padding: 4,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    marginLeft: 2,
  },
});
