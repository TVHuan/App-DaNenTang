import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DailyForecastItem } from '../types/weather';
import { formatShortDate, getWeatherCodeInfo } from '../services/weatherApi';
import { WeatherTheme } from '../styles/theme';

interface Props {
  daily: DailyForecastItem[];
  theme: WeatherTheme;
}

export const DailyForecast: React.FC<Props> = ({ daily, theme }) => {
  if (!daily || daily.length === 0) return null;

  // Find global min and max for temperature bar scaling
  const allMins = daily.map((d) => d.tempMin);
  const allMaxs = daily.map((d) => d.tempMax);
  const lowestMin = Math.min(...allMins);
  const highestMax = Math.max(...allMaxs);
  const tempRange = Math.max(1, highestMax - lowestMin);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.calendarIcon}>📅</Text>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          DỰ BÁO 7 NGÀY TỚI
        </Text>
      </View>

      <View style={styles.list}>
        {daily.map((item, index) => {
          const info = getWeatherCodeInfo(item.weatherCode);
          const isToday = index === 0;

          // Bar calculation percentages
          const leftPercent = Math.max(
            0,
            ((item.tempMin - lowestMin) / tempRange) * 100,
          );
          const barWidthPercent = Math.max(
            15,
            ((item.tempMax - item.tempMin) / tempRange) * 100,
          );

          return (
            <View
              key={item.date}
              style={[
                styles.dayRow,
                index < daily.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.cardBorder,
                },
              ]}
            >
              {/* Day Name & Date */}
              <View style={styles.dayInfo}>
                <Text
                  style={[
                    styles.dayName,
                    { color: isToday ? theme.accent : theme.textPrimary },
                    isToday && styles.boldDay,
                  ]}
                >
                  {item.dayName}
                </Text>
                <Text style={[styles.dateSub, { color: theme.textMuted }]}>
                  {formatShortDate(item.date)}
                </Text>
              </View>

              {/* Weather Icon & Brief description */}
              <View style={styles.iconAndDesc}>
                <Text style={styles.weatherIcon}>{info.icon}</Text>
                <Text
                  style={[styles.weatherDesc, { color: theme.textMuted }]}
                  numberOfLines={1}
                >
                  {info.description}
                </Text>
              </View>

              {/* Temp Min, Dynamic Range Bar, Temp Max */}
              <View style={styles.tempBarContainer}>
                <Text style={[styles.minTemp, { color: theme.textMuted }]}>
                  {item.tempMin}°
                </Text>

                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        left: `${leftPercent}%`,
                        width: `${barWidthPercent}%`,
                        backgroundColor: theme.accent,
                      },
                    ]}
                  />
                </View>

                <Text style={[styles.maxTemp, { color: theme.textPrimary }]}>
                  {item.tempMax}°
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  calendarIcon: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  list: {
    gap: 4,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dayInfo: {
    width: 86,
  },
  dayName: {
    fontSize: 13,
    fontWeight: '600',
  },
  boldDay: {
    fontWeight: '700',
  },
  dateSub: {
    fontSize: 11,
    marginTop: 1,
  },
  iconAndDesc: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 96,
    gap: 6,
  },
  weatherIcon: {
    fontSize: 20,
  },
  weatherDesc: {
    fontSize: 11,
    flex: 1,
  },
  tempBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  minTemp: {
    fontSize: 13,
    fontWeight: '500',
    width: 26,
    textAlign: 'right',
  },
  barTrack: {
    flex: 1,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  barFill: {
    position: 'absolute',
    height: '100%',
    borderRadius: 3,
  },
  maxTemp: {
    fontSize: 13,
    fontWeight: '700',
    width: 26,
    textAlign: 'left',
  },
});
