import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { Province } from '../types/weather';
import { WeatherTheme } from '../styles/theme';

interface Props {
  province: Province;
  lastUpdated: string;
  theme: WeatherTheme;
  isLoading: boolean;
  onOpenPicker: () => void;
  onRefresh: () => void;
}

export const WeatherHeader: React.FC<Props> = ({
  province,
  lastUpdated,
  theme,
  isLoading,
  onOpenPicker,
  onRefresh,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.locationButton, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
        onPress={onOpenPicker}
        activeOpacity={0.7}
      >
        <View style={styles.locationLeft}>
          <Text style={styles.pinIcon}>📍</Text>
          <View>
            <View style={styles.locationTitleRow}>
              <Text style={[styles.cityName, { color: theme.textPrimary }]} numberOfLines={1}>
                {province.name}
              </Text>
              <Text style={[styles.arrowIcon, { color: theme.accent }]}>▼</Text>
            </View>
            <Text style={[styles.subRegion, { color: theme.textMuted }]}>
              {province.region === 'bac'
                ? 'Khu vực Miền Bắc'
                : province.region === 'trung'
                ? 'Khu vực Miền Trung'
                : province.region === 'taynguyen'
                ? 'Khu vực Tây Nguyên'
                : 'Khu vực Miền Nam'}{' '}
              • Chạm để đổi tỉnh
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actionsRow}>
        <View style={[styles.updatePill, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <View style={[styles.liveDot, { backgroundColor: '#10B981' }]} />
          <Text style={[styles.updateText, { color: theme.textSecondary }]}>
            {lastUpdated ? `Cập nhật ${lastUpdated}` : 'Đang lấy dữ liệu...'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.refreshBtn, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
          onPress={onRefresh}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.accent} />
          ) : (
            <Text style={styles.refreshIcon}>🔄</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pinIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  arrowIcon: {
    fontSize: 11,
    marginTop: 2,
  },
  subRegion: {
    fontSize: 12,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  updatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  updateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  refreshIcon: {
    fontSize: 15,
  },
});
