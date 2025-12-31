/**
 * Hafiza Oyunu Ekrani
 * Kullanici kartlari eslestirerek alarmi kapatir
 */

import React, { useState, useEffect } from 'react';
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

const CARD_ICONS = [
  'heart', 'star', 'lightning-bolt', 'moon-waning-crescent',
  'flower', 'leaf', 'fire', 'water',
  'diamond', 'crown', 'rocket', 'gift',
];

const MemoryTaskScreen = ({ navigation, route }) => {
  const difficulty = route.params?.difficulty || 'orta';

  const gridConfig = {
    kolay: { pairs: 4, cols: 2 },   // 2x4 = 8 kart
    orta: { pairs: 6, cols: 3 },    // 3x4 = 12 kart
    zor: { pairs: 8, cols: 4 },     // 4x4 = 16 kart
  };

  const { pairs, cols } = gridConfig[difficulty];

  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Rastgele ikonlar sec
    const selectedIcons = [...CARD_ICONS]
      .sort(() => Math.random() - 0.5)
      .slice(0, pairs);

    // Ciftleri olustur ve karistir
    const cardPairs = [...selectedIcons, ...selectedIcons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(cardPairs);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
  };

  const handleCardPress = (index) => {
    if (isChecking) return;
    if (flippedIndices.includes(index)) return;
    if (matchedPairs.includes(cards[index].icon)) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      setMoves(prev => prev + 1);

      const [first, second] = newFlipped;

      if (cards[first].icon === cards[second].icon) {
        // Eslesme bulundu!
        const newMatched = [...matchedPairs, cards[first].icon];
        setMatchedPairs(newMatched);

        setTimeout(() => {
          setFlippedIndices([]);
          setIsChecking(false);

          // Tum kartlar eslestirildi mi?
          if (newMatched.length === pairs) {
            Vibration.cancel();
            setTimeout(() => {
              navigation.navigate('Home');
            }, 500);
          }
        }, 500);
      } else {
        // Eslesmedi
        Vibration.vibrate(100);
        setTimeout(() => {
          setFlippedIndices([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const isCardFlipped = (index) => {
    return flippedIndices.includes(index) || matchedPairs.includes(cards[index]?.icon);
  };

  const isCardMatched = (index) => {
    return matchedPairs.includes(cards[index]?.icon);
  };

  const renderCard = (card, index) => {
    const flipped = isCardFlipped(index);
    const matched = isCardMatched(index);

    return (
      <TouchableOpacity
        key={card.id}
        style={[
          styles.card,
          { width: `${85 / cols}%` },
          flipped && styles.cardFlipped,
          matched && styles.cardMatched,
        ]}
        onPress={() => handleCardPress(index)}
        disabled={flipped || isChecking}
        activeOpacity={0.8}
      >
        {flipped ? (
          <Icon
            name={card.icon}
            size={36}
            color={matched ? colors.success : colors.taskMemory}
          />
        ) : (
          <Icon name="help" size={36} color={colors.textMuted} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Baslik */}
      <View style={styles.header}>
        <Icon name="brain" size={32} color={colors.taskMemory} />
        <Text style={styles.title}>Hafiza Oyunu</Text>
        <Text style={styles.subtitle}>Tum kartlari esle!</Text>
      </View>

      {/* Istatistikler */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Icon name="cards" size={24} color={colors.primary} />
          <Text style={styles.statValue}>
            {matchedPairs.length} / {pairs}
          </Text>
          <Text style={styles.statLabel}>Eslesme</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="gesture-tap" size={24} color={colors.warning} />
          <Text style={styles.statValue}>{moves}</Text>
          <Text style={styles.statLabel}>Hamle</Text>
        </View>
      </View>

      {/* Ilerleme Cubugu */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${(matchedPairs.length / pairs) * 100}%` },
          ]}
        />
      </View>

      {/* Kart Izgarasi */}
      <View style={styles.grid}>
        {cards.map((card, index) => renderCard(card, index))}
      </View>

      {/* Yeniden Baslat */}
      <TouchableOpacity style={styles.resetButton} onPress={initializeGame}>
        <Icon name="refresh" size={20} color={colors.textSecondary} />
        <Text style={styles.resetText}>Yeniden Baslat</Text>
      </TouchableOpacity>

      {/* Ipucu */}
      <Text style={styles.hint}>
        Ayni ikonlari bulmak icin kartlara dokun
      </Text>
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
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    minWidth: 100,
    ...shadows.sm,
  },
  statValue: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: 4,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.taskMemory,
    borderRadius: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  card: {
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.backgroundLight,
    ...shadows.sm,
  },
  cardFlipped: {
    backgroundColor: colors.backgroundLight,
    borderColor: colors.taskMemory,
  },
  cardMatched: {
    backgroundColor: colors.success + '20',
    borderColor: colors.success,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  resetText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  hint: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default MemoryTaskScreen;
