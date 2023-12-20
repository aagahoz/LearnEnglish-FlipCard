import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const wordsPage = () => {
  const [words, setWords] = useState([]);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const firestore = getFirestore();
        const WordsCollection = collection(firestore, 'Words');
        const wordsSnapshot = await getDocs(WordsCollection);
        const wordsData = wordsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setWords(wordsData);
      } catch (error) {
        console.error('Error fetching words:', error);
      }
    };

    fetchWords();
  }, []);

  const  activateWord = async (wordsId) => {
    try {
      const firestore = getFirestore();
      const wordsRef = doc(firestore, 'Words', wordsId);
    //   await deleteDoc(wordsRef);
      await updateDoc(wordsRef, { isActive: true });
      updateLocalwords(wordsId, { isActive: true });

    } catch (error) {
      console.error('Error deleting word:', error);
    }
  };

  const  disableWord = async (wordsId) => {
    try {
      const firestore = getFirestore();
      const wordsRef = doc(firestore, 'Words', wordsId);
    //   await deleteDoc(wordsRef);
      await updateDoc(wordsRef, { isActive: false });
      updateLocalwords(wordsId, { isActive: false });

    } catch (error) {
      console.error('Error deleting word:', error);
    }
  };

  const updateLocalwords = (wordsId, newData) => {
    setWords((prevwordss) =>
      prevwordss.map((words) => (words.id === wordsId ? { ...words, ...newData } : words))
    );
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Words List</Text>
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
    flexDirection: 'column', // Dikey sıralama
    alignItems: 'center', // Ortalamak için
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
    width: '100%', // Genişliği yüzde 100 yap
    marginBottom: 5,
  },
  wordEng: {
    color: '#007BFF', // Blue color for English text
    marginRight: 10,
  },
  wordTr: {
    color: '#00CC33', // Green color for Turkish text
    flex: 1, // Eng kısmını genişletir
  },
  wordIsActive: {
    color: '#CC0099', // 
    flex: 1, // 
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end', // Sağa yaslamak için
  },
  actionButton: {
    marginRight: 10,
    padding: 6,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  greenButton: {
    backgroundColor: '#00CC33', // Green color for the specific button
  },
  redButton: {
    backgroundColor: '#CC6633', // Red color for the specific button
  },
});

export default wordsPage;