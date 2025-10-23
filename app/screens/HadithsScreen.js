import React, { useState, useEffect, useContext, useCallback } from 'react'; // Added useCallback
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import styles from './constants/MyStyles.js';
import Icon from 'react-native-ico-material-design';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SSContexts } from '../../contexts/SSContexts.js';
import { Feather } from '@expo/vector-icons';

// --- Hadith Item Component ---
const HadithItem = ({ hadithNumber, text, book, hadith }) => (
  // TouchableOpacity should be used as a button, in this case it does nothing. 
  <TouchableOpacity>
    <View style={styles.recCard}>
      <Text style={styles.recCardTitle}>
        Book {book}, Hadith {hadith}{' '}
      </Text>
      <Text style={styles.recCardContent}>{text}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View></View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.recCardFoot}>No. {hadithNumber}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

// --- Main Screen Component ---
export default function HadithsScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  // 1. FIX: Combine useContext calls and destructure
  const { hadithBook, hadithLang } = useContext(SSContexts);

  // Get sectionNo from route params
  const { sectionNo } = route.params;

  const [hadiths, setHadiths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // 2. FIX: Rename and correct initial state for loadedHadiths
  const [hasError, setHasError] = useState(false);
  const [metadata, setMetadata] = useState({});

  // 3. IMPROVEMENT: Memoize fetchData using useCallback
  const fetchData = useCallback(async () => {
    // Prevent fetching if we've reached the end on a subsequent load
    if (pageNumber > totalPages && hadiths.length > 0) return;

    // The first time fetchData runs, pageNumber is 1, and we clear the hadiths array.
    // On subsequent runs (loadMoreData), pageNumber > 1, and we append new data.
    if (pageNumber === 1 && hadiths.length > 0) {
      setHadiths([]);
    }

    try {
      setLoading(true);
      setHasError(false); // Reset error state

      const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${hadithLang}-${hadithBook}/sections/${sectionNo}.json`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Only set metadata and totalPages on the initial load (page 1)
      if (pageNumber === 1) {
        setMetadata(data.metadata);
        // Assuming 20 items per page for pagination
        setTotalPages(Math.ceil(data.hadiths.length / 20));
      }

      const startIndex = (pageNumber - 1) * 20;
      const endIndex = pageNumber * 20;
      const newHadiths = data.hadiths.slice(startIndex, endIndex);

      setHadiths((prevHadiths) => [...prevHadiths, ...newHadiths]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setHasError(true);
      // Since we couldn't load, reset pageNumber to 1 to allow retry
      if (pageNumber > 1) {
          setPageNumber(1);
      }
    } finally {
      setLoading(false);
    }
  }, [pageNumber, hadithLang, hadithBook, sectionNo, totalPages, hadiths.length]);

  // 4. FIX: useEffect must include fetchData, hadithBook, and sectionNo in dependencies
  useEffect(() => {
    // Reset state and page number when book, language, or section changes
    setHadiths([]);
    setPageNumber(1);
    setTotalPages(1); // Reset total pages
    setHasError(false);
    setLoading(false); // Make sure loading is false initially

    // Call fetchData now that all state is reset.
    // The useCallback hook ensures fetchData only changes when its own dependencies change.
    // This allows us to use pageNumber as a dependency inside fetchData.
    fetchData();
  }, [hadithBook, hadithLang, sectionNo]);

  // Use a separate useEffect to monitor pageNumber changes and fetch more data
  useEffect(() => {
    if (pageNumber > 1) {
        fetchData();
    }
  }, [pageNumber, fetchData]); // fetchData is memoized, so this is safe

  const loadMoreData = () => {
    if (!loading && pageNumber < totalPages) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };

  const backButton = () => {
    navigation.navigate('Home');
  };

  // --- Render Functions ---

  const renderFooter = () => {
    if (loading) {
      // Show loader only when loading more pages (not on initial fetch or error)
      if (hadiths.length > 0) {
        return <ActivityIndicator size="large" color="#6a3eb2" style={{marginVertical: 20}} />;
      }
      return null; // Loader is covered by the main render flow for initial load
    }

    // 2. FIX: Use the corrected 'hasError' state
    if (hasError) {
      return (
        <View style={styles.recCard}>
          <Text style={styles.recCardTitle}>Something went wrong! What can you do?</Text>
          <Text style={styles.recCardContent}>1. Check your internet connection.</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.recCardContent}>
              2. Try changing the language of the hadith book you are using to Arabic, some books are available only in Arabic.{' '}
              <TouchableOpacity onPress={goToSettings}>
                <Feather name="settings" style={{ margin: 4, fontSize: 24 }} color="#6a3eb2" />
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      );
    }

    return null;
  };

  const renderHeader = () => {
    // Safely access section name
    const sectionTitle =
      metadata.section && Object.keys(metadata.section).length > 0
        ? `${Object.keys(metadata.section)[0]}: ${metadata.section[Object.keys(metadata.section)[0]]}`
        : 'Loading Section...';

    return (
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={backButton} style={{ marginRight: 10 }}>
            <Icon name="keyboard-left-arrow-button" size="14" width="40" color="white" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'column', flex: 1 }}>
            {metadata.name && <Text style={styles.appTitle}>SunnahSnap - {metadata.name}</Text>}
            <Text style={styles.appSubtitle}>Section {sectionTitle}</Text>
          </View>
        </View>
      </View>
    );
  };

  // --- Main Render ---
  if (loading && hadiths.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#6a3eb2" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={hadiths}
        // Use a combination of hadithnumber and index for a unique key, as hadithnumber might be repeated across pages
        keyExtractor={(item, index) => `${item.hadithnumber}-${index}`}
        renderItem={({ item }) => (
          <HadithItem
            hadithNumber={item.hadithnumber}
            book={item.reference.book}
            hadith={item.reference.hadith}
            text={item.text}
          />
        )}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.2}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={renderHeader}
        // stickyHeaderIndices is useful here to keep the title visible
        stickyHeaderIndices={[0]}
      />
    </SafeAreaView>
  );
}