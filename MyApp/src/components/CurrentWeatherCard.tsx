import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CurrentWeather, DailyForecastItem } from '../types/weather';
import { getWeatherCodeInfo } from '../services/weatherApi';
import { WeatherTheme } from '../styles/theme';

interface Props {
  current: CurrentWeather;
  todayForecast?: DailyForecastItem;
  theme: WeatherTheme;
}

export const CurrentWeatherCard: React.FC<Props> = ({
  current,
  todayForecast,
  theme,
}) => {
  const codeInfo = getWeatherCodeInfo(current.weatherCode, current.isDay);

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
      {/* Weather Icon and Main Condition */}
      <View style={styles.topRow}>
        <View style={styles.iconContainer}>
          <Text style={styles.largeIcon}>{codeInfo.icon}</Text>
        </View>

        <View style={styles.conditionContainer}>
          <View style={[styles.conditionBadge, { backgroundColor: theme.badgeBg }]}>
            <Text style={[styles.conditionText, { color: theme.accent }]}>
              {codeInfo.description}
            </Text>
          </View>
          <Text style={[styles.apparentText, { color: theme.textSecondary }]}>
            Cảm giác như {Math.round(current.apparentTemperature)}°C
          </Text>
        </View>
      </View>

      {/* Main Temperature Display */}
      <View style={styles.tempRow}>
        <Text style={[styles.tempNumber, { color: theme.textPrimary }]}>
          {Math.round(current.temperature)}
        </Text>
        <Text style={[styles.tempUnit, { color: theme.accent }]}>°C</Text>
      </View>

      {/* High / Low & Precipitation row */}
      <View style={[styles.bottomDivider, { borderTopColor: theme.cardBorder }]}>
        <View style={styles.minMaxContainer}>
          {todayForecast && (
            <Text style={[styles.minMaxText, { color: theme.textSecondary }]}>
              ↑ {todayForecast.tempMax}° / ↓ {todayForecast.tempMin}°
            </Text>
          )}
          <Text style={[styles.dayNightTag, { color: theme.textMuted }]}>
            {current.isDay ? 'Ban ngày ☀️' : 'Ban đêm 🌙'}
          </Text>
        </View>

        {current.precipitation > 0 && (
          <View style={styles.rainAlert}>
            <Text style={styles.rainAlertText}>
              💧 Mưa: {current.precipitation} mm
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 28,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeIcon: {
    fontSize: 54,
  },
  conditionContainer: {
    alignItems: 'flex-end',
    flex: 1,
    paddingLeft: 12,
  },
  conditionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 6,
  },
  conditionText: {
    fontSize: 14,
    fontWeight: '700',
  },
  apparentText: {
    fontSize: 13,
    fontWeight: '500',
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginVertical: 6,
  },
  tempNumber: {
    fontSize: 78,
    fontWeight: '200',
    letterSpacing: -2,
    lineHeight: 88,
  },
  tempUnit: {
    fontSize: 28,
    fontWeight: '600',
    marginTop: 8,
    marginLeft: 2,
  },
  bottomDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    marginTop: 4,
    borderTopWidth: 1,
  },
  minMaxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  minMaxText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dayNightTag: {
    fontSize: 12,
  },
  rainAlert: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  rainAlertText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
  },
});
