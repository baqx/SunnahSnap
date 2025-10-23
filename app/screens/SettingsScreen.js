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
        <View style={styles.recCard}>
          <Text>Select a Hadith Book</Text>
          {Platform.OS === 'ios' ? (
              <RNPickerSelect
              pickerProps={{style: {color: 'black', backgroundColor: 'white'}, itemStyle: {color: 'black', backgroundColor: 'white'}}}
              style={{ inputIOS: styles.inputIOS, viewContainer: styles.pickerContainer, iconContainer: styles.iconContainer, }}
              Icon={() => {
                return <Feather name="chevron-down" size={20} color="gray" />;
              }}
              placeholder={placeholder}
              items={options}
              onValueChange={(value) => setSelectedValue(value)}
              value={selectedValue}
              />
          ) : (
              <RNPickerSelect
              pickerProps={{style: {color: 'black', backgroundColor: 'white'}, itemStyle: {color: 'black', backgroundColor: 'white'}}}
              placeholder={placeholder}
              items={options}
              onValueChange={(value) => setSelectedValue(value)}
              value={selectedValue}
              />
          )}
          {/* {selectedValue && <Text>Selected: {selectedValue}</Text>} */}
          <TouchableOpacity onPress={saveBook}>
            <View style={{padding:10,backgroundColor:'#6a3eb2',borderRadius:10,color:'white',justifyContent:'center',alignItems:'center',margin:5}}>
                <Text style={{color:'white'}}>Change</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.recCard}>
          <Text>Select a Language for the hadiths</Text>
          {Platform.OS === 'ios' ? ((
              <RNPickerSelect
              pickerProps={{style: {color: 'black', backgroundColor: 'white'}, itemStyle: {color: 'black', backgroundColor: 'white'}}}
              style={{ inputIOS: styles.inputIOS, viewContainer: styles.pickerContainer, iconContainer: styles.iconContainer, }}
              Icon={() => {
                return <Feather name="chevron-down" size={20} color="gray" />;
              }}
              placeholder={placeholder2}
              items={options2}
              onValueChange={(value) => setSelectedValue2(value)}
              value={selectedValue2}
              />          
            )) : (
              <RNPickerSelect
              pickerProps={{style: {color: 'black', backgroundColor: 'white'}, itemStyle: {color: 'black', backgroundColor: 'white'}}}
              placeholder={placeholder2}
              items={options2}
              onValueChange={(value) => setSelectedValue2(value)}
              value={selectedValue2}
              />
          )}
          {/* {selectedValue2 && <Text>Selected: {selectedValue2}</Text>} */}
          <TouchableOpacity onPress={saveLang}>
                <View style={{padding:10,backgroundColor:'#6a3eb2',borderRadius:10,color:'white',justifyContent:'center',alignItems:'center',margin:5}}>
                    <Text style={{color:'white'}}>Change</Text>
                </View>
          </TouchableOpacity>
        </View>   
        <View style={styles.recCard}>
        <Text style={styles.recCardTitle}>Developer Information</Text>
        <Text>This app was made with love by BAQDEV</Text>
        <Text>Check out my github profile @ https://github.com/baqx</Text>
        <Text>Hire me for your App and Web development projects - Whatsapp(+2349019659410)</Text>
        <Text>Facebook Profile - https://web.facebook.com/baqeecodes</Text>
        </View>
        <View style={{alignItems:'center',margin:10, marginBottom: 120}}>
          <Text style={{alignItems:'center',color:'grey'}}>Copyright {new Date().getFullYear()}</Text>
        </View>
      </ScrollView>
    </View>
  );
}
