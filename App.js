import React, { useState,useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './app/screens/HomeScreen'; 
import HadithsScreen from './app/screens/HadithsScreen';
import SettingsScreen from './app/screens/SettingsScreen';
import { Platform,Alert,StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SSContexts } from './contexts/SSContexts';
import { Feather } from '@expo/vector-icons'; 

const Stack = createNativeStackNavigator(); 
const Tab = createBottomTabNavigator();
const HomeTabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false,tabBarActiveTintColor: '#6a3eb2'}}
    >
      <Tab.Screen
        name="Tab1"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() { 
  const [hadithBook, setHadithBook] = useState("bukhari");
  const [hadithLang, setHadithLang] = useState("eng");
  const [internet, setInternet] = useState(true);
  useEffect(() => {
    // Check if the book has been set before
    AsyncStorage.getItem('book')
      .then((book) => {
        if (book != null) {
          // If book exists, set it to hadithBook variable
          setHadithBook(book);
        }else{
          AsyncStorage.setItem('book', 'bukhari');
          setHadithBook('bukhari');
        }
      })
      .catch((error) => console.error('Error reading book:', error));

  }, []);
  useEffect(() => {
    // Check if the book has been set before
    AsyncStorage.getItem('lang')
      .then((lang) => {
        if (lang !== null) {
          // If book exists, set it to hadithBook variable
          setHadithLang(lang);
        }else{
          AsyncStorage.setItem('lang', 'eng');
          setHadithLang('eng');
        }
      })
      .catch((error) => console.error('Error reading lang:', error));
  }, []);

  async function checkInternetConnection() {
    try {
        const response = await fetch('https://www.google.com', { mode: 'no-cors' });
        if (response.status >= 200 && response.status < 300) {
            // Internet connection is available
            return true;
        } else {
            // Internet connection is not available
            return false;
        }
    } catch (error) {
        // Fetch failed, internet connection is not available
        return false;
    }
}

// Example usage:
useEffect(() => {
checkInternetConnection().then(hasInternet => {
    if (hasInternet) {
        setInternet(true)
       
    } else {
      setInternet(false)
      Alert.alert("No Internet","Please check your internet connection")
    }
  }) });
return ( 
  <SSContexts.Provider value={{hadithBook,setHadithBook,hadithLang,setHadithLang}}>
      <NavigationContainer> 
        <Stack.Navigator 
          screenOptions={{ 
          headerStyle: { 
            
            marginTop: (Platform.OS === 'ios') ? 0 : StatusBar.currentHeight 
          }, 
         
          }}> 
          <Stack.Screen name="Home" component={HomeTabs} options={{headerShown:false}}/> 
          <Stack.Screen name="Hadiths" component={HadithsScreen} options={{headerShown:false}}/> 
          <Stack.Screen name="Settings" component={SettingsScreen} options={{headerShown:false}}/> 

        </Stack.Navigator> 
    </NavigationContainer> 
  </SSContexts.Provider>
	
); 
  }