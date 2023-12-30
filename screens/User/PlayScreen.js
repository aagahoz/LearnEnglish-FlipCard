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

  useEffect(() => {
    fetchWords();
  }, []);


  const fetchWords = async () => {
    try {
      const firestore = getFirestore();
      const wordsCollection = collection(firestore, 'Words');
      const wordsSnapshot = await getDocs(wordsCollection);
      const wordsData = wordsSnapshot.docs.map((doc) => doc.data());
      setWords(wordsData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text>Loading...</Text>
      </View>
    );
  }

  const toggleDisplayLanguage = () => {
    setIsFlipped(true);
    setDisplayEnglish((prevDisplay) => !prevDisplay);
  };

  const goNext = () => {
    if (currentIndex < words.length - 1) {
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

  const addToLearned = () => {
    setIsLearned((prevIsLearned) => !prevIsLearned);
    addWordToLearned();
  };

  const favoriteButton = () => {
    addWordToFavorites();
    // setIsFavorite((prevIsFavorite) => !prevIsFavorite);
    setIsFavorite(true);
  };

  const addWordToLearned = async () => {
    try {
      const firestore = getFirestore();

      // Oturum açan kullanıcının email bilgisini al
      const currentUserEmail = getUserEmail(); // Oturum açan kullanıcının email bilgisini buraya ekleyin

      // Kullanıcıyı bulmak için sorgu oluştur
      const userQuery = query(collection(firestore, 'Users'), where('email', '==', currentUserEmail));
      const userSnapshot = await getDocs(userQuery);

      // Kullanıcı belgesini al
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const userId = userDoc.id;

        // Öğrenilen kelimeler array'ine kelimenin ID'sini ekle
        const userDataUpdate = { learnedWords: arrayUnion(words[currentIndex].id) };

        // Kullanıcı belgesini güncelle
        await updateDoc(doc(firestore, 'Users', userId), userDataUpdate);

        console.log('Word marked as learned for the user');
      } else {
        console.log('User not found');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const addWordToFavorites = async () => {
    try {
      const firestore = getFirestore();

      // Oturum açan kullanıcının email bilgisini al
      const currentUserEmail = getUserEmail(); // Oturum açan kullanıcının email bilgisini buraya ekleyin

      // Kullanıcıyı bulmak için sorgu oluştur
      const userQuery = query(collection(firestore, 'Users'), where('email', '==', currentUserEmail));
      const userSnapshot = await getDocs(userQuery);

      // Kullanıcı belgesini al
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const userId = userDoc.id;

        // Öğrenilen kelimeler array'ine kelimenin ID'sini ekle
        const userDataUpdate = { favoritesWords: arrayUnion(words[currentIndex].id) };

        // Kullanıcı belgesini güncelle
        await updateDoc(doc(firestore, 'Users', userId), userDataUpdate);

        console.log('Word marked as favorited for the user');
      } else {
        console.log('User not found');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };
 

  const getUserEmail = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const currentUserEmail = currentUser.email;
    return currentUserEmail;
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
        onFlipEnd={(isFlipEnd) => {
          console.log('isFlipEnd', isFlipEnd);
        }}
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