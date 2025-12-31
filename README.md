# Wake Up Alarm - Akilli Alarm Uygulamasi

Alarmi kapatmak icin cesitli gorevler sunan akilli mobil alarm uygulamasi. Artik yataktan kalkmadan alarmi kapatamazsiniz!

## Ozellikler

### 5 Farkli Uyanma Gorevi

1. **Matematik Gorevi** - Matematik problemleri cozerek alarmi kapatin
   - Kolay: Basit toplama/cikarma
   - Orta: Carpma dahil
   - Zor: Buyuk sayilarla karisik islemler

2. **Hafiza Oyunu** - Kartlari eslestirerek alarmi kapatin
   - Kolay: 4 cift (8 kart)
   - Orta: 6 cift (12 kart)
   - Zor: 8 cift (16 kart)

3. **Telefonu Sallama** - Telefonu belirli sayida sallayarak alarmi kapatin
   - Kolay: 15 sallama
   - Orta: 30 sallama
   - Zor: 50 sallama

4. **QR Kod Tarama** - Onceden kaydedilen QR kodu tarayarak alarmi kapatin
   - QR kodu banyoda veya mutfakta yerlestirin
   - Yataktan kalkmak zorunda kalin!

5. **Yazi Yazma** - Verilen cumleyi dogru yazarak alarmi kapatin
   - Kolay: Kisa cumleler
   - Orta: Orta uzunlukta cumleler
   - Zor: Uzun motivasyon cumleleri

## Teknik Detaylar

- **Framework:** React Native
- **Navigation:** React Navigation
- **Storage:** AsyncStorage
- **Sensors:** react-native-sensors (sallama algilama)
- **Camera:** react-native-camera (QR kod tarama)

## Proje Yapisi

```
src/
├── components/          # UI Bilesenleri
│   ├── AlarmCard.js     # Alarm karti
│   ├── TaskSelector.js  # Gorev secici
│   └── TimePicker.js    # Saat secici
├── screens/             # Ekranlar
│   ├── HomeScreen.js    # Ana ekran
│   ├── AlarmListScreen.js
│   ├── AddAlarmScreen.js
│   └── AlarmRingingScreen.js
├── tasks/               # Gorev Ekranlari
│   ├── MathTaskScreen.js
│   ├── MemoryTaskScreen.js
│   ├── ShakeTaskScreen.js
│   ├── QRTaskScreen.js
│   └── TypingTaskScreen.js
├── utils/               # Yardimci Fonksiyonlar
│   └── alarmStorage.js
└── styles/              # Tema ve Stiller
    └── theme.js
```

## Kurulum

```bash
# Bagimliliklari yukle
npm install

# iOS icin pod yukle
cd ios && pod install && cd ..

# Uygulamayi calistir
npm run android  # Android icin
npm run ios      # iOS icin
```

## Ekran Goruntuleri

- Ana ekran: Saat ve sonraki alarm bilgisi
- Alarm listesi: Tum alarmlari gor ve yonet
- Alarm ekleme: Saat, gorev ve zorluk sec
- Gorev ekranlari: Her gorev icin ozel arayuz

## Lisans

MIT License
