/**
 * Alarm Caliyor Ekrani
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Vibration,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, fontSizes, borderRadius, shadows } from '../styles/theme';
import { TASK_TYPES } from '../utils/alarmStorage';

const AlarmRingingScreen = ({ navigation, route }) => {
  const alarm = route.params?.alarm || {
    hour: 7,
    minute: 0,
    label: 'Alarm',
    taskType: 'math',
    difficulty: 'orta',
  };

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Titresim pattern
    const vibrationPattern = [500, 500, 500, 500];
    const vibrationInterval = setInterval(() => {
      Vibration.vibrate(vibrationPattern);
    }, 2000);

    // Pulse animasyonu
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Shake animasyonu
    const shakeAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ])
    );
    shakeAnimation.start();

    // Saat guncellemesi
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(vibrationInterval);
      clearInterval(timer);
      Vibration.cancel();
      pulseAnimation.stop();
      shakeAnimation.stop();
    };
  }, []);

  const handleDismiss = () => {
    Vibration.cancel();
    const task = Object.values(TASK_TYPES).find(t => t.id === alarm.taskType);
    if (task) {
      navigation.replace(task.screen, {
        alarm,
        difficulty: alarm.difficulty,
      });
    }
  };

  const handleSnooze = () => {
    Vibration.cancel();
    // 5 dakika erteleme
    navigation.goBack();
    // Gercek uygulamada burada yeni bir alarm zamanlanir
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTaskInfo = () => {
    const task = Object.values(TASK_TYPES).find(t => t.id === alarm.taskType);
    return task || TASK_TYPES.MATH;
  };

  const taskInfo = getTaskInfo();

  return (
    <View style={styles.container}>
      {/* Arka Plan Efekti */}
      <Animated.View
        style={[
          styles.pulseCircle,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />

      {/* Saat */}
      <Animated.View
        style={[
          styles.timeContainer,
          {
            transform: [{ translateX: shakeAnim }],
          },
        ]}
      >
        <Icon name="alarm" size={48} color={colors.secondary} />
        <Text style={styles.time}>{formatTime(currentTime)}</Text>
        <Text style={styles.label}>{alarm.label}</Text>
      </Animated.View>

      {/* Gorev Bilgisi */}
      <View style={styles.taskInfo}>
        <Icon name={taskInfo.icon} size={32} color={colors.white} />
        <Text style={styles.taskText}>
          Alarmi kapatmak icin {taskInfo.name.toLowerCase()} gorevini tamamla!
        </Text>
      </View>

      {/* Butonlar */}
      <View style={styles.buttonContainer}>
        {/* Ertele Butonu */}
        <TouchableOpacity
          style={styles.snoozeButton}
          onPress={handleSnooze}
        >
          <Icon name="alarm-snooze" size={24} color={colors.textSecondary} />
          <Text style={styles.snoozeText}>5 dk Ertele</Text>
        </TouchableOpacity>

        {/* Kapat Butonu */}
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={handleDismiss}
        >
          <Icon name="alarm-off" size={32} color={colors.white} />
          <Text style={styles.dismissText}>Gorevi Baslat</Text>
        </TouchableOpacity>
      </View>

      {/* Alt Bilgi */}
      <Text style={styles.hint}>
        Kolay kapanmalara son! Uyandiginizdan emin olmak icin gorevi tamamlayin.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  pulseCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.secondary,
    opacity: 0.1,
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  time: {
    fontSize: 80,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  label: {
    fontSize: fontSizes.xl,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    ...shadows.md,
  },
  taskText: {
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    marginLeft: spacing.md,
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    gap: spacing.md,
  },
  snoozeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.backgroundLight,
  },
  snoozeText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  dismissButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    ...shadows.lg,
  },
  dismissText: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: spacing.md,
  },
  hint: {
    position: 'absolute',
    bottom: spacing.xxl,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});

export default AlarmRingingScreen;
