// AddWordPage.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getFirestore, getDocs, collection, addDoc } from 'firebase/firestore';


const AddWordPage = ({ navigation, setWord }) => {
    const [eng, setEng] = useState('');
    const [tr, setTr] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [existingWords, setExistingWords] = useState([]);

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
            // Sayfa her odaklandığında bu blok çalışacak
            setEng(''); // İlk input'u temizle
            setTr(''); // İkinci input'u temizle
            setFeedbackMessage(''); // Feedback mesajını temizle
        });

        return () => {
            // Temizlik işlemleri
            focusListener();
        };
    }, [navigation]); // navigation bağımlılığı ekleyin

    const addWord = async () => {
        try {
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
                // Kelime eklenirse, existingWords'ü güncelle
                setExistingWords((prevWords) => [...prevWords, { eng, tr, isActive: true }]);
            }
        } catch (error) {
            console.error('Error adding word:', error);
            setFeedbackMessage('Error: Word could not be added');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add a New Word</Text>
            <TextInput
                style={styles.input}
                placeholder="English"
                value={eng}
                onChangeText={setEng}
            />
            <TextInput
                style={styles.input}
                placeholder="Turkish"
                value={tr}
                onChangeText={setTr}
            />
            <TouchableOpacity style={styles.addButton} onPress={addWord}>
                <Text style={styles.buttonText}>Add Word</Text>
            </TouchableOpacity>
            <Text style={{
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
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    feedbackMessageStyle: {
        marginTop: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        color: '#CC6633',
        fontWeight: 'bold',
        textAlign: 'center',
    }
});


export default AddWordPage;
