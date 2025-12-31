/**
 * Saat Secici Bileseni
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../styles/theme';

const ITEM_HEIGHT = 60;
const VISIBLE_ITEMS = 5;

const TimePicker = ({ hour, minute, onTimeChange }) => {
  const hourScrollRef = useRef(null);
  const minuteScrollRef = useRef(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleHourScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const selectedHour = Math.round(offsetY / ITEM_HEIGHT);
    if (selectedHour >= 0 && selectedHour < 24 && selectedHour !== hour) {
      onTimeChange(selectedHour, minute);
    }
  };

  const handleMinuteScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const selectedMinute = Math.round(offsetY / ITEM_HEIGHT);
    if (selectedMinute >= 0 && selectedMinute < 60 && selectedMinute !== minute) {
      onTimeChange(hour, selectedMinute);
    }
  };

  const renderItem = (value, isSelected) => (
    <View style={styles.item} key={value}>
      <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
        {value.toString().padStart(2, '0')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.pickerWrapper}>
        {/* Saat Secici */}
        <View style={styles.picker}>
          <ScrollView
            ref={hourScrollRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onMomentumScrollEnd={handleHourScroll}
            contentContainerStyle={styles.scrollContent}
            contentOffset={{ y: hour * ITEM_HEIGHT }}
          >
            {hours.map((h) => renderItem(h, h === hour))}
          </ScrollView>
        </View>

        {/* Ayirici */}
        <Text style={styles.separator}>:</Text>

        {/* Dakika Secici */}
        <View style={styles.picker}>
          <ScrollView
            ref={minuteScrollRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onMomentumScrollEnd={handleMinuteScroll}
            contentContainerStyle={styles.scrollContent}
            contentOffset={{ y: minute * ITEM_HEIGHT }}
          >
            {minutes.map((m) => renderItem(m, m === minute))}
          </ScrollView>
        </View>
      </View>

      {/* Secili Alan Gostergesi */}
      <View style={styles.selectionIndicator} pointerEvents="none" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    marginVertical: spacing.lg,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    width: 80,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingVertical: ITEM_HEIGHT * 2,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: fontSizes.xxl,
    color: colors.textMuted,
  },
  selectedItemText: {
    fontSize: fontSizes.giant,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  separator: {
    fontSize: fontSizes.giant,
    fontWeight: 'bold',
    color: colors.primary,
    marginHorizontal: spacing.md,
  },
  selectionIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 20,
    right: 20,
    height: ITEM_HEIGHT,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.sm,
  },
});

export default TimePicker;
