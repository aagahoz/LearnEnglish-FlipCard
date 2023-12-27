import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { getFirestore, collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';

const LearnedPage = () => {
  const [userData, setUserData] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [learnedWordsData, setLearnedWordsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [displayEnglish, setDisplayEnglish] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLearned, setIsLearned] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        fetchUserData(user.email);
      } else {
        setUserEmail(null);
        setUserData(null);
        setLearnedWordsData([]);
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

        const learnedWordsIds = userData.learnedWords || [];
        const wordsPromises = learnedWordsIds.map(async (wordId) => {
          const wordDocRef = doc(firestore, 'Words', wordId);
          const wordDocSnapshot = await getDoc(wordDocRef);

          if (wordDocSnapshot.exists()) {
            return wordDocSnapshot.data();
          } else {
            return null;
          }
        });

        const wordsData = await Promise.all(wordsPromises);

        setLearnedWordsData(wordsData.filter((word) => word !== null));
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  if (isLoading) {
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
    console.log('toggleDisplayLanguage');
  };

  const goNext = () => {
    if (currentIndex < learnedWordsData.length - 1) {
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

  const removeWord = () => {
    console.log('Kelime Çıkarıldı');
    setIsLearned((prevIsLearned) => !prevIsLearned);
  };

  const favoriteButton = () => {
    console.log('Favorilere Eklendi');
    setIsFavorite((prevIsFavorite) => !prevIsFavorite);
  };

  return (
    <View style={styles.container}>
      {learnedWordsData.length !== 0 ? (
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={favoriteButton} style={styles.iconContainer}>
            <MaterialIcons name={isFavorite ? 'favorite' : 'favorite-border'} size={34} color="red" />
          </TouchableOpacity>
          <TouchableOpacity onPress={removeWord} style={styles.iconContainer}>
            <MaterialIcons name="add-task" size={34} color={isLearned ? 'green' : 'black'} />
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.noWordsText}>You have not learned any words yet.</Text>
      )}

      {learnedWordsData.length !== 0 ? (
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
                {displayEnglish ? learnedWordsData[currentIndex]?.eng : learnedWordsData[currentIndex]?.tr}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Back Side */}
          <View style={[styles.card, styles.cardBack]}>
            <TouchableOpacity onPress={toggleDisplayLanguage}>
              <Text style={styles.cardText}>
                {displayEnglish ? learnedWordsData[currentIndex]?.tr : learnedWordsData[currentIndex]?.eng}
              </Text>
            </TouchableOpacity>
          </View>
        </FlipCard>
      ) : null}

      {learnedWordsData.length !== 0 ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={goBack} style={styles.button}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={goNext} style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      ) : null}
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

export default LearnedPage;
