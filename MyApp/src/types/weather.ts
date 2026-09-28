export type Region = 'all' | 'bac' | 'trung' | 'taynguyen' | 'nam';

export interface Province {
  id: string;
  name: string;
  shortName: string;
  region: Region;
  latitude: number;
  longitude: number;
  isPopular?: boolean;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  isDay: boolean;
  precipitation: number;
  weatherCode: number;
  cloudCover: number;
  windSpeed: number;
  windDirection: number;
  surfacePressure: number;
  uvIndex: number;
  time: string;
}

export interface HourlyForecastItem {
  time: string;
  hour: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
}

export interface DailyForecastItem {
  date: string;
  dayName: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  windSpeedMax: number;
  uvIndexMax: number;
}

export interface WeatherData {
  province: Province;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  lastUpdated: string;
}

export interface WeatherCodeInfo {
  code: number;
  description: string;
  icon: string;
  color: string;
  theme: 'sunny' | 'rainy' | 'cloudy' | 'storm' | 'snow' | 'fog' | 'night';
}
