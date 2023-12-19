import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Firebase projenizin Firebase Authentication bağlantısını içeren bir dosya
import { getFirestore, collection, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function SignUp({ navigation, setIsSignedIn, setIsAdmin }) {
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
        // Firebase Authentication ile oturum açma
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        // Firestore'da kullanıcının varlığını kontrol etme
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
            setIsAdmin(userData.isAdmin === true); // Eğer isAdmin true ise, setIsAdmin değerini true yap
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

        // İşlemler başarılıysa, başka bir ekrana yönlendirme vb. yapabilirsiniz.
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
          // Eğer email adresi bulunduysa, isActive değerini kontrol et
          return userData.isActive;
        }
      }

      // Eğer email adresi bulunamadıysa veya isActive değeri yoksa, varsayılan olarak false döndür
      return false;
    } catch (error)
    {
      console.error('Error checking user isActive:', error);
      return false;
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
