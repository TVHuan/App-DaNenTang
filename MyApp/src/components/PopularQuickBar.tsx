import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PROVINCES } from '../data/provinces';
import { Province } from '../types/weather';
import { WeatherTheme } from '../styles/theme';

interface Props {
  currentProvince: Province;
  theme: WeatherTheme;
  onSelectProvince: (province: Province) => void;
}

export const PopularQuickBar: React.FC<Props> = ({
  currentProvince,
  theme,
  onSelectProvince,
}) => {
  const quickList = PROVINCES.filter((p) => p.isPopular);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {quickList.map((item) => {
          const isSelected = item.id === currentProvince.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected
                    ? theme.accent
                    : theme.cardBg,
                  borderColor: isSelected ? theme.accent : theme.cardBorder,
                },
              ]}
              onPress={() => onSelectProvince(item)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isSelected ? '#000000' : theme.textSecondary,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {item.shortName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
  },
});
