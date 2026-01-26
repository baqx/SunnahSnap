import { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Share,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import styles from './constants/MyStyles.js';
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

const HadithItem = ({ number, text, book, searchWord, searching, onRemove }) => {
  let parts = [];
  const wordExists = text.toLowerCase().includes(searchWord.toLowerCase());

  if (searching && wordExists && searchWord.length > 1) {
      parts = splitAndHighlightRecursive(text, searchWord); 
  }

  const shouldHighlight = parts.length > 1;

  const [isSaved, setIsSaved] = useState(false); 

  const itemKey = `${book}:${number}`;

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
        onRemove();
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
            {book.toUpperCase()}, {number}
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
            )}.
        </Text>
        <View style={styles.line} />
        <View style={styles.actionButtonContainer}>
            <Text style={styles.recCardFoot}>No. {number}</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity 
                onPress={() => onShare(text, book, number)}
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


const getFormattedBookItems = async () => {
    try {
        const allKeys = await AsyncStorage.getAllKeys();
        const bookKeys = allKeys.filter(key => {
        const parts = key.split(':');
        return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;
        });

        const bookPairs = await AsyncStorage.multiGet(bookKeys);

        const formattedData = bookPairs.map(([key, textValue]) => {
        const [bookName, hadithNumberStr] = key.split(':');
        
        const hadithNumber = parseInt(hadithNumberStr, 10);

        return {
            book: bookName,
            hadith: hadithNumber,
            text: textValue,
        };
        });
        return formattedData;
    } catch (error) {
        console.error("Error retrieving and formatting book items:", error);
        return [];
    }
};

const clearAsyncStorage = async () => {
    try {
        await AsyncStorage.clear();
    } catch (e) {
        console.error("Failed to clear AsyncStorage:", e);
    }
};


export default function FavoritesScreen() {

    const [hadiths, setHadiths] = useState([])
    const [allHadiths, setAllHadiths] = useState([])
    const [searchText, setSearchText] = useState("")
    const [searching, setSearching] = useState(false)
    const [headerHeight, setHeaderHeight] = useState(0)
  
    const headerRef = useRef(null)

    const onHeaderLayout = () => {
      headerRef.current.measure((x, y, width, height, pageX, pageY) => {
        setHeaderHeight(height);
      })
    }

    const removeItem = (idToRemove) => {
        setHadiths(prevData => prevData.filter(item => item.hadith !== idToRemove));
        setHadiths(prevData => prevData.filter(item => item.hadith !== idToRemove));
    };

    const loadHadiths = async () => {
        try {
            const fetchedHadiths = await getFormattedBookItems(); 
            setHadiths(fetchedHadiths);
            setAllHadiths(fetchedHadiths);
        } catch (error) {
            console.error("Failed to load hadiths:", error);
        }
    };

    useEffect(() => {
    if (searchText !== "") {
        setSearching(true)
        setHadiths(allHadiths.filter((hadith) => hadith.text.toLowerCase().includes(searchText.toLowerCase())))
    } else {
        setSearching(false)
        setHadiths(allHadiths)
    }
    }, [searchText])

    useEffect(() => {
        //clearAsyncStorage()
        getFormattedBookItems().then((result) => {
            setHadiths(result)
            setAllHadiths(result)
        })

    }, [])

    useFocusEffect(
      useCallback(() => {
        loadHadiths(); 
        return () => {
        };
      }, [])
    );

    return (
        <View>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <View style={styles.headerContainer} ref={headerRef} onLayout={onHeaderLayout}>
              <Text style={styles.appTitle}>SunnahSnap</Text>
              <Text style={styles.appSubtitle}>Sayings of Prophet Muhammad (ﷺ)</Text>
            </View>
            <ScrollView>
              <Text style={styles.sectionTitle}>Favorite Hadiths</Text>
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
              {hadiths.length === 0 ?
                <View style={styles.emptyState}>
                  <Ionicons name="star-outline" size={64} color="#d1d5db" />
                  <Text style={styles.emptyStateText}>You don't have any favorite hadith yet!</Text>
                  <Text style={[styles.emptyStateText, { fontSize: 14, marginTop: 4 }]}>Start bookmarking hadiths to see them here</Text>
                </View>
              :
                <View style={{paddingBottom: headerHeight}}>
                    {hadiths.map((item, i) => (
                        <HadithItem
                        key={i}
                        number={item.hadith}
                        book={item.book}
                        text={item.text}
                        searchWord={searchText}
                        searching={searching}
                        onRemove={() => removeItem(item.hadith)}
                        />
                    ))}
                </View>
              }
            </ScrollView>
        </View>
    )
}