import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const WordsPage = () => {
  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const firestore = getFirestore();
      const wordsCollection = collection(firestore, 'Words');
      const wordsSnapshot = await getDocs(wordsCollection);
      const wordsData = wordsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setWords(wordsData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching words:', error);
      setIsLoading(false);
    }
  };

  const activateWord = async (wordId) => {
    try {
      const firestore = getFirestore();
      const wordRef = doc(firestore, 'Words', wordId);
      await updateDoc(wordRef, { isActive: true });
      updateLocalWords(wordId, { isActive: true });
    } catch (error) {
      console.error('Error activating word:', error);
    }
  };

  const disableWord = async (wordId) => {
    try {
      const firestore = getFirestore();
      const wordRef = doc(firestore, 'Words', wordId);
      await updateDoc(wordRef, { isActive: false });
      updateLocalWords(wordId, { isActive: false });
    } catch (error) {
      console.error('Error disabling word:', error);
    }
  };

  const updateLocalWords = (wordId, newData) => {
    setWords((prevWords) =>
      prevWords.map((word) => (word.id === wordId ? { ...word, ...newData } : word))
    );
  };

  const handleRefresh = () => {
    setIsLoading(true);
    fetchWords();
  };

  const renderItem = ({ item }) => (
    <View style={styles.wordItem}>
      <Text style={styles.wordId}>DataBase-ID: {item.id}</Text>
      <Text style={styles.wordText}>Eng: {item.eng}</Text>
      <Text style={styles.wordText}>Tr: {item.tr}</Text>
      <Text style={[styles.wordText, styles.wordIsActive, item.isActive ? styles.activeText : styles.inactiveText]}>
        Active: {item.isActive ? 'Yes' : 'No'}
      </Text>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.greenButton]} onPress={() => activateWord(item.id)}>
          <Text>Activate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.redButton]} onPress={() => disableWord(item.id)}>
          <Text>Disable</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Words List</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Text>Refresh</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={words}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.wordsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#ecf0f1',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
  },
  refreshButton: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 8,
  },
  wordsList: {
    width: '100%',
  },
  wordItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#bdc3c7',
  },
  wordText: {
    fontSize: 16,
    marginBottom: 5,
  },
  wordId: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  wordIsActive: {
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  activeText: {
    color: '#2ecc71',
  },
  inactiveText: {
    color: '#e74c3c',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginRight: 10,
    padding: 6,
    borderRadius: 5,
    alignItems: 'center',
  },
  greenButton: {
    backgroundColor: '#2ecc71',
  },
  redButton: {
    backgroundColor: '#e74c3c',
  },
});

export default WordsPage;
