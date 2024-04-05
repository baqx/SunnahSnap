import React, { useState,useEffect,useContext } from 'react';
import { View, Text,SafeAreaView,FlatList,ActivityIndicator, TouchableOpacity } from 'react-native';
import styles from './constants/MyStyles.js'; 
import Icon from 'react-native-ico-material-design';
import {useNavigation,useRoute} from '@react-navigation/native';
import { SSContexts } from '../../contexts/SSContexts.js';
import { Feather } from '@expo/vector-icons'; 


const HadithItem = ({ hadithNumber, text,book,hadith }) => (
    <TouchableOpacity>
    <View style={styles.recCard}>
                <Text style={styles.recCardTitle}>Book {book}, Hadith {hadith} </Text>
                <Text style={styles.recCardContent}>{text}</Text>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
               <View></View>
               <View style={{alignItems:'flex-end'}} >
                    <Text style={styles.recCardFoot}>No. {hadithNumber}</Text>
                </View>
                </View>  
            </View>
            </TouchableOpacity>
    
  );
export default function HadithsScreen() {
    const route=useRoute()
    const [hadiths, setHadiths] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sectionName, setSectionName]= useState('')
    const [loadedHadiths,setLoadedHadiths]=useState(true);
    const [metadata, setMetadata] = useState({});
    const {hadithBook}=useContext(SSContexts);
    const {hadithLang}=useContext(SSContexts);
    useEffect(() => {
        // Fetch data when component mounts
        fetchData();
      },[pageNumber,hadithLang]);
    
      const fetchData = async () => {
        try {
          setLoading(true);
        
          
            
            const response=await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${hadithLang}-${hadithBook}/sections/${route.params.sectionNo}.json`);

          const data = await response.json();
          setMetadata(data.metadata);
          setTotalPages(Math.ceil(data.hadiths.length / 20));
          const startIndex = (pageNumber - 1) * 20;
          const endIndex = pageNumber * 20;
          const newHadiths = data.hadiths.slice(startIndex, endIndex);
          setHadiths((prevHadiths) => [...prevHadiths, ...newHadiths]);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false);
          setLoadedHadiths(false);
          
        }
      };
    
      const loadMoreData = () => {
        if (!loading && pageNumber < totalPages) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      };
      const goToSettings = () => {
        navigation.navigate('Settings')
      };
      const renderFooter = () => {
        if (loading) {
          return <ActivityIndicator size="large" color="#6a3eb2" />;
        } else {
          
          if(!loadedHadiths){
          return(
            <>
            <SafeAreaView style={styles.container}>
              <View style={styles.recCard}>
              <Text style={styles.recCardTitle}>Something went wrong! What can you do?</Text>
              <Text style={styles.recCardContent}>1. Check your internet connection.</Text>
              <View style={{flexDirection:'row'}}><Text style={styles.recCardContent}>2. Try Changing the language of the hadith book you are using to arabic, some books are available only in arabic. <TouchableOpacity onPress={goToSettings}>
            <Feather name="settings" style={{margin:4,fontSize:24}}   color="#6a3eb2"/>
                </TouchableOpacity>
      </Text></View> 
              
            </View>
            </SafeAreaView>
            
            </>
          )
        }else{
            return null;
          }
        }
        
      };
      const navigation=useNavigation();

      const backButton = () => {
        navigation.navigate('Home')
      };
      const renderHeader = () => {
        return(
            <>
            <View style={styles.headerContainer}>
            <View style={{flexDirection:'row'}}>
                    <View style={{margin:'0'}}>
                <TouchableOpacity onPress={backButton}>
                    <Icon name="keyboard-left-arrow-button" style={{margin:0}} size="14" width="40" color="white"/>
                </TouchableOpacity>
                
                    </View>
                    <View style={{flexDirection:'column'}}>
                    {metadata.name && <Text style={styles.appTitle}>SunnahSnap - {metadata.name}</Text>}
                {metadata.section && (
          <Text style={styles.appSubtitle}>
            
            Section {Object.keys(metadata.section)[0]}: {metadata.section[Object.keys(metadata.section)[0]]}
          </Text>
        )}
        </View>
                    
            </View>
              
                
            </View>
            
            
            </>
            
        );
      };
    return (
        
        <SafeAreaView style={styles.container}>
          
            <FlatList
        data={hadiths}
        keyExtractor={(item, index) => item.hadithnumber.toString() + index}
        renderItem={({ item }) => (
          <HadithItem hadithNumber={item.hadithnumber} book={item.reference.book}
           hadith={item.reference.hadith} text={item.text} />
        )}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.2}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={renderHeader}
        stickyHeaderIndices={[0]}
      />
           
        </SafeAreaView>
        
    );
}
