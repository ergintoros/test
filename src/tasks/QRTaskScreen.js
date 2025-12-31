/**
 * QR Kod Tarama Gorevi Ekrani
 * Kullanici belirlenen QR kodu tarayarak alarmi kapatir
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
// Not: Gercek uygulamada expo-camera kullanilir
import { colors, spacing, fontSizes, borderRadius, shadows } from '../styles/theme';

const QRTaskScreen = ({ navigation, route }) => {
  const alarm = route.params?.alarm;

  // Kayitli QR kodu (gercek uygulamada alarm ayarlarindan gelir)
  const savedQRCode = alarm?.qrCode || 'WAKE_UP_123';

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showCamera, setShowCamera] = useState(true);

  useEffect(() => {
    // Kamera izni kontrolu
    // Gercek uygulamada Permissions API kullanilir
    setHasPermission(true);
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;

    setScanned(true);
    setShowCamera(false);

    if (data === savedQRCode) {
      // Dogru QR kod
      setIsCorrect(true);
      Vibration.cancel();

      setTimeout(() => {
        navigation.navigate('Home');
      }, 1500);
    } else {
      // Yanlis QR kod
      setIsCorrect(false);
      Vibration.vibrate([200, 100, 200]);

      setTimeout(() => {
        setScanned(false);
        setIsCorrect(null);
        setShowCamera(true);
      }, 2000);
    }
  };

  const handleSetupQR = () => {
    Alert.alert(
      'QR Kod Ayarla',
      'Alarmi kapatmak icin kullanilacak QR kodu simdi tarayin. Bu kod ileride alarmi kapatmak icin kullanilacak.',
      [
        { text: 'Iptal', style: 'cancel' },
        {
          text: 'Tara',
          onPress: () => {
            // QR kod kaydetme moduna gec
            // Gercek uygulamada bu alarm ayarlarina kaydedilir
          },
        },
      ]
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Kamera izni bekleniyor...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Icon name="camera-off" size={80} color={colors.error} />
        <Text style={styles.errorTitle}>Kamera Izni Gerekli</Text>
        <Text style={styles.errorMessage}>
          QR kod taramak icin kamera iznine ihtiyacimiz var.
          Lutfen ayarlardan kamera iznini verin.
        </Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsButtonText}>Ayarlara Git</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Baslik */}
      <View style={styles.header}>
        <Icon name="qrcode-scan" size={32} color={colors.taskQR} />
        <Text style={styles.title}>QR Kod Tara</Text>
        <Text style={styles.subtitle}>
          Alarmi kapatmak icin kayitli QR kodu tara
        </Text>
      </View>

      {/* Kamera Alani */}
      {showCamera ? (
        <View style={styles.cameraContainer}>
          <View style={styles.cameraPlaceholder}>
            {/* Gercek uygulamada RNCamera kullanilir */}
            <Icon name="camera" size={80} color={colors.textMuted} />
            <Text style={styles.cameraText}>
              Kamera goruntusu burada olacak
            </Text>

            {/* Demo icin manuel tarama butonu */}
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => handleBarCodeScanned({ data: savedQRCode })}
            >
              <Icon name="qrcode-scan" size={24} color={colors.white} />
              <Text style={styles.scanButtonText}>Demo: Dogru QR Tara</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.scanButton, styles.wrongScanButton]}
              onPress={() => handleBarCodeScanned({ data: 'WRONG_CODE' })}
            >
              <Icon name="close" size={24} color={colors.white} />
              <Text style={styles.scanButtonText}>Demo: Yanlis QR Tara</Text>
            </TouchableOpacity>
          </View>

          {/* Tarama Cercevesi */}
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <Icon
            name={isCorrect ? 'check-circle' : 'close-circle'}
            size={120}
            color={isCorrect ? colors.success : colors.error}
          />
          <Text
            style={[
              styles.resultText,
              { color: isCorrect ? colors.success : colors.error },
            ]}
          >
            {isCorrect ? 'Dogru QR Kod!' : 'Yanlis QR Kod!'}
          </Text>
          <Text style={styles.resultSubtext}>
            {isCorrect
              ? 'Alarm kapatildi. Gunaydin!'
              : 'Lutfen dogru QR kodu tarayin.'}
          </Text>
        </View>
      )}

      {/* Ipuclari */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Ipuclari:</Text>
        <View style={styles.tipItem}>
          <Icon name="lightbulb-outline" size={20} color={colors.warning} />
          <Text style={styles.tipText}>
            QR kodu banyoda veya mutfakta bir yere yerlestirin
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Icon name="lightbulb-outline" size={20} color={colors.warning} />
          <Text style={styles.tipText}>
            Boylece yataktan kalkmak zorunda kalirsiniz!
          </Text>
        </View>
      </View>

      {/* QR Kod Olustur */}
      <TouchableOpacity style={styles.setupButton} onPress={handleSetupQR}>
        <Icon name="qrcode-plus" size={20} color={colors.textSecondary} />
        <Text style={styles.setupText}>Yeni QR Kod Kaydet</Text>
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
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
  },
  cameraText: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.taskQR,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  wrongScanButton: {
    backgroundColor: colors.error,
  },
  scanButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
  },
  scanFrame: {
    position: 'absolute',
    top: '20%',
    left: '15%',
    right: '15%',
    bottom: '35%',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: colors.taskQR,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultText: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    marginTop: spacing.lg,
  },
  resultSubtext: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  tipsContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  tipsTitle: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  tipText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  setupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  setupText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  message: {
    fontSize: fontSizes.lg,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.error,
    marginTop: spacing.lg,
  },
  errorMessage: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  settingsButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.xl,
  },
  settingsButtonText: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: colors.white,
  },
});

export default QRTaskScreen;
