import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { MaterialIcons } from '@expo/vector-icons';
import { getFirestore, collection, getDocs, doc, updateDoc, arrayUnion, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const PlayPage = () => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayEnglish, setDisplayEnglish] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLearned, setIsLearned] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackHave, setIsBackHave] = useState(false);
  const [isNextHave, setIsNextHave] = useState(true);

  useEffect(() => {
    fetchWords();
  }, []);

  const toggleDisplayLanguage = () => {
    if (isFlipped)
    {
      setIsFlipped(false);
      setDisplayEnglish((prevDisplay) => !prevDisplay);
    }
    if (!isFlipped)
    {
      setIsFlipped(true);
      setDisplayEnglish((prevDisplay) => !prevDisplay);
    }
  };

  const goNext = async () => {
    const isLearned = await isWordInLearnedArray(getNextWordID());
    const isFavorite = await isWordInFavoritesArray(getNextWordID());

    if (currentIndex < words.length - 1)
    {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setIsFlipped(false);
    }

    if (currentIndex === words.length - 2)
    {
      setIsNextHave(false);
    }
    if (currentIndex === 0)
    {
      setIsBackHave(true);
    }

    setIsLearned(isLearned);
    setIsFavorite(isFavorite);
  };

  const goBack = async () => {
    const isLearned = await isWordInLearnedArray(getPrevWordID());
    const isFavorite = await isWordInFavoritesArray(getPrevWordID());

    if (currentIndex > 0)
    {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setIsFlipped(false);
    }

    if (currentIndex === 1)
    {
      setIsBackHave(false);
    }
    if (currentIndex === words.length - 1)
    {
      setIsNextHave(true);
    }

    setIsLearned(isLearned);
    setIsFavorite(isFavorite);
  };

  const addToLearned = () => {
    if (isLearned)
    {
      removeWordFromLearned();
    }
    else
    {
      addWordToLearned();
    }
    setIsLearned((prevIsLearned) => !prevIsLearned);
  };

  const favoriteButton = () => {
    if (isFavorite)
    {
      removeWordFromFavorites();
    }
    else
    {
      addWordToFavorites();
    }
    setIsFavorite((prevIsFavorite) => !prevIsFavorite);
  };

  const addWordToLearned = async () => {
    try
    {
      const firestore = getFirestore();
      const currentUserEmail = getUserEmail(); // Oturum açan kullanıcının email bilgisini buraya ekleyin
      const userQuery = query(collection(firestore, 'Users'), where('email', '==', currentUserEmail));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty)
      {
        const userDoc = userSnapshot.docs[0];
        const userId = userDoc.id;

        const userDataUpdate = { learnedWords: arrayUnion(words[currentIndex].id) };

        await updateDoc(doc(firestore, 'Users', userId), userDataUpdate);

        console.log('Word marked as learned for the user');
      } else
      {
        console.log('User not found');
      }
    } catch (error)
    {
      console.error('Error updating user data:', error);
    }
  };

  const addWordToFavorites = async () => {
    try
    {
      const firestore = getFirestore();
      const currentUserEmail = getUserEmail(); // Oturum açan kullanıcının email bilgisini buraya ekleyin
      const userQuery = query(collection(firestore, 'Users'), where('email', '==', currentUserEmail));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty)
      {
        const userDoc = userSnapshot.docs[0];
        const userId = userDoc.id;
        const userDataUpdate = { favoritesWords: arrayUnion(words[currentIndex].id) };
        await updateDoc(doc(firestore, 'Users', userId), userDataUpdate);
        console.log('Word marked as favorited for the user');
      } else
      {
        console.log('User not found');
      }
    } catch (error)
    {
      console.error('Error updating user data:', error);
    }
  };

  const removeWordFromLearned = async () => {
    const firestore = getFirestore();
    const currentUserEmail = getUserEmail();
    const userQuery = query(collection(firestore, 'Users'), where('email', '==', currentUserEmail));
    const userQuerySnapshot = await getDocs(userQuery);
    const userData = userQuerySnapshot.docs[0].data();
    const learnedWordsIds = userData.learnedWords || [];
    const currentWordId = words[currentIndex].id;
    const newLearnedWordsIds = learnedWordsIds.filter((wordId) => wordId !== currentWordId);
    const userId = userQuerySnapshot.docs[0].id;
    const userDataUpdate = { learnedWords: newLearnedWordsIds };
    await updateDoc(doc(firestore, 'Users', userId), userDataUpdate);
    console.log('Word removed from learned for the user');
  };

  const removeWordFromFavorites = async () => {
    const firestore = getFirestore();
    const currentUserEmail = getUserEmail();
    const userQuery = query(collection(firestore, 'Users'), where('email', '==', currentUserEmail));
    const userQuerySnapshot = await getDocs(userQuery);
    const userData = userQuerySnapshot.docs[0].data();
    const favoritesWordsIds = userData.favoritesWords || [];
    const currentWordId = words[currentIndex].id;
    const newFavoritesWordsIds = favoritesWordsIds.filter((wordId) => wordId !== currentWordId);
    const userId = userQuerySnapshot.docs[0].id;
    const userDataUpdate = { favoritesWords: newFavoritesWordsIds };
    await updateDoc(doc(firestore, 'Users', userId), userDataUpdate);
    console.log('Word removed from favorites for the user');
  };

  const isWordInLearnedArray = async (WordID) => {
    const firestore = getFirestore();
    const currentUserEmail = getUserEmail();
    const userQuery = query(collection(firestore, 'Users'), where('email', '==', currentUserEmail));
    const userQuerySnapshot = await getDocs(userQuery);
    const userData = userQuerySnapshot.docs[0].data();
    const learnedWordsIds = userData.learnedWords || [];
    const currentWordId = WordID;
    const isWordinLearnedArray = learnedWordsIds.includes(currentWordId);

    return isWordinLearnedArray;
  };

  const isWordInFavoritesArray = async (WordID) => {
    const firestore = getFirestore();
    const currentUserEmail = getUserEmail();
    const userQuery = query(collection(firestore, 'Users'), where('email', '==', currentUserEmail));
    const userQuerySnapshot = await getDocs(userQuery);
    const userData = userQuerySnapshot.docs[0].data();
    const favoritesWordsIds = userData.favoritesWords || [];
    const currentWordId = WordID;
    const isWordinFavoritesArray = favoritesWordsIds.includes(currentWordId);

    return isWordinFavoritesArray;
  }

  const getUserEmail = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const currentUserEmail = currentUser.email;
    return currentUserEmail;
  }

  const getNextWordID = () => {
    const maxIndex = words.length - 1;
    if (currentIndex < maxIndex)
    {
      const nextWordId = words[currentIndex + 1].id;
      return nextWordId;
    } else
    {
      return null;
    }
  }

  const getPrevWordID = () => {
    if (currentIndex > 0)
    {
      const prevWordId = words[currentIndex - 1].id;
      return prevWordId;
    } else
    {
      return null;
    }
  }

  const fetchWords = async () => {
    try
    {
      const firestore = getFirestore();
      const wordsCollection = collection(firestore, 'Words');
      const wordsSnapshot = await getDocs(wordsCollection);
      const wordsData = wordsSnapshot.docs.map((doc) => doc.data());
      setWords(wordsData);
      setIsLoading(false);

      const firstWordId = wordsData.length > 0 ? wordsData[0].id : null;
      const isLearned = await isWordInLearnedArray(firstWordId);
      const isFavorite = await isWordInFavoritesArray(firstWordId);
      setIsLearned(isLearned);
      setIsFavorite(isFavorite);
    } catch (error)
    {
      console.error('Error fetching words:', error);
    }
  };

  if (isLoading)
  {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={favoriteButton} style={styles.iconContainer}>
          <MaterialIcons name={isFavorite ? 'favorite' : 'favorite-border'} size={34} color="#e74c3c" />
        </TouchableOpacity>

        <TouchableOpacity onPress={addToLearned} style={styles.iconContainer}>
          <MaterialIcons name="add-task" size={34} color={isLearned ? '#2ecc71' : '#34495e'} />
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
      >
        <View style={[styles.card, styles.cardFront]}>
          <TouchableOpacity onPress={toggleDisplayLanguage}>
            <Text style={styles.cardText}>{displayEnglish ? words[currentIndex]?.eng : words[currentIndex]?.tr}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, styles.cardBack]}>
          <TouchableOpacity onPress={toggleDisplayLanguage}>
            <Text style={styles.cardText}>{displayEnglish ? words[currentIndex]?.tr : words[currentIndex]?.eng}</Text>
          </TouchableOpacity>
        </View>
      </FlipCard>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={goBack} style={[styles.button, !isBackHave ? styles.disabledButton: null]} disabled={!isBackHave}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goNext} style={[styles.button, !isNextHave ? styles.disabledButton: null]} disabled={!isNextHave}>
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
    backgroundColor: '#ecf0f1',
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
  buttonText: {
    color: '#fff',
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
    backgroundColor: '#A0CD60',
    borderRadius: 8,
    width: '45%',
  },
  disabledButton: {
    backgroundColor: '#BDC3C7',
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
    borderColor: '#3498db',
    borderRadius: 10,
  },
  cardFront: {
    backgroundColor: '#1C646D',
  },
  cardBack: {
    backgroundColor: '#38184C',
  },
  cardText: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#CEF09D',
  },
});

export default PlayPage;