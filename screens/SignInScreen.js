import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { getFirestore, collection, getDocs, getDoc, doc } from 'firebase/firestore';

export default function SignInPage ({ navigation, setIsSignedIn, setIsAdmin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const login = async () => {
    if (email !== '' && password !== '')
    {
      try
      {
        // ! user tablosunda aktif pasif kontrolü
        const isActive = await checkUserIsActive(email);
        if (isActive == false)
        {
          setErrorMessage('Disabled User');
        }
        else
        {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        const firestore = getFirestore();
        const userDocRef = doc(firestore, 'Users', userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists())
        {
          const userData = userDocSnapshot.data();
          if (userData && 'isAdmin' in userData)
          {
            console.log('isAdmin:', userData.isAdmin);
            setIsSignedIn(true);
            setIsAdmin(userData.isAdmin === true);
          } else
          {
            console.log('User document does not have isAdmin field');
            setIsSignedIn(true);
            setIsAdmin(false);
          }
        } else
        {
          console.log('User document not found');
        }
      }

      } catch (error)
      {
        setErrorMessage(error.message);
      }
    } else
    {
      setErrorMessage('Please enter an email and password');
    }
  };

  const checkUserIsActive = async (email) => {
    try
    {
      const firestore = getFirestore();
      const usersCollection = collection(firestore, 'Users');
      const querySnapshot = await getDocs(usersCollection);

      // Kullanıcıların içinde gezin
      for (const doc of querySnapshot.docs)
      {
        const userData = doc.data();
        if (userData.email === email)
        {
          return userData.isActive;
        }
      }

      return false;
    } catch (error)
    {
      console.error('Error checking user isActive:', error);
      return false;
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
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
      <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
        <Text style={styles.linkText}>Reset Password</Text>
      </TouchableOpacity>
      <Button title="Login" onPress={login} />

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
    fontSize: 26,
  },
  errorMessage: {
    color: 'tomato',
    marginTop: 15,
    fontSize: 14,
  },
  linkText: {
    color: '#007BFF',
    marginBottom: 20,
  },
});
