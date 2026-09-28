import {
  DailyForecastItem,
  HourlyForecastItem,
  Province,
  WeatherCodeInfo,
  WeatherData,
} from '../types/weather';

/**
 * Maps WMO Weather interpretation codes to Vietnamese descriptions & visual icons
 * https://open-meteo.com/en/docs
 */
export function getWeatherCodeInfo(code: number, isDay: boolean = true): WeatherCodeInfo {
  switch (code) {
    case 0:
      return {
        code,
        description: isDay ? 'Trời quang đãng' : 'Đêm quang đãng',
        icon: isDay ? '☀️' : '🌙',
        color: isDay ? '#F59E0B' : '#818CF8',
        theme: isDay ? 'sunny' : 'night',
      };
    case 1:
      return {
        code,
        description: isDay ? 'Chủ yếu có nắng' : 'Đêm ít mây',
        icon: isDay ? '🌤️' : '🌤️',
        color: '#FBBF24',
        theme: isDay ? 'sunny' : 'night',
      };
    case 2:
      return {
        code,
        description: 'Mây rải rác',
        icon: '⛅',
        color: '#60A5FA',
        theme: 'cloudy',
      };
    case 3:
      return {
        code,
        description: 'Nhiều mây, âm u',
        icon: '☁️',
        color: '#94A3B8',
        theme: 'cloudy',
      };
    case 45:
    case 48:
      return {
        code,
        description: 'Sương mù dày đặc',
        icon: '🌫️',
        color: '#CBD5E1',
        theme: 'fog',
      };
    case 51:
    case 53:
    case 55:
      return {
        code,
        description: 'Mưa phùn nhẹ',
        icon: '🌦️',
        color: '#38BDF8',
        theme: 'rainy',
      };
    case 56:
    case 57:
      return {
        code,
        description: 'Mưa phùn lạnh buốt',
        icon: '🌧️',
        color: '#38BDF8',
        theme: 'rainy',
      };
    case 61:
      return {
        code,
        description: 'Mưa nhỏ rải rác',
        icon: '🌦️',
        color: '#60A5FA',
        theme: 'rainy',
      };
    case 63:
      return {
        code,
        description: 'Mưa vừa',
        icon: '🌧️',
        color: '#3B82F6',
        theme: 'rainy',
      };
    case 65:
      return {
        code,
        description: 'Mưa to xối xả',
        icon: '🌧️',
        color: '#2563EB',
        theme: 'rainy',
      };
    case 66:
    case 67:
      return {
        code,
        description: 'Mưa băng giá',
        icon: '🌨️',
        color: '#93C5FD',
        theme: 'rainy',
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        code,
        description: 'Tuyết rơi nhẹ',
        icon: '❄️',
        color: '#E0F2FE',
        theme: 'snow',
      };
    case 80:
      return {
        code,
        description: 'Mưa rào nhẹ',
        icon: '🌦️',
        color: '#38BDF8',
        theme: 'rainy',
      };
    case 81:
      return {
        code,
        description: 'Mưa rào vừa',
        icon: '🌧️',
        color: '#0284C7',
        theme: 'rainy',
      };
    case 82:
      return {
        code,
        description: 'Mưa rào rất to',
        icon: '⛈️',
        color: '#1D4ED8',
        theme: 'rainy',
      };
    case 85:
    case 86:
      return {
        code,
        description: 'Mưa tuyết rào',
        icon: '🌨️',
        color: '#BAE6FD',
        theme: 'snow',
      };
    case 95:
      return {
        code,
        description: 'Dông sét',
        icon: '⛈️',
        color: '#8B5CF6',
        theme: 'storm',
      };
    case 96:
    case 99:
      return {
        code,
        description: 'Dông bão có mưa đá',
        icon: '🌩️',
        color: '#7C3AED',
        theme: 'storm',
      };
    default:
      return {
        code,
        description: 'Thời tiết ôn hòa',
        icon: '🌤️',
        color: '#38BDF8',
        theme: 'cloudy',
      };
  }
}

/**
 * Translates degree to Vietnamese cardinal direction
 */
export function getWindDirectionVi(degree: number): string {
  const directions = [
    { label: 'Bắc (N)', min: 337.5, max: 360 },
    { label: 'Bắc (N)', min: 0, max: 22.5 },
    { label: 'Đông Bắc (NE)', min: 22.5, max: 67.5 },
    { label: 'Đông (E)', min: 67.5, max: 112.5 },
    { label: 'Đông Nam (SE)', min: 112.5, max: 157.5 },
    { label: 'Nam (S)', min: 157.5, max: 202.5 },
    { label: 'Tây Nam (SW)', min: 202.5, max: 247.5 },
    { label: 'Tây (W)', min: 247.5, max: 292.5 },
    { label: 'Tây Bắc (NW)', min: 292.5, max: 337.5 },
  ];

  for (const d of directions) {
    if (degree >= d.min && degree < d.max) {
      return d.label;
    }
  }
  return 'Bắc (N)';
}

