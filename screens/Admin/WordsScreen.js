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
      const WordsCollection = collection(firestore, 'Words');
      const wordsSnapshot = await getDocs(WordsCollection);
      const wordsData = wordsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setWords(wordsData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching words:', error);
      setIsLoading(false);
    }
  };

  const activateWord = async (wordsId) => {
    try {
      const firestore = getFirestore();
      const wordsRef = doc(firestore, 'Words', wordsId);
      await updateDoc(wordsRef, { isActive: true });
      updateLocalwords(wordsId, { isActive: true });
    } catch (error) {
      console.error('Error activating word:', error);
    }
  };

  const disableWord = async (wordsId) => {
    try {
      const firestore = getFirestore();
      const wordsRef = doc(firestore, 'Words', wordsId);
      await updateDoc(wordsRef, { isActive: false });
      updateLocalwords(wordsId, { isActive: false });
    } catch (error) {
      console.error('Error disabling word:', error);
    }
  };

  const updateLocalwords = (wordsId, newData) => {
    setWords((prevwordss) =>
      prevwordss.map((words) => (words.id === wordsId ? { ...words, ...newData } : words))
    );
  };

  const handleRefresh = () => {
    setIsLoading(true);
    fetchWords();
  };

  const renderItem = ({ item }) => (
    <View style={styles.wordItem}>
      <Text style={[styles.wordText, styles.wordId]}>DataBase-ID: {item.id}</Text>
      <Text style={[styles.wordText, styles.wordEng]}>Eng: {item.eng}</Text>
      <Text style={[styles.wordText, styles.wordTr]}>Tr: {item.tr}</Text>
      <Text style={[styles.wordText, styles.wordIsActive]}>Active: {item.isActive ? 'Yes' : 'No'}</Text>

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
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Words List</Text>
      </View>
      <View style={styles.header}>
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
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  wordsList: {
    width: '100%',
  },
  wordItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'column',
    alignItems: 'center',
  },
  wordText: {
    fontSize: 16,
  },
  wordId: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  wordEngTrContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  wordEng: {
    color: '#007BFF',
    marginRight: 10,
  },
  wordTr: {
    color: '#00CC33',
    flex: 1,
  },
  wordIsActive: {
    color: '#CC0099',
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginRight: 10,
    padding: 6,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  greenButton: {
    backgroundColor: '#00CC33',
  },
  redButton: {
    backgroundColor: '#CC6633',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 5,
  },
  refreshButton: {
    marginTop: 0,
    padding: 10,
    backgroundColor: '#33CCCC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
});

export default WordsPage;
