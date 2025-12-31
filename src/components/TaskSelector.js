/**
 * Gorev Secici Bileseni
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors, spacing, fontSizes, borderRadius, shadows } from '../styles/theme';
import { TASK_TYPES } from '../utils/alarmStorage';

const taskColors = {
  math: colors.taskMath,
  memory: colors.taskMemory,
  shake: colors.taskShake,
  qr: colors.taskQR,
  typing: colors.taskTyping,
};

const TaskSelector = ({ selectedTask, onSelectTask }) => {
  const tasks = Object.values(TASK_TYPES);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Uyanma Gorevi Sec</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={[
              styles.taskCard,
              selectedTask === task.id && styles.selectedCard,
              { borderColor: taskColors[task.id] },
            ]}
            onPress={() => onSelectTask(task.id)}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: taskColors[task.id] },
              ]}
            >
              <Icon name={task.icon} size={32} color={colors.white} />
            </View>
            <Text style={styles.taskName}>{task.name}</Text>
            <Text style={styles.taskDescription}>{task.description}</Text>
            {selectedTask === task.id && (
              <View style={styles.checkmark}>
                <Icon name="check-circle" size={24} color={colors.success} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginHorizontal: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
  },
  taskCard: {
    width: 140,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  selectedCard: {
    borderWidth: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  taskName: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  taskDescription: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
  checkmark: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
});

export default TaskSelector;
