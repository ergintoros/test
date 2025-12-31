/**
 * Ana Ekran
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, fontSizes, borderRadius, shadows } from '../styles/theme';
import { getAlarms } from '../utils/alarmStorage';

const HomeScreen = ({ navigation }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextAlarm, setNextAlarm] = useState(null);
  const [alarmCount, setAlarmCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadAlarms();
    });
    return unsubscribe;
  }, [navigation]);

  const loadAlarms = async () => {
    const alarms = await getAlarms();
    const activeAlarms = alarms.filter(a => a.isActive);
    setAlarmCount(activeAlarms.length);

    // En yakin alarmi bul
    if (activeAlarms.length > 0) {
      const now = new Date();
      let closest = null;
      let minDiff = Infinity;

      activeAlarms.forEach(alarm => {
        const alarmDate = new Date();
        alarmDate.setHours(alarm.hour, alarm.minute, 0, 0);

        if (alarmDate <= now) {
          alarmDate.setDate(alarmDate.getDate() + 1);
        }

        const diff = alarmDate - now;
        if (diff < minDiff) {
          minDiff = diff;
          closest = alarm;
        }
      });

      setNextAlarm(closest);
    } else {
      setNextAlarm(null);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const getTimeUntilAlarm = () => {
    if (!nextAlarm) return null;

    const now = new Date();
    const alarmTime = new Date();
    alarmTime.setHours(nextAlarm.hour, nextAlarm.minute, 0, 0);

    if (alarmTime <= now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }

    const diff = alarmTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours} saat ${minutes} dakika sonra`;
    }
    return `${minutes} dakika sonra`;
  };

  return (
    <View style={styles.container}>
      {/* Saat Gosterimi */}
      <View style={styles.clockSection}>
        <Text style={styles.time}>{formatTime(currentTime)}</Text>
        <Text style={styles.date}>{formatDate(currentTime)}</Text>
      </View>

      {/* Sonraki Alarm */}
      {nextAlarm ? (
        <View style={styles.nextAlarmCard}>
          <Icon name="alarm" size={32} color={colors.primary} />
          <View style={styles.nextAlarmInfo}>
            <Text style={styles.nextAlarmTitle}>Sonraki Alarm</Text>
            <Text style={styles.nextAlarmTime}>
              {`${nextAlarm.hour.toString().padStart(2, '0')}:${nextAlarm.minute.toString().padStart(2, '0')}`}
            </Text>
            <Text style={styles.nextAlarmRemaining}>{getTimeUntilAlarm()}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.noAlarmCard}>
          <Icon name="alarm-off" size={48} color={colors.textMuted} />
          <Text style={styles.noAlarmText}>Aktif alarm yok</Text>
          <Text style={styles.noAlarmSubtext}>
            Hadi bir alarm ekleyelim!
          </Text>
        </View>
      )}

      {/* Butonlar */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('AddAlarm')}
        >
          <Icon name="plus" size={28} color={colors.white} />
          <Text style={styles.primaryButtonText}>Yeni Alarm</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('AlarmList')}
        >
          <Icon name="format-list-bulleted" size={24} color={colors.primary} />
          <Text style={styles.secondaryButtonText}>
            Alarmlarim ({alarmCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Alt Bilgi */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Alarmi kapatmak icin gorev tamamla!
        </Text>
        <View style={styles.taskIcons}>
          <Icon name="calculator" size={20} color={colors.taskMath} />
          <Icon name="brain" size={20} color={colors.taskMemory} />
          <Icon name="cellphone" size={20} color={colors.taskShake} />
          <Icon name="qrcode" size={20} color={colors.taskQR} />
          <Icon name="keyboard" size={20} color={colors.taskTyping} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  clockSection: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  time: {
    fontSize: fontSizes.mega,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  date: {
    fontSize: fontSizes.lg,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textTransform: 'capitalize',
  },
  nextAlarmCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  nextAlarmInfo: {
    marginLeft: spacing.md,
  },
  nextAlarmTitle: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  nextAlarmTime: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  nextAlarmRemaining: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  noAlarmCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    ...shadows.md,
  },
  noAlarmText: {
    fontSize: fontSizes.lg,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  noAlarmSubtext: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  buttonSection: {
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.lg,
  },
  primaryButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: spacing.sm,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    fontSize: fontSizes.md,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  footer: {
    position: 'absolute',
    bottom: spacing.xxl,
    left: spacing.lg,
    right: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  taskIcons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});

export default HomeScreen;
