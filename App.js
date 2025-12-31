/**
 * Wake Up Alarm - Akilli Alarm Uygulamasi
 * Alarmi kapatmak icin cesitli gorevler sunar
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import AlarmListScreen from './src/screens/AlarmListScreen';
import AddAlarmScreen from './src/screens/AddAlarmScreen';
import AlarmRingingScreen from './src/screens/AlarmRingingScreen';

// Task Screens
import MathTaskScreen from './src/tasks/MathTaskScreen';
import MemoryTaskScreen from './src/tasks/MemoryTaskScreen';
import ShakeTaskScreen from './src/tasks/ShakeTaskScreen';
import QRTaskScreen from './src/tasks/QRTaskScreen';
import TypingTaskScreen from './src/tasks/TypingTaskScreen';

import { colors } from './src/styles/theme';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Uyan Artik!' }}
        />
        <Stack.Screen
          name="AlarmList"
          component={AlarmListScreen}
          options={{ title: 'Alarmlarim' }}
        />
        <Stack.Screen
          name="AddAlarm"
          component={AddAlarmScreen}
          options={{ title: 'Yeni Alarm' }}
        />
        <Stack.Screen
          name="AlarmRinging"
          component={AlarmRingingScreen}
          options={{
            title: 'ALARM!',
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        {/* Gorev Ekranlari */}
        <Stack.Screen
          name="MathTask"
          component={MathTaskScreen}
          options={{
            title: 'Matematik Gorevi',
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="MemoryTask"
          component={MemoryTaskScreen}
          options={{
            title: 'Hafiza Oyunu',
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="ShakeTask"
          component={ShakeTaskScreen}
          options={{
            title: 'Telefonu Salla',
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="QRTask"
          component={QRTaskScreen}
          options={{
            title: 'QR Kod Tara',
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="TypingTask"
          component={TypingTaskScreen}
          options={{
            title: 'Yazi Yaz',
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
