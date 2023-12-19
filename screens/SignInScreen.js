import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebaseConfig'; // Firebase projenizin Firebase Authentication bağlantısını içeren bir dosya

export default function SignUp({ navigation, setIsSignedIn, setIsAdmin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const login = async () => {
    if (email !== '' && password !== '') {
      try {
        // Firebase Authentication ile oturum açma
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        // Firestore'da kullanıcının varlığını kontrol etme
        const firestore = getFirestore();
        const userDocRef = doc(firestore, 'Users', userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (userData && 'isAdmin' in userData) {
            console.log('isAdmin:', userData.isAdmin);
            setIsSignedIn(true);
            setIsAdmin(userData.isAdmin === true); // Eğer isAdmin true ise, setIsAdmin değerini true yap
          } else {
            console.log('User document does not have isAdmin field');
            setIsSignedIn(true);
            setIsAdmin(false);
          }
        } else {
          console.log('User document not found');
        }

        // İşlemler başarılıysa, başka bir ekrana yönlendirme vb. yapabilirsiniz.
      } catch (error) {
        setErrorMessage(error.message);
      }
    } else {
      setErrorMessage('Please enter an email and password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={login} />
      <Text style={styles.title}>Login Screen</Text>

      <Text style={styles.errorMessage}>{errorMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: '#ccc',
    margin: 20,
    padding: 15,
    width: '90%',
    borderRadius: 8,
    fontSize: 16,
  },
  errorMessage: {
    color: 'tomato',
    marginTop: 15,
    fontSize: 14,
  },
});
