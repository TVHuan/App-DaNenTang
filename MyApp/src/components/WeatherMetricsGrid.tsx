import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CurrentWeather } from '../types/weather';
import {
  getHumidityDescription,
  getUvIndexDescription,
  getWindDirectionVi,
} from '../services/weatherApi';
import { WeatherTheme } from '../styles/theme';

interface Props {
  current: CurrentWeather;
  theme: WeatherTheme;
}

export const WeatherMetricsGrid: React.FC<Props> = ({ current, theme }) => {
  const windDirVi = getWindDirectionVi(current.windDirection);
  const uvInfo = getUvIndexDescription(current.uvIndex);
  const humidityText = getHumidityDescription(current.relativeHumidity);

  const metrics = [
    {
      id: 'wind',
      icon: '💨',
      label: 'TỐC ĐỘ GIÓ',
      value: `${current.windSpeed}`,
      unit: 'km/h',
      subText: `Hướng: ${windDirVi}`,
      highlightColor: '#38BDF8',
    },
    {
      id: 'humidity',
      icon: '💧',
      label: 'ĐỘ ẨM KHÔNG KHÍ',
      value: `${current.relativeHumidity}`,
      unit: '%',
      subText: humidityText,
      highlightColor: '#60A5FA',
    },
    {
      id: 'uv',
      icon: '☀️',
      label: 'CHỈ SỐ UV',
      value: `${current.uvIndex}`,
      unit: '',
      subText: uvInfo.text,
      highlightColor: uvInfo.color,
    },
    {
      id: 'rain',
      icon: '🌧️',
      label: 'LƯỢNG MƯA',
      value: `${current.precipitation}`,
      unit: 'mm',
      subText: current.precipitation > 0 ? 'Đang có mưa' : 'Không mưa',
      highlightColor: '#0EA5E9',
    },
    {
      id: 'pressure',
      icon: '🧭',
      label: 'ÁP SUẤT KHÍ QUYỂN',
      value: `${current.surfacePressure}`,
      unit: 'hPa',
      subText: current.surfacePressure >= 1013 ? 'Bình thường' : 'Áp suất thấp',
      highlightColor: '#A78BFA',
    },
    {
      id: 'cloud',
      icon: '☁️',
      label: 'ĐỘ CHE PHỦ MÂY',
      value: `${current.cloudCover}`,
      unit: '%',
      subText:
        current.cloudCover > 80
          ? 'Trời u ám'
          : current.cloudCover > 30
          ? 'Nhiều mây'
          : 'Ít mây quang',
      highlightColor: '#94A3B8',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
        CHI TIẾT KHÍ TƯỢNG THỜI GIAN THỰC
      </Text>
      <View style={styles.grid}>
        {metrics.map((item) => (
          <View
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>{item.icon}</Text>
              <Text style={[styles.cardLabel, { color: theme.textMuted }]}>
                {item.label}
              </Text>
            </View>

            <View style={styles.cardValueRow}>
              <Text style={[styles.cardValue, { color: theme.textPrimary }]}>
                {item.value}
              </Text>
              {item.unit ? (
                <Text style={[styles.cardUnit, { color: theme.accent }]}>
                  {item.unit}
                </Text>
              ) : null}
            </View>

            <Text
              style={[
                styles.cardSubText,
                { color: item.highlightColor || theme.textMuted },
              ]}
              numberOfLines={1}
            >
              {item.subText}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: 10,
    marginLeft: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'space-between',
    minHeight: 110,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardIcon: {
    fontSize: 16,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    flex: 1,
  },
  cardValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 4,
    gap: 4,
  },
  cardValue: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  cardUnit: {
    fontSize: 13,
    fontWeight: '600',
  },
  cardSubText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
});
