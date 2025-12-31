/**
 * Yazi Yazma Gorevi Ekrani
 * Kullanici verilen cumleyi dogru yazarak alarmi kapatir
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Vibration,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, fontSizes, borderRadius, shadows } from '../styles/theme';

const SENTENCES = {
  kolay: [
    'Gunaydin dunya',
    'Bugun harika bir gun',
    'Kahve icmeye gidiyorum',
    'Gunes dogdu uyan',
    'Yeni bir gun basladi',
    'Enerji dolu bir gun',
    'Mutlu bir sabah',
    'Hayata merhaba',
  ],
  orta: [
    'Erken kalkan yol alir',
    'Her sabah yeni bir baslangiçtir',
    'Basari icin erken kalkmaliyim',
    'Gunun ilk isiklari harika',
    'Kahvalti en onemli ogundur',
    'Bugün hedeflerime ulasacagim',
    'Pozitif dusunce basariyi getirir',
    'Disiplin basarinin anahtaridir',
  ],
  zor: [
    'Basarili insanlar erken kalkar ve hedeflerine odaklanir',
    'Her yeni gun kendini gelistirmek icin bir firsattir',
    'Zorluklar bizi daha guclu yapar yilmadan devam et',
    'Hayallerine ulasmak icin bugun bir adim daha at',
    'Sabah rutini tum gunun verimliligini belirler',
    'Disiplin ile imkansiz gibi gorunen seyler basarilir',
    'Kucuk adimlar buyuk degisikliklere yol acar',
    'Motivasyon baslangic icin disiplin devam icin gereklidir',
  ],
};

const TypingTaskScreen = ({ navigation, route }) => {
  const difficulty = route.params?.difficulty || 'orta';

  const [targetSentence, setTargetSentence] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [accuracy, setAccuracy] = useState(100);
  const [attempts, setAttempts] = useState(0);

  const inputRef = useRef(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    selectRandomSentence();
    // Klavyeyi otomatik ac
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, []);

  const selectRandomSentence = () => {
    const sentences = SENTENCES[difficulty];
    const randomIndex = Math.floor(Math.random() * sentences.length);
    setTargetSentence(sentences[randomIndex]);
    setUserInput('');
    setAccuracy(100);
  };

  const normalizeText = (text) => {
    // Turkce karakterleri ve buyuk/kucuk harf farklarini normalize et
    return text
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .trim();
  };

  const calculateAccuracy = (input, target) => {
    if (!input) return 100;

    const normalizedInput = normalizeText(input);
    const normalizedTarget = normalizeText(target);

    let correct = 0;
    const minLength = Math.min(normalizedInput.length, normalizedTarget.length);

    for (let i = 0; i < minLength; i++) {
      if (normalizedInput[i] === normalizedTarget[i]) {
        correct++;
      }
    }

    return Math.round((correct / normalizedTarget.length) * 100);
  };

  const handleInputChange = (text) => {
    setUserInput(text);
    const acc = calculateAccuracy(text, targetSentence);
    setAccuracy(acc);
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    setAttempts(prev => prev + 1);

    const normalizedInput = normalizeText(userInput);
    const normalizedTarget = normalizeText(targetSentence);

    if (normalizedInput === normalizedTarget) {
      // Basarili
      setIsCompleted(true);
      Vibration.cancel();

      setTimeout(() => {
        navigation.navigate('Home');
      }, 1500);
    } else {
      // Basarisiz
      Vibration.vibrate([100, 50, 100]);

      // Shake animasyonu
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  };

  const getAccuracyColor = () => {
    if (accuracy >= 90) return colors.success;
    if (accuracy >= 70) return colors.warning;
    return colors.error;
  };

  const renderCharacter = (char, index) => {
    const inputChar = userInput[index] || '';
    const normalizedChar = normalizeText(char);
    const normalizedInput = normalizeText(inputChar);

    let charStyle = styles.charPending;
    if (index < userInput.length) {
      charStyle = normalizedInput === normalizedChar
        ? styles.charCorrect
        : styles.charIncorrect;
    }
    if (index === userInput.length) {
      charStyle = styles.charCurrent;
    }

    return (
      <Text key={index} style={[styles.char, charStyle]}>
        {char}
      </Text>
    );
  };

  if (isCompleted) {
    return (
      <View style={styles.container}>
        <View style={styles.completedContainer}>
          <Icon name="check-circle" size={120} color={colors.success} />
          <Text style={styles.completedTitle}>Harika!</Text>
          <Text style={styles.completedSubtitle}>
            Cumleyi dogru yazdin
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{attempts}</Text>
              <Text style={styles.statLabel}>Deneme</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: colors.success }]}>
                100%
              </Text>
              <Text style={styles.statLabel}>Dogruluk</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Baslik */}
      <View style={styles.header}>
        <Icon name="keyboard" size={32} color={colors.taskTyping} />
        <Text style={styles.title}>Cumleyi Yaz</Text>
        <Text style={styles.subtitle}>
          Asagidaki cumleyi dogru bir sekilde yaz
        </Text>
      </View>

      {/* Dogruluk Gostergesi */}
      <View style={styles.accuracyContainer}>
        <Text style={styles.accuracyLabel}>Dogruluk</Text>
        <Text style={[styles.accuracyValue, { color: getAccuracyColor() }]}>
          {accuracy}%
        </Text>
      </View>

      {/* Hedef Cumle */}
      <Animated.View
        style={[
          styles.sentenceContainer,
          { transform: [{ translateX: shakeAnim }] },
        ]}
      >
        <Text style={styles.sentenceLabel}>Yazilacak cumle:</Text>
        <View style={styles.sentenceBox}>
          <Text style={styles.sentence}>
            {targetSentence.split('').map((char, index) => renderCharacter(char, index))}
          </Text>
        </View>
      </Animated.View>

      {/* Giris Alani */}
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={userInput}
          onChangeText={handleInputChange}
          placeholder="Buraya yaz..."
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          multiline
        />
      </View>

      {/* Butonlar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => setUserInput('')}
        >
          <Icon name="eraser" size={20} color={colors.textSecondary} />
          <Text style={styles.clearButtonText}>Temizle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            !userInput && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!userInput}
        >
          <Icon name="check" size={24} color={colors.white} />
          <Text style={styles.submitButtonText}>Kontrol Et</Text>
        </TouchableOpacity>
      </View>

      {/* Istatistik */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Deneme: {attempts} | Karakter: {userInput.length}/{targetSentence.length}
        </Text>
      </View>

      {/* Yeni Cumle */}
      <TouchableOpacity
        style={styles.newSentenceButton}
        onPress={selectRandomSentence}
      >
        <Icon name="refresh" size={16} color={colors.textMuted} />
        <Text style={styles.newSentenceText}>Farkli cumle</Text>
      </TouchableOpacity>
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
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  accuracyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  accuracyLabel: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  accuracyValue: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
  },
  sentenceContainer: {
    marginBottom: spacing.lg,
  },
  sentenceLabel: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  sentenceBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.taskTyping,
    ...shadows.md,
  },
  sentence: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  char: {
    fontSize: fontSizes.xl,
    fontFamily: 'monospace',
  },
  charPending: {
    color: colors.textMuted,
  },
  charCorrect: {
    color: colors.success,
  },
  charIncorrect: {
    color: colors.error,
    textDecorationLine: 'underline',
  },
  charCurrent: {
    color: colors.primary,
    backgroundColor: colors.primary + '30',
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSizes.lg,
    color: colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.backgroundLight,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  clearButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  clearButtonText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.taskTyping,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.md,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: spacing.sm,
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statsText: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  newSentenceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  newSentenceText: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    marginLeft: spacing.xs,
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.success,
    marginTop: spacing.lg,
  },
  completedSubtitle: {
    fontSize: fontSizes.lg,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    gap: spacing.xl,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    minWidth: 100,
  },
  statValue: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});

export default TypingTaskScreen;
