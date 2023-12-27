import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getFirestore, getDocs, collection, addDoc } from 'firebase/firestore';

const AddWordPage = ({ navigation, setWord }) => {
  const [eng, setEng] = useState('');
  const [tr, setTr] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [existingWords, setExistingWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const firestore = getFirestore();
        const WordsCollection = collection(firestore, 'Words');
        const wordsSnapshot = await getDocs(WordsCollection);
        const wordsData = wordsSnapshot.docs.map((doc) => doc.data());
        setExistingWords(wordsData);
      } catch (error) {
        console.error('Error fetching existing words:', error);
      }
    };

    const focusListener = navigation.addListener('focus', () => {
      setEng('');
      setTr('');
      setFeedbackMessage('');
    });

    return () => {
      focusListener();
    };
  }, [navigation]);

  const addWord = async () => {
    try {
      setIsLoading(true);

      const isEngExists = existingWords.some((word) => word.eng === eng);
      const isTrExists = existingWords.some((word) => word.tr === tr);

      if (isEngExists || isTrExists) {
        setFeedbackMessage('Error: Word already exists in the table');
      } else {
        const firestore = getFirestore();
        const WordsCollection = collection(firestore, 'Words');
        const newWordRef = await addDoc(WordsCollection, { eng, tr, isActive: true });

        setFeedbackMessage('New Word Added: ' + eng + ' - ' + tr);
        setTr('');
        setEng('');

        setExistingWords((prevWords) => [...prevWords, { eng, tr, isActive: true }]);
      }
    } catch (error) {
      console.error('Error adding word:', error);
      setFeedbackMessage('Error: Word could not be added');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Word</Text>
      <TextInput style={styles.input} placeholder="English" value={eng} onChangeText={setEng} />
      <TextInput style={styles.input} placeholder="Turkish" value={tr} onChangeText={setTr} />
      <TouchableOpacity style={styles.addButton} onPress={addWord} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Add Word</Text>
        )}
      </TouchableOpacity>
      <Text
        style={{
          color: feedbackMessage.startsWith('Error') ? 'red' : 'green',
          marginTop: 10,
          fontWeight: 'bold',
        }}>
        {feedbackMessage}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default AddWordPage;
