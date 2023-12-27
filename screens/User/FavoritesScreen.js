import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { getFirestore, collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { updateDoc } from 'firebase/firestore';

const FavoritePage = () => {
  const [userData, setUserData] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [favoritesWordsData, setFavoritesWordsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [displayEnglish, setDisplayEnglish] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLearned, setIsLearned] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        fetchUserData(user.email);
      } else {
        setUserEmail(null);
        setUserData(null);
        setFavoritesWordsData([]);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (email) => {
    try {
      const firestore = getFirestore();

      const userQuery = query(collection(firestore, 'Users'), where('email', '==', email));
      const userQuerySnapshot = await getDocs(userQuery);

      if (userQuerySnapshot.size > 0) {
        const userData = userQuerySnapshot.docs[0].data();
        setUserData(userData);

        const favoritesWordsIds = userData.favoritesWords || [];
        if (favoritesWordsIds.length === 0) {
          setFavoritesWordsData([]);
          setIsLoading(false);
          return;
        }
        const wordsPromises = favoritesWordsIds.map(async (wordId) => {
          const wordDocRef = doc(firestore, 'Words', wordId);
          const wordDocSnapshot = await getDoc(wordDocRef);

          if (wordDocSnapshot.exists()) {
            return wordDocSnapshot.data();
          } else {
            return null;
          }
        });

        const wordsData = await Promise.all(wordsPromises);

        setFavoritesWordsData(wordsData.filter((word) => word !== null));
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsLoading(false);
    }
  };

  const toggleDisplayLanguage = () => {
    setIsFlipped(true);
    setDisplayEnglish((prevDisplay) => !prevDisplay);
  };

  const goNext = () => {
    if (currentIndex < favoritesWordsData.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setIsFlipped(false);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setIsFlipped(false);
    }
  };

  const toggleFavoriteButton = async () => {
    const currentWordID = getCurrentWordID();

    if (isFavorite) {
      removeFromFavorite(currentWordID);
    } else {
      addToFavorite(currentWordID);
    }

    setIsFavorite((prevIsFavorite) => !prevIsFavorite);
  };

  const getCurrentWordID = () => {
    const currentWordID = favoritesWordsData[currentIndex]?.id;
    return currentWordID;
  };

  const removeFromFavorite = async (currentWordID) => {
    const firestore = getFirestore();
    const uid = getUserId();
    const userDocRef = doc(firestore, 'Users', uid);
    const newFavoriteWordsIDs = removeWordFromFavoriteWordsIDsArray(currentWordID);
    await updateDoc(userDocRef, {
      favoritesWords: newFavoriteWordsIDs,
    });

    setFavoritesWordsData(favoritesWordsData.filter((word) => word.id !== currentWordID));
  };

  const addToFavorite = async (currentWordID) => {
    const firestore = getFirestore();
    const uid = getUserId();
    const userDocRef = doc(firestore, 'Users', uid);
    const newFavoriteWordsIDs = addWordToFavoriteWordsIDsArray(currentWordID);

    await updateDoc(userDocRef, {
      favoritesWords: newFavoriteWordsIDs,
    });
  };

  const favoriteButton = () => {
    console.log('Favorilere Eklendi');
    setIsFavorite((prevIsFavorite) => !prevIsFavorite);
  };

  const removeWord = () => {
    console.log('Kelime Çıkarıldı');
    setIsLearned((prevIsLearned) => !prevIsLearned);
  };

  const getUserId = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.uid;
    return uid;
  };

  const getFavoriteWordsIDs = () => {
    const favoriteWordsIDs = userData?.favoritesWords;
    return favoriteWordsIDs;
  };

  const removeWordFromFavoriteWordsIDsArray = (currentWordID) => {
    const favoriteWordsIDs = getFavoriteWordsIDs();
    const newFavoriteWordsIDs = favoriteWordsIDs.filter((wordID) => wordID !== currentWordID);
    return newFavoriteWordsIDs;
  };

  const addWordToFavoriteWordsIDsArray = (currentWordID) => {
    const favoriteWordsIDs = getFavoriteWordsIDs();

    if (favoriteWordsIDs.includes(currentWordID)) {
      return favoriteWordsIDs;
    }

    const newFavoriteWordsIDs = [...favoriteWordsIDs, currentWordID];
    return newFavoriteWordsIDs;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
          <TouchableOpacity onPress={favoriteButton} style={styles.iconContainer}>
            <MaterialIcons name={isFavorite ? 'favorite' : 'favorite-border'} size={34} color="red" />
          </TouchableOpacity>
          <TouchableOpacity onPress={removeWord} style={styles.iconContainer}>
            <MaterialIcons name="add-task" size={34} color={isLearned ? 'green' : 'black'} />
          </TouchableOpacity>
        </View>

      <FlipCard
        style={styles.cardContainer}
        friction={2.4}
        perspective={1000}
        flipHorizontal={true}
        flipVertical={false}
        flip={isFlipped}
        clickable={true}
        onFlipEnd={(isFlipEnd) => {
          console.log('isFlipEnd', isFlipEnd);
        }}
      >
        {/* Front Side */}
        <View style={[styles.card, styles.cardFront]}>
          <TouchableOpacity onPress={toggleDisplayLanguage}>
            <Text style={styles.cardText}>
              {displayEnglish ? favoritesWordsData[currentIndex]?.eng : favoritesWordsData[currentIndex]?.tr}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Back Side */}
        <View style={[styles.card, styles.cardBack]}>
          <TouchableOpacity onPress={toggleDisplayLanguage}>
            <Text style={styles.cardText}>
              {displayEnglish ? favoritesWordsData[currentIndex]?.tr : favoritesWordsData[currentIndex]?.eng}
            </Text>
          </TouchableOpacity>
        </View>
      </FlipCard>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={goBack} style={styles.button}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goNext} style={styles.button}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  iconContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  noWordsText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    padding: 20,
    backgroundColor: '#3498db',
    borderRadius: 8,
    width: '45%',
  },
  cardContainer: {
    width: 300,
    height: 400,
    justifyContent: 'center',
    marginBottom: 50,
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightblue',
    borderRadius: 10,
  },
  cardFront: {
    backgroundColor: 'lightblue',
  },
  cardBack: {
    backgroundColor: 'lightgreen',
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});


export default FavoritePage;
