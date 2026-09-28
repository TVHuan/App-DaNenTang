import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HourlyForecastItem } from '../types/weather';
import { getWeatherCodeInfo } from '../services/weatherApi';
import { WeatherTheme } from '../styles/theme';

interface Props {
  hourly: HourlyForecastItem[];
  theme: WeatherTheme;
}

export const HourlyForecast: React.FC<Props> = ({ hourly, theme }) => {
  if (!hourly || hourly.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
        DỰ BÁO THEO GIỜ (24H TỚI)
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {hourly.map((item, index) => {
          const info = getWeatherCodeInfo(item.weatherCode);
          const isNow = index === 0;

          return (
            <View
              key={`${item.time}-${index}`}
              style={[
                styles.itemCard,
                {
                  backgroundColor: isNow ? theme.cardHighlight : theme.cardBg,
                  borderColor: isNow ? theme.accent : theme.cardBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.hourText,
                  { color: isNow ? theme.accent : theme.textMuted },
                  isNow && styles.boldHour,
                ]}
              >
                {item.hour}
              </Text>

              <Text style={styles.weatherEmoji}>{info.icon}</Text>

              <Text style={[styles.tempText, { color: theme.textPrimary }]}>
                {item.temperature}°
              </Text>

              {item.precipitationProbability > 0 ? (
                <View style={styles.rainBadge}>
                  <Text style={styles.rainText}>
                    {item.precipitationProbability}%
                  </Text>
                </View>
              ) : (
                <View style={styles.rainPlaceholder} />
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: 10,
    marginLeft: 20,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  itemCard: {
    width: 66,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 120,
  },
  hourText: {
    fontSize: 12,
    fontWeight: '500',
  },
  boldHour: {
    fontWeight: '700',
  },
  weatherEmoji: {
    fontSize: 24,
    marginVertical: 4,
  },
  tempText: {
    fontSize: 16,
    fontWeight: '700',
  },
  rainBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  rainText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
  },
  rainPlaceholder: {
    height: 16,
  },
});
