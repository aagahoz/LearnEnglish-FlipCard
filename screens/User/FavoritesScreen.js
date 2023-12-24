import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { getFirestore, collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';

const FavoritePage = () => {
  const [userData, setUserData] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [favoritesWordsData, setfavoritesWordsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [displayEnglish, setDisplayEnglish] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLearned, setIsLearned] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user)
      {
        setUserEmail(user.email);
        fetchUserData(user.email);
      } else
      {
        setUserEmail(null);
        setUserData(null);
        setfavoritesWordsData([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (email) => {
    try
    {
      const firestore = getFirestore();

      const userQuery = query(collection(firestore, 'Users'), where('email', '==', email));
      const userQuerySnapshot = await getDocs(userQuery);

      if (userQuerySnapshot.size > 0)
      {
        const userData = userQuerySnapshot.docs[0].data();
        setUserData(userData);

        const favoritesWordsIds = userData.favoritesWords || [];
        const wordsPromises = favoritesWordsIds.map(async (wordId) => {
          const wordDocRef = doc(firestore, 'Words', wordId);
          const wordDocSnapshot = await getDoc(wordDocRef);

          if (wordDocSnapshot.exists())
          {
            return wordDocSnapshot.data();
          } else
          {
            return null;
          }
        });

        const wordsData = await Promise.all(wordsPromises);

        setfavoritesWordsData(wordsData.filter((word) => word !== null));
      }
    } catch (error)
    {
      console.error('Error fetching user data:', error);
    }
  };



  const toggleDisplayLanguage = () => {
    setIsFlipped(true);
    setDisplayEnglish((prevDisplay) => !prevDisplay);
    console.log('toggleDisplayLanguage');
  };

  const goNext = () => {
    if (currentIndex < favoritesWordsData.length - 1)
    {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setIsFlipped(false);
    }
  };

  const goBack = () => {
    if (currentIndex > 0)
    {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setIsFlipped(false);
    }
  };

  const removeWord = () => {
    console.log('Kelime Çıkarıldı');
    if (isLearned)
    {
      setIsLearned(false);
    }
    else
    {
      setIsLearned(true);
    }
  };

  const favoriteButton = () => {
    console.log('Favorilere Eklendi');
    if (isFavorite)
    {
      setIsFavorite(false);
    }
    else
    {
      setIsFavorite(true);
    }
  }


  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 20 }}>
        <TouchableOpacity onPress={favoriteButton}>
          <MaterialIcons name={isFavorite ? "favorite" : "favorite-border"} size={34} color="red" />
        </TouchableOpacity>

        <TouchableOpacity onPress={removeWord}>
          <MaterialIcons name={"add-task"} size={34} color={isLearned ? "green" : "black"} />
        </TouchableOpacity>
      </Text>

      <FlipCard
        style={styles.cardContainer}
        friction={2.4}
        perspective={1000}
        flipHorizontal={true}
        flipVertical={false}
        flip={isFlipped}        // ! goBack ve goNext fonksiyonlarında kartı face (default) konumuna getirme sorunu var.
        clickable={true}
        onFlipEnd={(isFlipEnd) => { console.log('isFlipEnd', isFlipEnd); }}
      >
        {/* Front Side */}
        <View style={[styles.card, styles.cardFront]}>
          <TouchableOpacity onPress={toggleDisplayLanguage}>
            <Text style={styles.cardText}>{displayEnglish ? favoritesWordsData[currentIndex]?.eng : favoritesWordsData[currentIndex]?.tr}</Text>
          </TouchableOpacity>
        </View>

        {/* Back Side */}
        <View style={[styles.card, styles.cardBack]}>
          <TouchableOpacity onPress={toggleDisplayLanguage}>
            <Text style={styles.cardText}>{displayEnglish ? favoritesWordsData[currentIndex]?.tr : favoritesWordsData[currentIndex]?.eng}</Text>
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
  removeButton: {
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
    backgroundColor: 'red',
    marginBottom: 70,
    marginTop: 20,
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
  },
  button: {
    padding: 20,
    backgroundColor: '#999999',
    borderRadius: 5,
    width: '35%',
    marginLeft: 30,
    marginRight: 20,

  },
  cardContainer: {
    width: 200,
    height: 300,
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
    color: 'black', // veya '#000'
  },
});

export default FavoritePage;