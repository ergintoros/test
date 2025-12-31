/**
 * Alarm Ekleme/Duzenleme Ekrani
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, fontSizes, borderRadius, shadows } from '../styles/theme';
import { addAlarm, updateAlarm, REPEAT_DAYS, TASK_TYPES } from '../utils/alarmStorage';
import TimePicker from '../components/TimePicker';
import TaskSelector from '../components/TaskSelector';

const AddAlarmScreen = ({ navigation, route }) => {
  const editingAlarm = route.params?.alarm;
  const isEditing = !!editingAlarm;

  const [hour, setHour] = useState(editingAlarm?.hour || 7);
  const [minute, setMinute] = useState(editingAlarm?.minute || 0);
  const [label, setLabel] = useState(editingAlarm?.label || '');
  const [selectedDays, setSelectedDays] = useState(editingAlarm?.repeatDays || []);
  const [selectedTask, setSelectedTask] = useState(editingAlarm?.taskType || 'math');
  const [difficulty, setDifficulty] = useState(editingAlarm?.difficulty || 'orta');

  const handleTimeChange = (newHour, newMinute) => {
    setHour(newHour);
    setMinute(newMinute);
  };

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day].sort());
    }
  };

  const handleSave = async () => {
    try {
      const alarmData = {
        hour,
        minute,
        label: label.trim() || 'Alarm',
        repeatDays: selectedDays,
        taskType: selectedTask,
        difficulty,
      };

      if (isEditing) {
        await updateAlarm(editingAlarm.id, alarmData);
        Alert.alert('Basarili', 'Alarm guncellendi!');
      } else {
        await addAlarm(alarmData);
        Alert.alert('Basarili', 'Alarm eklendi!');
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Hata', 'Alarm kaydedilemedi. Lutfen tekrar deneyin.');
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'kolay': return colors.success;
      case 'orta': return colors.warning;
      case 'zor': return colors.error;
      default: return colors.textMuted;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Saat Secici */}
      <View style={styles.section}>
        <TimePicker
          hour={hour}
          minute={minute}
          onTimeChange={handleTimeChange}
        />
      </View>

      {/* Etiket */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alarm Etiketi</Text>
        <TextInput
          style={styles.input}
          placeholder="Ornek: Sabah Sporu"
          placeholderTextColor={colors.textMuted}
          value={label}
          onChangeText={setLabel}
          maxLength={30}
        />
      </View>

      {/* Tekrar Gunleri */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tekrar</Text>
        <View style={styles.daysContainer}>
          {Object.entries(REPEAT_DAYS).map(([day, name]) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                selectedDays.includes(parseInt(day)) && styles.dayButtonActive,
              ]}
              onPress={() => toggleDay(parseInt(day))}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  selectedDays.includes(parseInt(day)) && styles.dayButtonTextActive,
                ]}
              >
                {name.substring(0, 2)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.repeatInfo}>
          {selectedDays.length === 0
            ? 'Bir kez calacak'
            : selectedDays.length === 7
            ? 'Her gun calacak'
            : `Haftada ${selectedDays.length} gun calacak`}
        </Text>
      </View>

      {/* Gorev Secimi */}
      <TaskSelector
        selectedTask={selectedTask}
        onSelectTask={setSelectedTask}
      />

      {/* Zorluk Seviyesi */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Zorluk Seviyesi</Text>
        <View style={styles.difficultyContainer}>
          {['kolay', 'orta', 'zor'].map((diff) => (
            <TouchableOpacity
              key={diff}
              style={[
                styles.difficultyButton,
                difficulty === diff && {
                  backgroundColor: getDifficultyColor(diff),
                  borderColor: getDifficultyColor(diff),
                },
              ]}
              onPress={() => setDifficulty(diff)}
            >
              <Text
                style={[
                  styles.difficultyText,
                  difficulty === diff && styles.difficultyTextActive,
                ]}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Kaydet Butonu */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Icon name="content-save" size={24} color={colors.white} />
        <Text style={styles.saveButtonText}>
          {isEditing ? 'Guncelle' : 'Kaydet'}
        </Text>
      </TouchableOpacity>

      {/* Alt Bosluk */}
      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.backgroundLight,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dayButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  dayButtonText: {
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
    color: colors.textMuted,
  },
  dayButtonTextActive: {
    color: colors.white,
  },
  repeatInfo: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.backgroundLight,
  },
  difficultyText: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: colors.textMuted,
  },
  difficultyTextActive: {
    color: colors.white,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginHorizontal: spacing.md,
    marginTop: spacing.xxl,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.lg,
  },
  saveButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: spacing.sm,
  },
});

export default AddAlarmScreen;
