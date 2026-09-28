import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Path,
  Circle,
  G,
  Line,
} from 'react-native-svg';
import { Users, TrendingUp, Award, BarChart3 } from 'lucide-react-native';

interface StatsBannerProps {
  total: number;
  avgGpa: string;
  excellentCount: number;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  total,
  avgGpa,
  excellentCount,
}) => {
  const gpaNum = parseFloat(avgGpa) || 0;
  // Calculate percentage of high performers (Giỏi)
  const excellentRate = total > 0 ? Math.round((excellentCount / total) * 100) : 0;

  return (
    <View style={styles.cardContainer}>
      {/* Background SVG with Mathematical Chart & Wave Patterns */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%" viewBox="0 0 360 170" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#1E3A8A" stopOpacity="1" />
              <Stop offset="0.5" stopColor="#1E40AF" stopOpacity="1" />
              <Stop offset="1" stopColor="#2563EB" stopOpacity="1" />
            </LinearGradient>

            <LinearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#60A5FA" stopOpacity="0.35" />
              <Stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* Card Base Gradient */}
          <Rect width="100%" height="100%" rx="20" fill="url(#cardGrad)" />

          {/* Mathematical Grid / Coordinates */}
          <G stroke="#FFFFFF" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="3,3">
            <Line x1="0" y1="40" x2="360" y2="40" />
            <Line x1="0" y1="80" x2="360" y2="80" />
            <Line x1="0" y1="120" x2="360" y2="120" />
            <Line x1="70" y1="0" x2="70" y2="170" />
            <Line x1="180" y1="0" x2="180" y2="170" />
            <Line x1="290" y1="0" x2="290" y2="170" />
          </G>

          {/* Mathematical Statistics Curve (Sine/Gaussian bell wave) */}
          <Path
            d="M -10,140 Q 60,70 120,95 T 220,60 T 310,85 T 380,45 L 380,180 L -10,180 Z"
            fill="url(#chartGlow)"
          />
          <Path
            d="M -10,140 Q 60,70 120,95 T 220,60 T 310,85 T 380,45"
            stroke="#93C5FD"
            strokeOpacity="0.5"
            strokeWidth="2.5"
            fill="none"
          />

          {/* Data Points on Curve */}
          <Circle cx="120" cy="95" r="3.5" fill="#60A5FA" />
          <Circle cx="220" cy="60" r="4" fill="#FCD34D" />
          <Circle cx="310" cy="85" r="3.5" fill="#34D399" />

          {/* Floating Geometric Orbs / Mathematical symbols */}
          <Circle cx="330" cy="25" r="35" fill="#FFFFFF" fillOpacity="0.05" />
          <Circle cx="30" cy="140" r="45" fill="#FFFFFF" fillOpacity="0.04" />
        </Svg>
      </View>

      {/* Header Inside Card */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.iconCircle}>
            <BarChart3 size={15} color="#93C5FD" />
          </View>
          <Text style={styles.headerTitle}>THỐNG KÊ HỌC VỤ TOÀN KHÓA</Text>
        </View>

        <View style={styles.ratePill}>
          <Text style={styles.ratePillText}>★ {excellentRate}% Xuất sắc</Text>
        </View>
      </View>

      {/* Main 3 Glassmorphism Stat Cards */}
      <View style={styles.statsRow}>
        {/* Stat 1: Total Students */}
        <View style={styles.statBox}>
          <View style={[styles.statIconBadge, { backgroundColor: 'rgba(59, 130, 246, 0.3)' }]}>
            <Users size={16} color="#BFDBFE" />
          </View>
          <Text style={styles.statNumber}>{total}</Text>
          <Text style={styles.statSubtitle}>Tổng sinh viên</Text>
        </View>

        {/* Vertical divider */}
        <View style={styles.glassDivider} />

        {/* Stat 2: Avg GPA */}
        <View style={styles.statBox}>
          <View style={[styles.statIconBadge, { backgroundColor: 'rgba(16, 185, 129, 0.3)' }]}>
            <TrendingUp size={16} color="#A7F3D0" />
          </View>
          <View style={styles.gpaNumberRow}>
            <Text style={styles.statNumber}>{avgGpa}</Text>
            <Text style={styles.gpaMax}>/10</Text>
          </View>
          <Text style={styles.statSubtitle}>GPA Trung bình</Text>
        </View>

        {/* Vertical divider */}
        <View style={styles.glassDivider} />

        {/* Stat 3: Excellent */}
        <View style={styles.statBox}>
          <View style={[styles.statIconBadge, { backgroundColor: 'rgba(245, 158, 11, 0.3)' }]}>
            <Award size={16} color="#FDE68A" />
          </View>
          <Text style={styles.statNumber}>{excellentCount}</Text>
          <Text style={styles.statSubtitle}>Sinh viên Giỏi</Text>
        </View>
      </View>

      {/* Bottom Progress Bar Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(Math.max((gpaNum / 10) * 100, 5), 100)}%` },
            ]}
          />
        </View>
        <Text style={styles.progressLabel}>
          Hiệu suất học tập đạt {( (gpaNum / 10) * 100 ).toFixed(0)}% chuẩn đầu ra
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#BFDBFE',
    letterSpacing: 0.8,
  },
  ratePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  ratePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  gpaNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  gpaMax: {
    fontSize: 10,
    color: '#93C5FD',
    fontWeight: '600',
    marginLeft: 2,
  },
  statSubtitle: {
    fontSize: 11,
    color: '#DBEAFE',
    marginTop: 2,
    fontWeight: '500',
  },
  glassDivider: {
    width: 1,
    height: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 10,
    color: '#BFDBFE',
    marginTop: 5,
    textAlign: 'center',
    fontWeight: '500',
  },
});
