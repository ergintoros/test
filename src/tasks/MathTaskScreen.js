/**
 * Matematik Gorevi Ekrani
 * Kullanici matematik problemlerini cozerek alarmi kapatir
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Vibration,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, fontSizes, borderRadius, shadows } from '../styles/theme';

const MathTaskScreen = ({ navigation, route }) => {
  const difficulty = route.params?.difficulty || 'orta';

  const [problem, setProblem] = useState(null);
  const [answer, setAnswer] = useState('');
  const [solvedCount, setSolvedCount] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [shakeAnim] = useState(new Animated.Value(0));

  const requiredProblems = {
    kolay: 2,
    orta: 3,
    zor: 5,
  };

  const totalRequired = requiredProblems[difficulty];

  useEffect(() => {
    generateProblem();
  }, []);

  const generateProblem = () => {
    let num1, num2, operator, result;

    switch (difficulty) {
      case 'kolay':
        // Basit toplama/cikarma (1-20)
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        operator = Math.random() > 0.5 ? '+' : '-';
        if (operator === '-' && num2 > num1) {
          [num1, num2] = [num2, num1];
        }
        result = operator === '+' ? num1 + num2 : num1 - num2;
        break;

      case 'orta':
        // Carpma ve bolme dahil (1-12 carpim tablosu)
        const ops = ['+', '-', '*'];
        operator = ops[Math.floor(Math.random() * ops.length)];

        if (operator === '*') {
          num1 = Math.floor(Math.random() * 12) + 1;
          num2 = Math.floor(Math.random() * 12) + 1;
          result = num1 * num2;
        } else {
          num1 = Math.floor(Math.random() * 50) + 10;
          num2 = Math.floor(Math.random() * 30) + 1;
          if (operator === '-' && num2 > num1) {
            [num1, num2] = [num2, num1];
          }
          result = operator === '+' ? num1 + num2 : num1 - num2;
        }
        break;

      case 'zor':
        // Karisik islemler, buyuk sayilar
        const hardOps = ['+', '-', '*'];
        operator = hardOps[Math.floor(Math.random() * hardOps.length)];

        if (operator === '*') {
          num1 = Math.floor(Math.random() * 15) + 5;
          num2 = Math.floor(Math.random() * 15) + 5;
          result = num1 * num2;
        } else {
          num1 = Math.floor(Math.random() * 100) + 50;
          num2 = Math.floor(Math.random() * 50) + 10;
          if (operator === '-' && num2 > num1) {
            [num1, num2] = [num2, num1];
          }
          result = operator === '+' ? num1 + num2 : num1 - num2;
        }
        break;
    }

    setProblem({ num1, num2, operator, result });
    setAnswer('');
    setIsCorrect(null);
  };

  const getOperatorSymbol = (op) => {
    switch (op) {
      case '+': return '+';
      case '-': return '−';
      case '*': return '×';
      case '/': return '÷';
      default: return op;
    }
  };

  const checkAnswer = () => {
    const userAnswer = parseInt(answer, 10);

    if (userAnswer === problem.result) {
      setIsCorrect(true);
      const newCount = solvedCount + 1;
      setSolvedCount(newCount);

      if (newCount >= totalRequired) {
        // Gorev tamamlandi
        setTimeout(() => {
          Vibration.cancel();
          navigation.navigate('Home');
        }, 500);
      } else {
        // Sonraki probleme gec
        setTimeout(() => {
          generateProblem();
        }, 800);
      }
    } else {
      setIsCorrect(false);
      Vibration.vibrate(200);

      // Shake animasyonu
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();

      // Yanlis cevap sonrasi inputu temizle
      setTimeout(() => {
        setAnswer('');
        setIsCorrect(null);
      }, 1000);
    }
  };

  const handleNumberPress = (num) => {
    if (answer.length < 6) {
      setAnswer(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setAnswer(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setAnswer('');
  };

  if (!problem) return null;

  return (
    <View style={styles.container}>
      {/* Baslik */}
      <View style={styles.header}>
        <Icon name="calculator" size={32} color={colors.taskMath} />
        <Text style={styles.title}>Matematik Gorevi</Text>
        <Text style={styles.progress}>
          {solvedCount} / {totalRequired} cozuldu
        </Text>
      </View>

      {/* Ilerleme Cubugu */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${(solvedCount / totalRequired) * 100}%` },
          ]}
        />
      </View>

      {/* Problem */}
      <Animated.View
        style={[
          styles.problemContainer,
          { transform: [{ translateX: shakeAnim }] },
          isCorrect === true && styles.correct,
          isCorrect === false && styles.incorrect,
        ]}
      >
        <Text style={styles.problem}>
          {problem.num1} {getOperatorSymbol(problem.operator)} {problem.num2} = ?
        </Text>
      </Animated.View>

      {/* Cevap Alani */}
      <View style={styles.answerContainer}>
        <Text style={styles.answerText}>
          {answer || '?'}
        </Text>
      </View>

      {/* Numara Tuslari */}
      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.key}
            onPress={() => handleNumberPress(num.toString())}
          >
            <Text style={styles.keyText}>{num}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.key} onPress={handleClear}>
          <Icon name="close" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.key}
          onPress={() => handleNumberPress('0')}
        >
          <Text style={styles.keyText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.key} onPress={handleBackspace}>
          <Icon name="backspace-outline" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Kontrol Butonu */}
      <TouchableOpacity
        style={[styles.checkButton, !answer && styles.checkButtonDisabled]}
        onPress={checkAnswer}
        disabled={!answer}
      >
        <Icon name="check" size={28} color={colors.white} />
        <Text style={styles.checkButtonText}>Kontrol Et</Text>
      </TouchableOpacity>

      {/* Durum Mesaji */}
      {isCorrect !== null && (
        <View style={styles.feedback}>
          <Icon
            name={isCorrect ? 'check-circle' : 'close-circle'}
            size={24}
            color={isCorrect ? colors.success : colors.error}
          />
          <Text
            style={[
              styles.feedbackText,
              { color: isCorrect ? colors.success : colors.error },
            ]}
          >
            {isCorrect ? 'Dogru!' : 'Yanlis! Tekrar dene.'}
          </Text>
        </View>
      )}
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
  progress: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: 4,
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.taskMath,
    borderRadius: 4,
  },
  problemContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  correct: {
    borderWidth: 2,
    borderColor: colors.success,
  },
  incorrect: {
    borderWidth: 2,
    borderColor: colors.error,
  },
  problem: {
    fontSize: fontSizes.giant,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  answerContainer: {
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  answerText: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.primary,
    minWidth: 80,
    textAlign: 'center',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  key: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  keyText: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  checkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.taskMath,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  checkButtonDisabled: {
    opacity: 0.5,
  },
  checkButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: spacing.sm,
  },
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  feedbackText: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    marginLeft: spacing.xs,
  },
});

export default MathTaskScreen;
