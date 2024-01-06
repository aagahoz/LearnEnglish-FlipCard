import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { getFirestore, collection, getDocs, getDoc, doc, updateDoc, arrayUnion, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';

/*
TODO Sayfa ilk açıldığında ilk kelimenin favorited-learned kontrolü eksik.
TODO Sayfa ilk açıldığında back butonu kapatılmıyor.
*/

const FavoritePage = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [favoritesWordsData, setFavoritesWordsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [displayEnglish, setDisplayEnglish] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLearned, setIsLearned] = useState(false);
  const [words, setWords] = useState(null);
  const [isBackHave, setIsBackHave] = useState(true);
  const [isNextHave, setIsNextHave] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user)
      {
        setUserEmail(user.email);
        fetchUserFavoriteWords(user.email);
      } else
      {
        setUserEmail(null);
        setWords(null);
        setFavoritesWordsData([]);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserFavoriteWords = async (email) => {
    try
    {

      const firestore = getFirestore();
      const userQuery = query(collection(firestore, 'Users'), where('email', '==', email));
      const userQuerySnapshot = await getDocs(userQuery);
      const userData = userQuerySnapshot.docs[0].data();
      const favoritesWordsIds = userData.favoritesWords || [];
      const favoritesWordsData = [];

      for (let i = 0; i < favoritesWordsIds.length; i++)
      {
        const wordId = favoritesWordsIds[i];
        const wordDoc = await getDoc(doc(firestore, 'Words', wordId));
        const wordData = wordDoc.data();
        favoritesWordsData.push(wordData);
      }

      setWords(favoritesWordsData);
      setFavoritesWordsData(favoritesWordsData);
      setIsLoading(false);
    } catch (error)
    {
      console.log(error);
    }
  };

  if (isLoading)
  {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading...</Text>
      </View>
    );
  }

  const toggleDisplayLanguage = () => {
    setIsFlipped(true);
    setDisplayEnglish((prevDisplay) => !prevDisplay);
  };

  const goNext = async () => {

    const isLearned = await isWordInLearnedArray(getNextWordID());
    const isFavorite = await isWordInFavoritesArray(getNextWordID());


    if (currentIndex < words.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setIsFlipped(false);
    }

    if (currentIndex === words.length - 2) {
      setIsNextHave(false);
    }
    if (currentIndex === 0) {
      setIsBackHave(true);
    }

    setIsLearned(isLearned);
    setIsFavorite(isFavorite);
  };
  

  const goBack = async () => {
    const isLearned = await isWordInLearnedArray(getPrevWordID());
    const isFavorite = await isWordInFavoritesArray(getPrevWordID());

    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setIsFlipped(false);
    }
    
    if (currentIndex === 1) {
      setIsBackHave(false);
    }
    if (currentIndex === words.length - 1) {
      setIsNextHave(true);
    }

    setIsLearned(isLearned);
    setIsFavorite(isFavorite);
  };

  const isWordInLearnedArray = async (WordID) => {
    // get user learnedWords array
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
    // get user learnedWords array
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

  const getNextWordID = () => {
    const maxIndex = words.length - 1;
    console.log("max index : ", maxIndex);
    console.log("current index : ", currentIndex);
    console.log("word length : ", words.length)


    if (currentIndex < maxIndex) {
      const nextWordId = words[currentIndex + 1].id;
      return nextWordId;
    } else {
      return null;
    }
  }

  const getPrevWordID = () => {
    if (currentIndex > 0) {
      const prevWordId = words[currentIndex - 1].id;
      return prevWordId;
    } else {
      return null;
    }
  }

  const addToLearned = () => {
    if (isLearned) {
      removeWordFromLearned();
    }
    else {
      addWordToLearned();
    }
    setIsLearned((prevIsLearned) => !prevIsLearned);
  };


  const addWordToLearned = async () => {
    try {
      const firestore = getFirestore();
      const currentUserEmail = getUserEmail(); // Oturum açan kullanıcının email bilgisini buraya ekleyin
      const userQuery = query(collection(firestore, 'Users'), where('email', '==', currentUserEmail));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        console.log('userDoc', userDoc);
        const userId = userDoc.id;

        const userDataUpdate = { learnedWords: arrayUnion(words[currentIndex].id) };

        await updateDoc(doc(firestore, 'Users', userId), userDataUpdate);

        console.log('Word marked as learned for the user');
      } else {
        console.log('User not found');
      }
    } catch (error) {
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

  





  const favoriteButton = () => {
    if (isFavorite) {
      removeWordFromFavorites();
    }
    else {
      addWordToFavorites();
    }
    setIsFavorite((prevIsFavorite) => !prevIsFavorite);
};

const addWordToFavorites = async () => {
  try {
    const firestore = getFirestore();
    const currentUserEmail = getUserEmail(); // Oturum açan kullanıcının email bilgisini buraya ekleyin
    const userQuery = query(collection(firestore, 'Users'), where('email', '==', currentUserEmail));
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0];
      const userId = userDoc.id;

      const userDataUpdate = { favoritesWords: arrayUnion(words[currentIndex].id) };

      await updateDoc(doc(firestore, 'Users', userId), userDataUpdate);

      console.log('Word marked as favorited for the user');
    } else {
      console.log('User not found');
    }
  } catch (error) {
    console.error('Error updating user data:', error);
  }
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




const getUserEmail = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const currentUserEmail = currentUser.email;
  return currentUserEmail;
}

  const removeWord = () => {
    console.log('Kelime Çıkarıldı');
    setIsLearned((prevIsLearned) => !prevIsLearned);
  };




  return (
    <View style={styles.container}>
      {words.length !== 0 ? (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={favoriteButton} style={styles.iconContainer}>
          <MaterialIcons name={isFavorite ? 'favorite' : 'favorite-border'} size={34} color="#e74c3c" />
        </TouchableOpacity>

        <TouchableOpacity onPress={addToLearned} style={styles.iconContainer}>
          <MaterialIcons name="add-task" size={34} color={isLearned ? '#2ecc71' : '#34495e'} />
        </TouchableOpacity>
      </View>
      ) : (
        <Text style={styles.noWordsText}>You have no words in your favorites yet.</Text>
      )}

      { words.length !== 0 ? (
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
        <View style={[styles.card, styles.cardFront]}>
          <TouchableOpacity onPress={toggleDisplayLanguage}>
            <Text style={styles.cardText}>{displayEnglish ? favoritesWordsData[currentIndex]?.eng : favoritesWordsData[currentIndex]?.tr}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, styles.cardBack]}>
          <TouchableOpacity onPress={toggleDisplayLanguage}>
            <Text style={styles.cardText}>{displayEnglish ? favoritesWordsData[currentIndex]?.tr : favoritesWordsData[currentIndex]?.eng}</Text>
          </TouchableOpacity>
        </View>
      </FlipCard>
      ) : null }

      { words.length !== 0 ? (
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={goBack} style={styles.button} disabled={!isBackHave}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goNext} style={styles.button} disabled={!isNextHave}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
      ) : null }
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
    backgroundColor: '#A0CD60',
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


export default FavoritePage;


// setWords(userData);
//         console.log('userData', userData);