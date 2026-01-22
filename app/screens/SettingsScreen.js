import { useState,useContext } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import styles from './constants/MyStyles.js'; 
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SSContexts } from '../../contexts/SSContexts.js';
import { Feather } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function HadithsScreen() {
    const [selectedValue, setSelectedValue] = useState(null);
    const [selectedValue2, setSelectedValue2] = useState(null);
    const {hadithBook}=useContext(SSContexts);
    const {hadithLang}=useContext(SSContexts);
    const {setHadithBook}=useContext(SSContexts);
    const {setHadithLang}=useContext(SSContexts);

    const saveBook = async () => {
      try {
        
        
        if (selectedValue !== null) {
          
          await AsyncStorage.setItem('book', selectedValue);
          setHadithBook(selectedValue);
          Alert.alert( 'Done!','The new hadith book has been saved', );
        } else {
          Alert.alert( 'Alert!','Please select something', );
        }
      } catch (error) {
        console.error('Error saving book:', error);
      }
    };
    const saveLang = async () => {
      try {
        

        if (selectedValue2 !== null) {
          
          await AsyncStorage.setItem('lang', selectedValue2);
          setHadithLang(selectedValue2);
          Alert.alert( 'Done!','The new hadith language has been saved', );
        } else {
          Alert.alert( 'Alert!','Please select something', );
        }
      } catch (error) {
        console.error('Error saving book:', error);
      }
    };

  const placeholder = {
    label: hadithBook,
    value: null,
  };
  const placeholder2 = {
    label: hadithLang,
    value: null,
  };
  const options = [
    { label: 'Sunan Abu Dawud', value: 'abudawud' },
    { label: 'Musnad Imam Abu Hanifa', value: 'abuhanifa' },
    { label: 'Sahih al Bukhari', value: 'bukhari' },
    { label: 'Forty Hadith of Shah Waliullah Dehlawi', value: 'dehlawi' },
    { label: 'Sunan Ibn Majah', value: 'ibnmajah' },
    { label: 'Muwatta Malik', value: 'malik' },
    { label: 'Sahih Muslim', value: 'muslim' },
    { label: 'Sunan an Nasai', value: 'nasai' },
    { label: 'Forty Hadith of an-Nawawi', value: 'nawawi' },
    { label: 'Forty Hadith Qudsi', value: 'qudsi' },
    { label: 'Jami At Tirmidhi', value: 'tirmidhi' },
  ];

  //array for the hadith language option
  const options2 = [
    { label: 'English', value: 'eng' },
    { label: 'Arabic', value: 'ara' },
  ];

  return (
    <View>
      <View style={styles.headerContainer}>
        <Text style={styles.appTitle}>SunnahSnap</Text>
        <Text style={styles.appSubtitle}>Sayings of Prophet Muhammad (ﷺ)</Text>
      </View>
      <ScrollView>
        <Text style={styles.sectionTitle}>Settings</Text> 
        <View style={styles.settingsCard}>
          <Text style={styles.settingsLabel}>Select a Hadith Book</Text>
          {Platform.OS === 'ios' ? (
              <RNPickerSelect
              pickerProps={{style: {color: '#1a1a1a', backgroundColor: '#ffffff'}, itemStyle: {color: '#1a1a1a', backgroundColor: '#ffffff'}}}
              style={{ inputIOS: styles.inputIOS, viewContainer: styles.pickerContainer, iconContainer: styles.iconContainer, }}
              Icon={() => {
                return <Feather name="chevron-down" size={20} color="#6b7280" />;
              }}
              placeholder={placeholder}
              items={options}
              onValueChange={(value) => setSelectedValue(value)}
              value={selectedValue}
              />
          ) : (
              <RNPickerSelect
              pickerProps={{style: {color: '#1a1a1a', backgroundColor: '#ffffff'}, itemStyle: {color: '#1a1a1a', backgroundColor: '#ffffff'}}}
              placeholder={placeholder}
              items={options}
              onValueChange={(value) => setSelectedValue(value)}
              value={selectedValue}
              />
          )}
          <TouchableOpacity onPress={saveBook} activeOpacity={0.8}>
            <View style={styles.buttonPrimary}>
                <Text style={styles.buttonText}>Save Changes</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.settingsCard}>
          <Text style={styles.settingsLabel}>Select a Language for the hadiths</Text>
          {Platform.OS === 'ios' ? ((
              <RNPickerSelect
              pickerProps={{style: {color: '#1a1a1a', backgroundColor: '#ffffff'}, itemStyle: {color: '#1a1a1a', backgroundColor: '#ffffff'}}}
              style={{ inputIOS: styles.inputIOS, viewContainer: styles.pickerContainer, iconContainer: styles.iconContainer, }}
              Icon={() => {
                return <Feather name="chevron-down" size={20} color="#6b7280" />;
              }}
              placeholder={placeholder2}
              items={options2}
              onValueChange={(value) => setSelectedValue2(value)}
              value={selectedValue2}
              />          
            )) : (
              <RNPickerSelect
              pickerProps={{style: {color: '#1a1a1a', backgroundColor: '#ffffff'}, itemStyle: {color: '#1a1a1a', backgroundColor: '#ffffff'}}}
              placeholder={placeholder2}
              items={options2}
              onValueChange={(value) => setSelectedValue2(value)}
              value={selectedValue2}
              />
          )}
          <TouchableOpacity onPress={saveLang} activeOpacity={0.8}>
                <View style={styles.buttonPrimary}>
                    <Text style={styles.buttonText}>Save Changes</Text>
                </View>
          </TouchableOpacity>
        </View>   
        <View style={styles.developerInfo}>
        <Text style={styles.recCardTitle}>Developer Information</Text>
        <Text style={styles.developerText}>This app was made with love by BAQDEV</Text>
        <Text style={styles.developerText}>Check out my github profile @ https://github.com/baqx</Text>
        <Text style={styles.developerText}>Hire me for your App and Web development projects - Whatsapp(+2349019659410)</Text>
        <Text style={styles.developerText}>Facebook Profile - https://web.facebook.com/baqeecodes</Text>
        </View>
        <View style={{alignItems:'center',margin:20, marginBottom: 120}}>
          <Text style={{color:'#9ca3af', fontSize: 13, fontWeight: '500'}}>Copyright {new Date().getFullYear()}</Text>
        </View>
      </ScrollView>
    </View>
  );
}
