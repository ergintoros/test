/**
 * Telefonu Sallama Gorevi Ekrani
 * Kullanici telefonu belirli sayida sallayarak alarmi kapatir
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Vibration,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { colors, spacing, fontSizes, borderRadius, shadows } from '../styles/theme';

const ShakeTaskScreen = ({ navigation, route }) => {
  const difficulty = route.params?.difficulty || 'orta';

  const requiredShakes = {
    kolay: 15,
    orta: 30,
    zor: 50,
  };

  const totalRequired = requiredShakes[difficulty];

  const [shakeCount, setShakeCount] = useState(0);
  const [lastShakeTime, setLastShakeTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Sallama algilama esik degeri
  const SHAKE_THRESHOLD = 2.5;
  const SHAKE_COOLDOWN = 100; // ms

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 50);

    const subscription = accelerometer.subscribe(({ x, y, z }) => {
      const totalAcceleration = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();

      if (
        totalAcceleration > SHAKE_THRESHOLD &&
        now - lastShakeTime > SHAKE_COOLDOWN &&
        !isCompleted
      ) {
        setLastShakeTime(now);
        handleShake();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [lastShakeTime, isCompleted, shakeCount]);

  useEffect(() => {
    // Ilerleme animasyonu
    Animated.timing(progressAnim, {
      toValue: shakeCount / totalRequired,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [shakeCount]);

  const handleShake = () => {
    const newCount = shakeCount + 1;
    setShakeCount(newCount);

    // Sallama animasyonu
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // Rotasyon animasyonu
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: -1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Hafif titresim
    Vibration.vibrate(30);

    // Tamamlandi mi?
    if (newCount >= totalRequired) {
      setIsCompleted(true);
      Vibration.cancel();

      // Basari animasyonu
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        navigation.navigate('Home');
      }, 1000);
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const getProgressColor = () => {
    const progress = shakeCount / totalRequired;
    if (progress < 0.33) return colors.error;
    if (progress < 0.66) return colors.warning;
    return colors.success;
  };

  return (
    <View style={styles.container}>
      {/* Baslik */}
      <View style={styles.header}>
        <Icon name="cellphone" size={32} color={colors.taskShake} />
        <Text style={styles.title}>Telefonu Salla!</Text>
        <Text style={styles.subtitle}>
          {isCompleted ? 'Tebrikler!' : 'Telefonunu hizlica salla'}
        </Text>
      </View>

      {/* Sayac */}
      <View style={styles.counterContainer}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [
                { scale: scaleAnim },
                { rotate: spin },
              ],
            },
          ]}
        >
          <Icon
            name={isCompleted ? 'check-circle' : 'cellphone'}
            size={100}
            color={isCompleted ? colors.success : colors.taskShake}
          />
        </Animated.View>

        <Text style={styles.count}>
          {shakeCount}
        </Text>
        <Text style={styles.target}>
          / {totalRequired}
        </Text>
      </View>

      {/* Ilerleme Cubugu */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressWidth,
                backgroundColor: getProgressColor(),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round((shakeCount / totalRequired) * 100)}%
        </Text>
      </View>

      {/* Motivasyon Mesaji */}
      <View style={styles.motivationContainer}>
        {shakeCount === 0 && (
          <>
            <Icon name="hand-wave" size={40} color={colors.textMuted} />
            <Text style={styles.motivationText}>
              Haydi baslayalim!
            </Text>
          </>
        )}
        {shakeCount > 0 && shakeCount < totalRequired * 0.33 && (
          <>
            <Icon name="run" size={40} color={colors.error} />
            <Text style={styles.motivationText}>
              Devam et! Daha hizli!
            </Text>
          </>
        )}
        {shakeCount >= totalRequired * 0.33 && shakeCount < totalRequired * 0.66 && (
          <>
            <Icon name="fire" size={40} color={colors.warning} />
            <Text style={styles.motivationText}>
              Harika gidiyorsun!
            </Text>
          </>
        )}
        {shakeCount >= totalRequired * 0.66 && shakeCount < totalRequired && (
          <>
            <Icon name="rocket-launch" size={40} color={colors.primary} />
            <Text style={styles.motivationText}>
              Neredeyse bitti!
            </Text>
          </>
        )}
        {isCompleted && (
          <>
            <Icon name="trophy" size={40} color={colors.success} />
            <Text style={[styles.motivationText, { color: colors.success }]}>
              Basardin! Artik uyaniksin!
            </Text>
          </>
        )}
      </View>

      {/* Ipucu */}
      <View style={styles.hintContainer}>
        <Icon name="information" size={20} color={colors.textMuted} />
        <Text style={styles.hint}>
          Telefonu yukari-asagi veya saga-sola hizlica hareket ettir
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  counterContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  count: {
    fontSize: 80,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  target: {
    fontSize: fontSizes.xxl,
    color: colors.textMuted,
  },
  progressContainer: {
    marginBottom: spacing.xl,
  },
  progressBar: {
    height: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
  },
  progressText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  motivationContainer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  motivationText: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  hint: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    marginLeft: spacing.xs,
    textAlign: 'center',
    flex: 1,
  },
});

export default ShakeTaskScreen;
