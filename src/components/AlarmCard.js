/**
 * Alarm Karti Bileseni
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, fontSizes, borderRadius, shadows } from '../styles/theme';
import { TASK_TYPES, REPEAT_DAYS } from '../utils/alarmStorage';

const AlarmCard = ({ alarm, onToggle, onPress, onDelete }) => {
  const getTaskIcon = (taskId) => {
    const task = Object.values(TASK_TYPES).find(t => t.id === taskId);
    return task ? task.icon : 'alarm';
  };

  const getRepeatText = (days) => {
    if (!days || days.length === 0) return 'Bir kez';
    if (days.length === 7) return 'Her gun';
    if (days.length === 5 && !days.includes(0) && !days.includes(6)) {
      return 'Hafta ici';
    }
    if (days.length === 2 && days.includes(0) && days.includes(6)) {
      return 'Hafta sonu';
    }
    return days.map(d => REPEAT_DAYS[d].substring(0, 3)).join(', ');
  };

  const formatTime = (hour, minute) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity
      style={[styles.container, !alarm.isActive && styles.inactive]}
      onPress={onPress}
      onLongPress={onDelete}
    >
      <View style={styles.leftSection}>
        <Text style={[styles.time, !alarm.isActive && styles.inactiveText]}>
          {formatTime(alarm.hour, alarm.minute)}
        </Text>
        <Text style={[styles.label, !alarm.isActive && styles.inactiveText]}>
          {alarm.label || 'Alarm'}
        </Text>
        <Text style={[styles.repeat, !alarm.isActive && styles.inactiveText]}>
          {getRepeatText(alarm.repeatDays)}
        </Text>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.taskBadge}>
          <Icon
            name={getTaskIcon(alarm.taskType)}
            size={20}
            color={colors.white}
          />
        </View>
        <Switch
          value={alarm.isActive}
          onValueChange={() => onToggle(alarm.id)}
          trackColor={{ false: colors.textMuted, true: colors.primaryLight }}
          thumbColor={alarm.isActive ? colors.primary : colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.md,
  },
  inactive: {
    opacity: 0.6,
  },
  leftSection: {
    flex: 1,
  },
  time: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  inactiveText: {
    color: colors.textMuted,
  },
  label: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  repeat: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  rightSection: {
    alignItems: 'center',
    gap: spacing.md,
  },
  taskBadge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
    padding: spacing.sm,
  },
});

export default AlarmCard;
