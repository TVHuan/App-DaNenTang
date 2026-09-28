import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { PROVINCES } from './src/data/provinces';
import { Province, WeatherData } from './src/types/weather';
import { fetchWeatherData, getWeatherCodeInfo } from './src/services/weatherApi';
import { THEMES, WeatherTheme } from './src/styles/theme';
import { WeatherHeader } from './src/components/WeatherHeader';
import { PopularQuickBar } from './src/components/PopularQuickBar';
import { CurrentWeatherCard } from './src/components/CurrentWeatherCard';
import { WeatherMetricsGrid } from './src/components/WeatherMetricsGrid';
import { HourlyForecast } from './src/components/HourlyForecast';
import { DailyForecast } from './src/components/DailyForecast';
import { ProvincePickerModal } from './src/components/ProvincePickerModal';

export default function App() {
  return (
    <SafeAreaProvider>
      <MainWeatherApp />
    </SafeAreaProvider>
  );
}

function MainWeatherApp() {
  const insets = useSafeAreaInsets();
  const [selectedProvince, setSelectedProvince] = useState<Province>(PROVINCES[0]); // Hanoi default
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);

  // Load weather for selected province
  const loadWeather = useCallback(async (prov: Province, showFullLoader = true) => {
    if (showFullLoader) setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await fetchWeatherData(prov);
      setWeatherData(data);
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Không thể tải dữ liệu thời tiết. Vui lòng thử lại.',
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(selectedProvince, true);
  }, [selectedProvince, loadWeather]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadWeather(selectedProvince, false);
  }, [selectedProvince, loadWeather]);

  // Determine current theme
  let theme: WeatherTheme = THEMES.sunny;
  if (weatherData?.current) {
    const codeInfo = getWeatherCodeInfo(
      weatherData.current.weatherCode,
      weatherData.current.isDay,
    );
    theme = THEMES[codeInfo.theme] || THEMES.sunny;
  }

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: theme.primaryBg,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <StatusBar barStyle="light-content" />

      {/* App Bar / Top Navigation */}
      <WeatherHeader
        province={selectedProvince}
        lastUpdated={weatherData?.lastUpdated || ''}
        theme={theme}
        isLoading={isLoading}
        onOpenPicker={() => setIsPickerVisible(true)}
        onRefresh={onRefresh}
      />

      {/* Quick Select Popular Cities */}
      <PopularQuickBar
        currentProvince={selectedProvince}
        theme={theme}
        onSelectProvince={(prov) => setSelectedProvince(prov)}
      />

      {/* Main Body */}
      {isLoading && !weatherData ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Đang kết nối vệ tinh Open-Meteo...
          </Text>
          <Text style={[styles.loadingSubText, { color: theme.textMuted }]}>
            {selectedProvince.name}
          </Text>
        </View>
      ) : errorMessage && !weatherData ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={[styles.errorTitle, { color: theme.textPrimary }]}>
            Lỗi nạp dữ liệu thời tiết
          </Text>
          <Text style={[styles.errorDesc, { color: theme.textMuted }]}>
            {errorMessage}
          </Text>
          <TouchableOpacity
            style={[styles.retryBtn, { backgroundColor: theme.accent }]}
            onPress={() => loadWeather(selectedProvince, true)}
          >
            <Text style={styles.retryBtnText}>Thử lại ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={theme.accent}
              colors={[theme.accent]}
            />
          }
        >
          {weatherData && (
            <>
              {/* Primary Current Weather Display */}
              <CurrentWeatherCard
                current={weatherData.current}
                todayForecast={weatherData.daily[0]}
                theme={theme}
              />

              {/* 24-Hour Forecast Scroll */}
              <HourlyForecast hourly={weatherData.hourly} theme={theme} />

              {/* Real-time Balanced Metrics Grid (Gió, Độ ẩm, UV, Mưa, Khí áp, Mây) */}
              <WeatherMetricsGrid current={weatherData.current} theme={theme} />

              {/* 7-Day Forecast */}
              <DailyForecast daily={weatherData.daily} theme={theme} />

              {/* Footer & Source Attribution */}
              <View style={styles.footer}>
                <Text style={[styles.footerText, { color: theme.textMuted }]}>
                  Dữ liệu khí tượng vệ tinh thời gian thực bởi Open-Meteo WMO
                </Text>
                <Text style={[styles.footerSub, { color: theme.textMuted }]}>
                  Hỗ trợ 40 tỉnh thành Việt Nam • Độ chính xác cao
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      )}

      {/* Province Picker Modal */}
      <ProvincePickerModal
        visible={isPickerVisible}
        currentProvince={selectedProvince}
        theme={theme}
        onSelectProvince={(prov) => setSelectedProvince(prov)}
        onClose={() => setIsPickerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  loadingSubText: {
    fontSize: 13,
    marginTop: 6,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    marginTop: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 11,
    textAlign: 'center',
  },
  footerSub: {
    fontSize: 10,
    textAlign: 'center',
  },
});
