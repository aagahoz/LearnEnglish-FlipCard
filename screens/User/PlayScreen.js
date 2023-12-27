import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';

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
      setIsLoading(false); // Veriler yüklendiğinde yüklenme durumunu kapat
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  if (isLoading) {
    // Yükleniyor durumundayken gösterilecek ekran
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
    console.log('Kelime Eklendi');
    setIsLearned((prevIsLearned) => !prevIsLearned);
  };

  const favoriteButton = () => {
    console.log('changeFavorite');
    setIsFavorite((prevIsFavorite) => !prevIsFavorite);
  };

  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 20 }}>
        <TouchableOpacity onPress={favoriteButton}>
          <MaterialIcons name={isFavorite ? "favorite" : "favorite-border"} size={34} color="red" />
        </TouchableOpacity>

        <TouchableOpacity onPress={addToLearned}>
          <MaterialIcons name={"add-task"} size={34} color={isLearned ? "green" : "black"} />
        </TouchableOpacity>
      </Text>

      <FlipCard
        style={styles.cardContainer}
        friction={2.4}
        perspective={1000}
        flipHorizontal={true}
        flipVertical={false}
        flip={isFlipped}
        clickable={true}
        onFlipEnd={(isFlipEnd) => { console.log('isFlipEnd', isFlipEnd); }}
      >
        {/* Front Side */}
        <View style={[styles.card, styles.cardFront]}>
          <TouchableOpacity onPress={toggleDisplayLanguage}>
            <Text style={styles.cardText}>{displayEnglish ? words[currentIndex]?.eng : words[currentIndex]?.tr}</Text>
          </TouchableOpacity>
        </View>

        {/* Back Side */}
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
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  learnedButton: {
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
    backgroundColor: '#00CC33',
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

export default PlayPage;

