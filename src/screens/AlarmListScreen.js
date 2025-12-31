/**
 * Alarm Listesi Ekrani
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors, spacing, fontSizes, borderRadius } from '../styles/theme';
import { getAlarms, toggleAlarm, deleteAlarm } from '../utils/alarmStorage';
import AlarmCard from '../components/AlarmCard';

const AlarmListScreen = ({ navigation }) => {
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadAlarms();
    });
    return unsubscribe;
  }, [navigation]);

  const loadAlarms = async () => {
    setLoading(true);
    const loadedAlarms = await getAlarms();
    // Saate gore sirala
    loadedAlarms.sort((a, b) => {
      if (a.hour !== b.hour) return a.hour - b.hour;
      return a.minute - b.minute;
    });
    setAlarms(loadedAlarms);
    setLoading(false);
  };

  const handleToggle = async (alarmId) => {
    await toggleAlarm(alarmId);
    loadAlarms();
  };

  const handleDelete = (alarm) => {
    Alert.alert(
      'Alarmi Sil',
      `"${alarm.label || 'Alarm'}" alarmini silmek istediginize emin misiniz?`,
      [
        { text: 'Iptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            await deleteAlarm(alarm.id);
            loadAlarms();
          },
        },
      ]
    );
  };

  const handlePress = (alarm) => {
    navigation.navigate('AddAlarm', { alarm });
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon name="alarm-plus" size={80} color={colors.textMuted} />
      <Text style={styles.emptyTitle}>Henuz alarm yok</Text>
      <Text style={styles.emptySubtitle}>
        Yeni bir alarm eklemek icin + butonuna basin
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={alarms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlarmCard
            alarm={item}
            onToggle={handleToggle}
            onPress={() => handlePress(item)}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={alarms.length === 0 && styles.emptyList}
        showsVerticalScrollIndicator={false}
      />

      {/* Yeni Alarm Butonu */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddAlarm')}
      >
        <Icon name="plus" size={32} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.md,
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginTop: spacing.lg,
  },
  emptySubtitle: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default AlarmListScreen;
