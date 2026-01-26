import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  Share,
  Alert
} from 'react-native';
import styles from './constants/MyStyles.js';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SSContexts } from '../../contexts/SSContexts.js';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { hadithBook, hadithLang } = useContext(SSContexts);

  const [sections, setSections] = useState([]);
  const [backup, setBackup] = useState([]);
  // const [sectionNo, setSectionNo] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hadithData, setHadithData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [showRandom, setShowRandom] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0)

  const headerRef = useRef(null)

  const navigation = useNavigation();

  const url =
    'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-' +
    hadithBook +
    '.json';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json = await response.json();

        setSections(
          Object.entries(json.metadata.sections).filter(([key]) => key !== '0')
        );
        setBackup(
          Object.entries(json.metadata.sections).filter(([key]) => key !== '0')
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hadithBook, hadithLang]);

  // --- Effect to Fetch Random Hadith Data ---
  // Generate a random number only once on component mount
  const [randomNumber] = useState(getRandomNumber(1, 40));

  useEffect(() => {
    fetch(
      'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-' +
        hadithBook +
        '/' +
        randomNumber +
        '.min.json'
    )
      .then((response) => response.json())
      .then((data) => {
        const sectionKey = Object.keys(data.metadata.section)[0];
        const sectionName = data.metadata.section[sectionKey];
        const reference = data.hadiths[0].reference;

        setHadithData({
          sectionName: `Section ${sectionKey}, ${sectionName}`,
          hadithNumber: data.hadiths[0].hadithnumber,
          hadithText: data.hadiths[0].text,
          hadithReference: {
            book: reference.book,
            hadith: reference.hadith,
          },
        });
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, [hadithBook, randomNumber]);

  useEffect(() => {
    if (searchText !== "") {
      setSections(backup.filter((arr) => arr[1].toLowerCase().includes(searchText.toLowerCase())))
    } else {
      setSections(backup)
    }
  }, [searchText])

  // --- Helper Functions ---

  const onHeaderLayout = () => {
    headerRef.current.measure((x, y, width, height, pageX, pageY) => {
      setHeaderHeight(height);
    })
  }

  const goToHadiths = (sid) => {
    navigation.navigate('Hadiths', { sectionNo: sid });
  };

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const goToSettings = () => {
    navigation.navigate('Settings');
  };

  const updateStorage = async (hadithNumber, text) => {
    const key = `${hadithBook}:${hadithNumber}`
    try {
      const item = await AsyncStorage.getItem(key);

      if (item !== null) {
        return await AsyncStorage.removeItem(key);
      } else {
        return await AsyncStorage.setItem(key, text);
      }
    } catch (e) {
        console.error('Error saving data:', e);
    }
  }

  const checkItem = async (hadithNumber) => {
    const key = `${hadithBook}:${hadithNumber}`
    try {
      const item = await AsyncStorage.getItem(key);
    
      return item !== null
    } catch (e) {
        console.error('Error fetching data:', e);

        return false
    }
  }

  const onShare = async (text, book, number) => {
    try {
      const result = await Share.share({
        title: `${book.toUpperCase()}, ${number}`,
        subject: `${book.toUpperCase()}, ${number}`,
        dialogTitle: `${book.toUpperCase()}, ${number}`,
        message: `${text}.
        - ${book.toUpperCase()}, ${number}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared with: ${result.activityType}`);
        } else {
          console.log('Content shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dialog dismissed');
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  // --- Components ---

  const RandomHadithsCard = ({
    sectionName,
    hadithNumber,
    hadithText,
    hadithReference,
  }) => {

    const [isSaved, setIsSaved] = useState(false);

    const checkStatus = async () => {
      const exists = await checkItem(hadithNumber); 
      setIsSaved(exists);
    };

    useEffect(() => {
      checkStatus();
    }, [randomNumber, hadithNumber]);

    useFocusEffect(
    useCallback(() => {
      checkStatus(); 
      return () => {};
      }, [])
    );

    return (
      <View style={styles.recCard}>
        <Text style={styles.recCardTitle}>{sectionName}</Text>
        <Text style={styles.recCardContent} numberOfLines={showRandom ? undefined : 3}>{hadithText}.</Text>
        {!showRandom ?
        <TouchableOpacity onPress={() => setShowRandom(true)} style={styles.readMoreButton}>
          <Text style={styles.readMoreText}>Read More</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity onPress={() => setShowRandom(false)} style={styles.readMoreButton}>
          <Text style={styles.readMoreText}>Show Less</Text>
        </TouchableOpacity>
        }
        <View style={styles.line} />
        <View style={styles.actionButtonContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.recCardFoot}>No {hadithNumber}</Text>
            <Text style={[styles.recCardFoot, { marginTop: 2 }]}>
              Book {hadithReference.book}, Hadith {hadithReference.hadith}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity 
              onPress={() => onShare(hadithText, hadithBook, hadithNumber)}
              style={styles.actionButton}
            >
              <Feather name="share-2" size={20} color="#6a3eb2" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => updateStorage(hadithNumber, hadithText).then(() => checkStatus())}
              style={styles.actionButton}
            >
              {isSaved ? 
                <Ionicons name="star" size={20} color="#fbbf24" />
                  :
                <Ionicons name="star-outline" size={20} color="#6b7280" />
              }
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // --- Main Render ---

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6a3eb2" style={{ flex: 1 }} />
      ) : (
        <View>
          <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
          <View style={styles.headerContainer} ref={headerRef} onLayout={onHeaderLayout}>
            <Text style={styles.appTitle}>SunnahSnap</Text>
            <Text style={styles.appSubtitle}>Sayings of Prophet Muhammad (ﷺ)</Text>
          </View>
          <ScrollView>
            <Text style={styles.sectionTitle}>Featured Hadith</Text>
            {hadithData && (
              <RandomHadithsCard
                sectionName={hadithData.sectionName}
                hadithNumber={hadithData.hadithNumber}
                hadithText={hadithData.hadithText}
                hadithReference={hadithData.hadithReference}
              />
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.sectionTitle}>
                Featured Topics ({hadithBook.charAt(0).toUpperCase() + hadithBook.slice(1)})
              </Text>
              {/* <TouchableOpacity onPress={goToSettings}>
                <Feather name="settings" style={{ margin: 4, fontSize: 30 }} color="#6a3eb2" />
              </TouchableOpacity> */}
            </View>
            <View style={styles.search}>
              <TextInput
                style={styles.input}
                placeholder={"Search Topic"}
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor="#aaa"
                />
              <Feather name="search" size={20} color="#888" style={styles.icon} />
            </View>
            <View style={{paddingBottom: headerHeight}}>
              {sections.map((item) => (
                <TouchableOpacity 
                  key={item[0]} 
                  onPress={() => goToHadiths(item[0])} 
                  style={styles.recCard}
                  activeOpacity={0.7}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.title} numberOfLines={2}>
                      {item[1]}
                    </Text>
                    <Feather name="chevron-right" size={20} color="#6b7280" style={{ marginLeft: 12 }} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}