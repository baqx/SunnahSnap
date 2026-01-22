import { useState, useEffect, useContext, useCallback } from 'react'; // Added useCallback
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  Share,
  TouchableOpacity,
  Alert,
} from 'react-native';
import styles from './constants/MyStyles.js';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SSContexts } from '../../contexts/SSContexts.js';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const splitAndHighlightRecursive = (str, searchWord) => {
    const lowerStr = str.toLowerCase();
    const lowerSearchWord = searchWord.toLowerCase();
    const searchWordLength = searchWord.length;

    const index = lowerStr.indexOf(lowerSearchWord);

    if (index === -1) {
        return str.length > 0 ? [str] : [];
    }

    const startIndex = index;
    const endIndex = index + searchWordLength;

    const part1 = str.slice(0, startIndex);

    const part2 = str.slice(startIndex, endIndex);

    const part3 = str.slice(endIndex);

    const remainingParts = splitAndHighlightRecursive(part3, searchWord);

    const result = [];
    if (part1.length > 0) result.push(part1);
    result.push(part2);
    result.push(...remainingParts);

    return result;
};

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

const HadithItem = ({ hadithNumber, text, book, hadith, searchWord, searching, lang, bookName }) => {

  let parts = [];
  const wordExists = text.toLowerCase().includes(searchWord.toLowerCase());

  if (searching && wordExists && searchWord.length > 1) {
      parts = splitAndHighlightRecursive(text, searchWord); 
  }

  const shouldHighlight = parts.length > 1;

  const [isSaved, setIsSaved] = useState(false); 

  const itemKey = `${bookName}:${hadithNumber}`;

  const checkSavedStatus = async () => {
    try {
      const item = await AsyncStorage.getItem(itemKey);
      setIsSaved(item !== null); 
    } catch (e) {
      console.error('Error checking saved status:', e);
      setIsSaved(false); 
    }
  };

  const toggleSave = async () => {
    try {
      if (isSaved) {
        await AsyncStorage.removeItem(itemKey);
        setIsSaved(false);
        console.log(`Removed item: ${itemKey}`);
      } else {
        await AsyncStorage.setItem(itemKey, text);
        setIsSaved(true);
        console.log(`Saved item: ${itemKey}`);
      }
    } catch (e) {
      console.error('Error toggling save status:', e);
      Alert.alert("Error", "Could not update saved status.");
    }
  };

  useEffect(() => {
    checkSavedStatus();
  }, [itemKey]);

  return (
    <View style={styles.recCard}>
        <Text style={styles.recCardTitle}>
            Book {book}, Hadith {hadith}
        </Text>
        <Text style={styles.recCardContent}>
            {shouldHighlight ? (
                <>
                    {parts.map((part, i) => {
                        if (parts.length === 2 && parts[0].length < parts[1].length) {
                            if (i === 0) {
                                return <Text key={i} style={styles.highlightText}>{part}</Text>
                            } else {
                                return <Text key={i}>{part}</Text>
                            }
                        };
                        if (i % 2 === 0) {
                            return <Text key={i}>{part}</Text>
                        }
                        else {
                            return <Text key={i} style={styles.highlightText}>{part}</Text>
                        }
                    })}
                </>
            ) : (
                text
            )}{lang === "eng" ? "." : ""}
        </Text>
        <View style={styles.line} />
        <View style={styles.actionButtonContainer}>
            <Text style={styles.recCardFoot}>No. {hadithNumber}</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity 
                onPress={() => onShare(text, bookName, hadithNumber)}
                style={styles.actionButton}
              >
                <Feather name="share-2" size={20} color="#6a3eb2" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={toggleSave}
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

// --- Main Screen Component ---
export default function HadithsScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { hadithBook, hadithLang } = useContext(SSContexts);

  const { sectionNo } = route.params;

  const [hadiths, setHadiths] = useState([]);
  const [allHadiths, setAllHadiths] = useState([])
  const [searchText, setSearchText] = useState("")
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasError, setHasError] = useState(false);
  const [metadata, setMetadata] = useState({});

  const fetchData = useCallback(async () => {
    if (searching) return;

    if (pageNumber > totalPages && hadiths.length > 0) return;
 
    if (pageNumber === 1 && hadiths.length > 0) {
      setHadiths([]);
    }

    try {
      setLoading(true);
      setHasError(false);

      const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${hadithLang}-${hadithBook}/sections/${sectionNo}.json`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (pageNumber === 1) {
        setMetadata(data.metadata);
        setTotalPages(Math.ceil(data.hadiths.length / 20));
      }

      const startIndex = (pageNumber - 1) * 20;
      const endIndex = pageNumber * 20;
      const newHadiths = data.hadiths.slice(startIndex, endIndex);
      const all = data.hadiths
      setAllHadiths(all)

      setHadiths((prevHadiths) => [...prevHadiths, ...newHadiths]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setHasError(true);
      if (pageNumber > 1) {
          setPageNumber(1);
      }
    } finally {
      setLoading(false);
    }
  }, [pageNumber, hadithLang, hadithBook, sectionNo, totalPages, hadiths.length]);

  useEffect(() => {
    setHadiths([]);
    setPageNumber(1);
    setTotalPages(1);
    setHasError(false);
    setLoading(false);

    fetchData();
  }, [hadithBook, hadithLang, sectionNo]);

  useEffect(() => {
    if (pageNumber > 1) {
        fetchData();
    }
  }, [pageNumber, fetchData]);

  useEffect(() => {
    if (searchText !== "") {
      setSearching(true)
      setHadiths(allHadiths.filter((hadith) => hadith.text.toLowerCase().includes(searchText.toLowerCase())))
    } else {
      setSearching(false)
      setHadiths(allHadiths)
    }
  }, [searchText])

  const loadMoreData = () => {
    if (!loading && pageNumber < totalPages) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };

  const backButton = () => {
    navigation.navigate('Home');
  };

  // --- Render Functions ---

  // const renderFooter = () => {
  //   if (loading) {
  //     if (hadiths.length > 0) {
  //       return <ActivityIndicator size="large" color="#6a3eb2" style={{marginVertical: 20}} />;
  //     }
  //     return null;
  //   }
  //   
  //   if (hasError) {
  //     return (
  //       <View style={styles.recCard}>
  //         <Text style={styles.recCardTitle}>Something went wrong! What can you do?</Text>
  //         <Text style={styles.recCardContent}>1. Check your internet connection.</Text>
  //         <View style={{ flexDirection: 'row' }}>
  //           <Text style={styles.recCardContent}>
  //             2. Try changing the language of the hadith book you are using to Arabic, some books are available only in Arabic.{' '}
  //             <TouchableOpacity onPress={goToSettings}>
  //               <Feather name="settings" style={{ margin: 4, fontSize: 24 }} color="#6a3eb2" />
  //             </TouchableOpacity>
  //           </Text>
  //         </View>
  //       </View>
  //     );
  //   }

  //   return null;
  // };

  // const renderHeader = () => {
  //   
  //   const sectionTitle =
  //     metadata.section && Object.keys(metadata.section).length > 0
  //       ? `${Object.keys(metadata.section)[0]}: ${metadata.section[Object.keys(metadata.section)[0]]}`
  //       : 'Loading Section...';

  //   return (
  //     <View style={styles.headerContainer}>
  //       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  //         <TouchableOpacity onPress={backButton} style={{ marginRight: 10 }}>
  //           <Icon name="keyboard-left-arrow-button" size="14" width="40" color="white" />
  //         </TouchableOpacity>
  //         <View style={{ flexDirection: 'column', flex: 1 }}>
  //           {metadata.name && <Text style={styles.appTitle}>SunnahSnap - {metadata.name}</Text>}
  //           <Text style={styles.appSubtitle}>Section {sectionTitle}</Text>
  //         </View>
  //       </View>
  //     </View>
  //   );
  // };

  const sectionTitle =
  metadata.section && Object.keys(metadata.section).length > 0
    ? `${Object.keys(metadata.section)[0]}: ${metadata.section[Object.keys(metadata.section)[0]]}`
    : 'Loading Section...';

  // --- Main Render ---
  if (loading && hadiths.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6a3eb2" style={{ flex: 1 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            onPress={backButton} 
            style={{ 
              marginRight: 12,
              padding: 8,
              borderRadius: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            }}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'column', flex: 1 }}>
            {metadata.name && <Text style={styles.appTitle}>{metadata.name}</Text>}
            <Text style={styles.appSubtitle}>Section {sectionTitle}</Text>
          </View>
        </View>
      </View>
      <View style={styles.search}>
        <TextInput
          style={styles.input}
          placeholder={"Search keyword"}
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#aaa"
          />
        <Feather name="search" size={20} color="#888" style={styles.icon} />
      </View>
      <FlatList
        data={hadiths}
        keyExtractor={(item, index) => `${item.hadithnumber}-${index}`}
        renderItem={({ item }) => (
          <HadithItem
            hadithNumber={item.hadithnumber}
            book={item.reference.book}
            hadith={item.reference.hadith}
            text={item.text}
            searchWord={searchText}
            searching={searching}
            lang={hadithLang}
            bookName={hadithBook}
          />
        )}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.2}
        // ListFooterComponent={renderFooter} // Footer is obsolete.
        // ListHeaderComponent={renderHeader} // I had to comment out both the Footer and Header separate components and instead render them directly within the main component's render method because their previous setup was interfering with the searchText state.
        // stickyHeaderIndices is useful here to keep the title visible
        // stickyHeaderIndices={[0]}
      />
    </View>
  );
}