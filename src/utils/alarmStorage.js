/**
 * Alarm Depolama Yardimci Fonksiyonlari
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const ALARMS_KEY = '@wake_up_alarms';

/**
 * Tum alarmlari getir
 */
export const getAlarms = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(ALARMS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Alarmlar yuklenirken hata:', e);
    return [];
  }
};

/**
 * Yeni alarm ekle
 */
export const addAlarm = async (alarm) => {
  try {
    const alarms = await getAlarms();
    const newAlarm = {
      ...alarm,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    alarms.push(newAlarm);
    await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
    return newAlarm;
  } catch (e) {
    console.error('Alarm eklenirken hata:', e);
    throw e;
  }
};

/**
 * Alarmi guncelle
 */
export const updateAlarm = async (alarmId, updates) => {
  try {
    const alarms = await getAlarms();
    const index = alarms.findIndex(a => a.id === alarmId);
    if (index !== -1) {
      alarms[index] = { ...alarms[index], ...updates };
      await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
      return alarms[index];
    }
    return null;
  } catch (e) {
    console.error('Alarm guncellenirken hata:', e);
    throw e;
  }
};

/**
 * Alarmi sil
 */
export const deleteAlarm = async (alarmId) => {
  try {
    const alarms = await getAlarms();
    const filteredAlarms = alarms.filter(a => a.id !== alarmId);
    await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(filteredAlarms));
    return true;
  } catch (e) {
    console.error('Alarm silinirken hata:', e);
    throw e;
  }
};

/**
 * Alarm durumunu degistir (aktif/pasif)
 */
export const toggleAlarm = async (alarmId) => {
  try {
    const alarms = await getAlarms();
    const index = alarms.findIndex(a => a.id === alarmId);
    if (index !== -1) {
      alarms[index].isActive = !alarms[index].isActive;
      await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
      return alarms[index];
    }
    return null;
  } catch (e) {
    console.error('Alarm durumu degistirilirken hata:', e);
    throw e;
  }
};

/**
 * Gorev turleri
 */
export const TASK_TYPES = {
  MATH: {
    id: 'math',
    name: 'Matematik',
    description: 'Matematik problemleri coz',
    icon: 'calculator',
    screen: 'MathTask',
    difficulty: ['kolay', 'orta', 'zor'],
  },
  MEMORY: {
    id: 'memory',
    name: 'Hafiza Oyunu',
    description: 'Kartlari eslestir',
    icon: 'brain',
    screen: 'MemoryTask',
    difficulty: ['kolay', 'orta', 'zor'],
  },
  SHAKE: {
    id: 'shake',
    name: 'Telefonu Salla',
    description: 'Telefonu belirli sayida salla',
    icon: 'phone-shake',
    screen: 'ShakeTask',
    difficulty: ['kolay', 'orta', 'zor'],
  },
  QR: {
    id: 'qr',
    name: 'QR Kod Tara',
    description: 'Belirlenen QR kodu tara',
    icon: 'qrcode',
    screen: 'QRTask',
    difficulty: ['kolay'],
  },
  TYPING: {
    id: 'typing',
    name: 'Yazi Yaz',
    description: 'Verilen cumleyi yaz',
    icon: 'keyboard',
    screen: 'TypingTask',
    difficulty: ['kolay', 'orta', 'zor'],
  },
};

/**
 * Tekrar gunleri
 */
export const REPEAT_DAYS = {
  0: 'Pazar',
  1: 'Pazartesi',
  2: 'Sali',
  3: 'Carsamba',
  4: 'Persembe',
  5: 'Cuma',
  6: 'Cumartesi',
};