/**
 * Returns UV index assessment in Vietnamese
 */
export function getUvIndexDescription(uv: number): { text: string; color: string } {
  if (uv < 3) return { text: 'Thấp', color: '#10B981' };
  if (uv < 6) return { text: 'Trung bình', color: '#FBBF24' };
  if (uv < 8) return { text: 'Cao', color: '#F97316' };
  if (uv < 11) return { text: 'Rất cao', color: '#EF4444' };
  return { text: 'Cực nguy hại', color: '#9333EA' };
}

/**
 * Returns humidity description in Vietnamese
 */
export function getHumidityDescription(humidity: number): string {
  if (humidity < 40) return 'Khô hanh';
  if (humidity <= 70) return 'Dễ chịu';
  if (humidity <= 85) return 'Hơi ẩm ướt';
  return 'Rất ẩm ướt';
}

/**
 * Format Vietnam day name
 */
export function formatDayNameVi(dateStr: string, isFirstDay: boolean): string {
  if (isFirstDay) return 'Hôm nay';
  const date = new Date(dateStr);
  const day = date.getDay();
  const dayNames = [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
  ];
  return dayNames[day] || dateStr;
}

/**
 * Format short date (DD/MM)
 */
export function formatShortDate(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`;
  }
  return dateStr;
}

/**
 * Fetch real-time weather from Open-Meteo
 */
export async function fetchWeatherData(province: Province): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${province.latitude}&longitude=${province.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,surface_pressure,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum,wind_speed_10m_max&timezone=Asia%2FBangkok`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Lỗi kết nối máy chủ Open-Meteo: ${response.status}`);
  }

  const data = await response.json();

  // Hourly forecast processing (next 24 hours starting around current time)
  const currentIsoHour = data.current.time ? data.current.time.slice(0, 13) : '';
  const hourlyRaw = data.hourly;
  let startIndex = 0;
  if (hourlyRaw && hourlyRaw.time) {
    const idx = hourlyRaw.time.findIndex((t: string) => t.startsWith(currentIsoHour));
    if (idx !== -1) {
      startIndex = idx;
    }
  }

  const hourly: HourlyForecastItem[] = [];
  const maxHourlyItems = Math.min(24, (hourlyRaw.time?.length || 0) - startIndex);
  for (let i = 0; i < maxHourlyItems; i++) {
    const index = startIndex + i;
    const timeStr = hourlyRaw.time[index];
    const hourPart = timeStr ? timeStr.slice(11, 16) : '';
    hourly.push({
      time: timeStr,
      hour: i === 0 ? 'Hiện tại' : hourPart,
      temperature: Math.round(hourlyRaw.temperature_2m[index]),
      weatherCode: hourlyRaw.weather_code[index],
      precipitationProbability: hourlyRaw.precipitation_probability
        ? hourlyRaw.precipitation_probability[index]
        : 0,
    });
  }

  // Daily forecast processing (7 days)
  const dailyRaw = data.daily;
  const daily: DailyForecastItem[] = [];
  if (dailyRaw && dailyRaw.time) {
    for (let i = 0; i < dailyRaw.time.length && i < 7; i++) {
      daily.push({
        date: dailyRaw.time[i],
        dayName: formatDayNameVi(dailyRaw.time[i], i === 0),
        weatherCode: dailyRaw.weather_code[i],
        tempMax: Math.round(dailyRaw.temperature_2m_max[i]),
        tempMin: Math.round(dailyRaw.temperature_2m_min[i]),
        precipitationSum: Math.round(dailyRaw.precipitation_sum[i] * 10) / 10,
        windSpeedMax: Math.round(dailyRaw.wind_speed_10m_max[i]),
        uvIndexMax: Math.round(dailyRaw.uv_index_max[i] * 10) / 10,
      });
    }
  }

  const now = new Date();
  const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes(),
  ).padStart(2, '0')}`;

  return {
    province,
    current: {
      temperature: Math.round(data.current.temperature_2m * 10) / 10,
      apparentTemperature: Math.round(data.current.apparent_temperature * 10) / 10,
      relativeHumidity: Math.round(data.current.relative_humidity_2m),
      isDay: Boolean(data.current.is_day),
      precipitation: data.current.precipitation ?? 0,
      weatherCode: data.current.weather_code,
      cloudCover: data.current.cloud_cover ?? 0,
      windSpeed: Math.round(data.current.wind_speed_10m * 10) / 10,
      windDirection: data.current.wind_direction_10m ?? 0,
      surfacePressure: Math.round(data.current.surface_pressure),
      uvIndex: Math.round((data.current.uv_index ?? 0) * 10) / 10,
      time: data.current.time,
    },
    hourly,
    daily,
    lastUpdated: timeFormatted,
  };
}
