import { useState, useEffect, useContext, useRef } from 'react';
import {
  Text,
  TextInput,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import styles from './constants/MyStyles.js';
import { useNavigation } from '@react-navigation/native';
import { SSContexts } from '../../contexts/SSContexts.js';
import { Feather } from '@expo/vector-icons';

export default function HomeScreen() {
  const { hadithBook, hadithLang } = useContext(SSContexts);

  const [sections, setSections] = useState([]);
  //const [sectionNo, setSectionNo] = useState(1); // 'sectionNo' is declared but not used in the final logic
  const [loading, setLoading] = useState(true);
  const [hadithData, setHadithData] = useState(null);
  const [searchText, setSearchText] = useState("");

  const navigation = useNavigation();

  const url =
    'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-' +
    hadithBook +
    '.json';

  // --- Effect to Fetch Sections Data ---
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
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hadithBook, hadithLang]); // Re-fetch when book or language changes

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
        // Safe access to nested data
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
  }, [hadithBook, randomNumber]); // Re-fetch when book changes

  // --- Helper Functions ---

  const goToHadiths = (sid) => {
    navigation.navigate('Hadiths', { sectionNo: sid });
  };

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const goToSettings = () => {
    navigation.navigate('Settings');
  };

  // --- Components ---

  const SectionItem = ({ id, title }) => (
    <TouchableOpacity onPress={() => goToHadiths(id)} style={styles.recCard}>
      <Text style={styles.title}>
        {id}: {title}
      </Text>
    </TouchableOpacity>
  );

  const RandomHadithsCard = ({
    sectionName,
    hadithNumber,
    hadithText,
    hadithReference,
  }) => {
    return (
      <View style={styles.recCard}>
        <Text style={styles.recCardTitle}>{sectionName}</Text>
        <Text style={styles.recCardContent}>{hadithText}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.recCardFoot}>No {hadithNumber}</Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.recCardFoot}>
              Book {hadithReference.book}, Hadith {hadithReference.hadith}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // --- Render Header Component for FlatList ---

  const renderHeader = () => {
    return (
      <SafeAreaView>

      </SafeAreaView>
    );
  };

  // --- Main Render ---

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6a3eb2" />
      ) : (
        <View>
                  <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.sectionTitle}>
            Featured Topics ({hadithBook.charAt(0).toUpperCase() + hadithBook.slice(1)})
          </Text>
          <TouchableOpacity onPress={goToSettings}>
            <Feather name="settings" style={{ margin: 4, fontSize: 30 }} color="#6a3eb2" />
          </TouchableOpacity>
        </View>
        <View style={styles.search}>
          <TextInput
            style={styles.input}
            placeholder={"Search Hadith"}
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#aaa"
            />
          <Feather name="search" size={20} color="#888" style={styles.icon} />
        </View>
            <FlatList
              data={sections}
              keyExtractor={(item) => item[0]} // item[0] is the section key (ID)
              renderItem={({ item }) => <SectionItem id={item[0]} title={item[1]} />}
              />
        </View>
      )}
    </SafeAreaView>
  );
}