import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<CardProps> = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export const CardHeader: React.FC<CardProps> = ({ children, style }) => (
  <View style={[styles.cardHeader, style]}>{children}</View>
);

interface CardTitleProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, style }) => (
  <Text style={[styles.cardTitle, style]}>{children}</Text>
);

interface CardDescriptionProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  style,
}) => <Text style={[styles.cardDescription, style]}>{children}</Text>;

export const CardContent: React.FC<CardProps> = ({ children, style }) => (
  <View style={[styles.cardContent, style]}>{children}</View>
);

export const CardFooter: React.FC<CardProps> = ({ children, style }) => (
  <View style={[styles.cardFooter, style]}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4E4E7', // Zinc 200
    padding: 16,
    marginBottom: 12,
    shadowColor: '#09090B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#09090B', // Zinc 950
    letterSpacing: -0.3,
  },
  cardDescription: {
    fontSize: 13,
    color: '#71717A', // Zinc 500
    marginTop: 2,
    lineHeight: 18,
  },
  cardContent: {
    marginBottom: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5', // Zinc 100
  },
});
