import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { getFirestore, collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// ! Unlearned Wordleri id ile çekip cardta gösterme eksik

const unLearnedPage = () => {
  const [userData, setUserData] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [learnedWordsData, setLearnedWordsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [displayEnglish, setDisplayEnglish] = useState(true);
  const [unLearnedWordIds, setUnLearnedWordIds] = useState([]);


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
        setUnLearnedWordIds([]);
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

        // Tüm belgelerin çekilmesini bekleyin
        const wordsData = await Promise.all(wordsPromises);

        // Boş olmayan belgeleri learnedWordsData state'ine ekleyin
        setLearnedWordsData(wordsData.filter((word) => word !== null));

        // İD'leri bulun ve yazdırın
        const allWordsQuery = query(collection(firestore, 'Words'));
        const allWordsSnapshot = await getDocs(allWordsQuery);
        const allWordIds = allWordsSnapshot.docs.map((doc) => doc.id);

        setUnLearnedWordIds(allWordIds.filter((wordId) => !learnedWordsIds.includes(wordId)));
        console.log('Unlearned Word IDs:', unLearnedWordIds[0]?.tr);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const removeWord = () => {
    console.log('Remove Word');
  }

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  const goNext = () => {
    if (currentIndex < unLearnedWordIds.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  const toggleDisplayLanguage = () => {
    setIsFlipped(true);
    setDisplayEnglish((prevDisplay) => !prevDisplay);
    console.log('toggleDisplayLanguage');
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={removeWord} style={styles.removeButton}>
        <Text style={styles.buttonText}>Remove</Text>
      </TouchableOpacity>

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
            <Text style={styles.cardText}>{displayEnglish ? unLearnedWordIds[currentIndex]?.eng : unLearnedWordIds[currentIndex]?.tr}</Text>
          </TouchableOpacity>
        </View>

        {/* Back Side */}
        <View style={[styles.card, styles.cardBack]}>
          <TouchableOpacity onPress={toggleDisplayLanguage}>
            <Text style={styles.cardText}>{displayEnglish ? unLearnedWordIds[currentIndex]?.tr : unLearnedWordIds[currentIndex]?.eng}</Text>
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

export default unLearnedPage;