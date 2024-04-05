
import React,{useState, useEffect, useContext} from 'react';
import {Text, View, SafeAreaView,FlatList, TouchableOpacity,ActivityIndicator,StatusBar } from 'react-native';
import styles from './constants/MyStyles.js'; 
import {useNavigation} from '@react-navigation/native';
import { SSContexts } from '../../contexts/SSContexts.js';
import { Feather } from '@expo/vector-icons'; 
export default function HomeScreen() {
    const [sections, setSections] = useState([]);
    const [sectionNo, setSectionNo] = useState(1);
    const[loading,setLoading]=useState(true);
    const {hadithBook}=useContext(SSContexts);
    const {hadithLang}=useContext(SSContexts);
    const [hadithData, setHadithData] = useState(null);
    
    const url = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-" + hadithBook + ".json";


    
    useEffect(() => {
      const fetchData = async () => {
          try {
              setLoading(true);
              const response = await fetch(url);
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              const json = await response.json();
              setSections(Object.entries(json.metadata.sections).filter(([key, value]) => key !== "0"));
          } catch (error) {
              console.error('Error fetching data:', error);
          } finally {
              setLoading(false);
          }
      };
  
     
      fetchData();
  }, [hadithBook,hadithLang]);
    
const navigation=useNavigation()

const goToHadiths = (sid) => {

    navigation.navigate('Hadiths', {sectionNo: sid,});

  };

    const SectionItem = ({ id, title }) => (
        <TouchableOpacity onPress={() => goToHadiths(id)}  style={styles.recCard}>
          <Text style={styles.title}>{id}: {title}</Text>
        </TouchableOpacity >
      );

      

      function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    
    let randomNumber = getRandomNumber(1, 40);
      useEffect(() => {
        fetch("https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-" + hadithBook + "/" + randomNumber + ".min.json")
          .then(response => response.json())
          .then(data => {
            const sectionKey = Object.keys(data.metadata.section)[0]; // Extracting the section key
            const sectionName = data.metadata.section[sectionKey]; // Extracting the section name
            const reference = data.hadiths[0].reference;
            setHadithData({
              sectionName: `Section ${sectionKey}, ${sectionName}`, // Combining the section key and name
              hadithNumber: data.hadiths[0].hadithnumber,
              hadithText: data.hadiths[0].text,
              hadithReference: {
                book: reference.book,
                hadith: reference.hadith
              }
            });
          })
          .catch(error => console.error('Error fetching data:', error));
      }, []);
    
      
      const RandomHadithsCard = ({ sectionName, hadithNumber, hadithText, hadithReference }) => {
      
    
     
        return (
          <View style={styles.recCard}>
          <Text style={styles.recCardTitle}>{sectionName}</Text>
          <Text style={styles.recCardContent}>
             {hadithText}
              </Text>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <Text style={styles.recCardFoot}>No {hadithNumber}</Text>
          <View style={{alignItems:'flex-end'}} >
              <Text style={styles.recCardFoot}>Book {hadithReference.book}, Hadith {hadithReference.hadith}</Text>
          </View>
          </View>  
      </View>
        );
      
    }
    const goToSettings = () => {
      navigation.navigate('Settings')
    };
    const renderHeader = () => {
        return(
           <>
          <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
           
            <View style={styles.headerContainer}>
                <Text style={styles.appTitle}>SunnahSnap</Text>
                <Text style={styles.appSubtitle}>Sayings of Prophet Muhammad (ﷺ)</Text>
            </View>
            <Text style={styles.sectionTitle}>Featured Hadith</Text>  
          {hadithData && (
        <RandomHadithsCard
          sectionName={hadithData.sectionName}
          hadithNumber={hadithData.hadithNumber}
          hadithText={hadithData.hadithText}
          hadithReference={hadithData.hadithReference}
        />
      )}
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        <Text style={styles.sectionTitle}>Featured Topics ({hadithBook.charAt(0).toUpperCase() + hadithBook.slice(1)})</Text>  
            <TouchableOpacity onPress={goToSettings}>
            <Feather name="settings" style={{margin:4,fontSize:30}}  color="#6a3eb2"/>
                </TouchableOpacity>
      </View>
            
            </>
            
        );
      };
    return (
        
        <SafeAreaView style={styles.container}>
            
            
            {loading ? (
    <ActivityIndicator size="large" color="#6a3eb2" />
  ) : (
                <FlatList
                ListHeaderComponent={renderHeader}
            data={sections}
            keyExtractor={(item) => item[0]} // Using the number as the key
            renderItem={({ item }) => (
            <SectionItem id={item[0]} title={item[1]} 
            />
            )}
        />
  )}
        </SafeAreaView>
        
    );
}
