import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface FacebookHeaderProps {
  onSearchPress?: () => void;
  onMessengerPress?: () => void;
}

export const FacebookHeader: React.FC<FacebookHeaderProps> = ({
  onSearchPress,
  onMessengerPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>facebook</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
          <Text style={styles.iconSymbol}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onMessengerPress}>
          <Text style={styles.iconSymbol}>💬</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E4E6EB',
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1877F2',
    letterSpacing: -0.8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    position: 'relative',
  },
  iconSymbol: {
    fontSize: 16,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#E41E3F',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
