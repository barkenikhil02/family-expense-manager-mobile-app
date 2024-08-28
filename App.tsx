import firestore from '@react-native-firebase/firestore';
import React, { useState } from 'react';
import { Button, TextInput, } from 'react-native-paper';
import { SafeAreaView, StyleSheet, Text, useColorScheme } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { NavigationContainer } from '@react-navigation/native';
import MainTabScreen from './src/navigation/MainTabScreen';
export const usersCollection = firestore().collection('BarkeFamily');
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomListComponent from './src/components/CustomListComponent';
function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
    flex: 1
  };
  return (
    <SafeAreaProvider style={styles.containr}>
      <GestureHandlerRootView>
        <NavigationContainer>
          <MainTabScreen />
        </NavigationContainer>
        {/* <CustomListComponent /> */}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  containr: {
    flex: 1,
    backgroundColor: '#000'
  },
});

export default App;
