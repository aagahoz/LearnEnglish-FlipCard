import {
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../firebaseConfig";
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default function SignUpPage ({ navigation, setIsSignedIn }) {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');
  let [errorMessage, setErrorMessage] = useState("");

  let signUp = async () => {
    if (email !== "" && password !== "" && confirmPassword !== "")
    {

      if (await checkEmailExists(email))
      {
        console.log("Email Already Exist")
      }
      else
      {
        if (password === confirmPassword)
        {
          createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              console.log(userCredential.user);
              setIsSignedIn(true);
              setErrorMessage("");
              setEmail("");
              setPassword("");
              setConfirmPassword('');
              const auth = getAuth(); // Firebase Authentication nesnesini al
              const user = auth.currentUser; // Oturum açan kullanıcının bilgilerini al
              addUser(user.uid, email, isAdmin = false, isActive = true);
            })
            .catch((error) => {
              setErrorMessage(error.message);
            });

        } else
        {
          setErrorMessage("Passwords do not match");
        }
      }
    } else
    {
      setErrorMessage("Please enter an email, password, and confirm password");
    }
  };


  const checkEmailExists = async (email) => {
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
          // Eğer email adresi bulunduysa, true döndür
          return true;
        }
      }

      // Eğer email adresi bulunamadıysa, false döndür
      return false;
    } catch (error)
    {
      console.error('Error checking email existence:', error);
      return false;
    }
  };


  const addUser = async (userId, email, isAdmin = false, isActive = true) => {
    try
    {
      const firestore = getFirestore();
      const userRef = doc(firestore, 'Users', userId);

      // Yeni kullanıcı verileri
      const newUser = {
        email,
        isAdmin,
        isActive,
      };

      // Belirli bir ID ile "Users" koleksiyonuna kullanıcı ekle
      await setDoc(userRef, newUser);

      // Eğer başarıyla eklendiyse, kullanıcının ID'sini döndür
      return userId;
    } catch (error)
    {
      console.error('Error adding user:', error);
      return null; // Hata durumunda null döndürebilir veya hata yönetimini kendi ihtiyaçlarınıza göre ayarlayabilirsiniz.
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={60}
      style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#BEBEBE"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#BEBEBE"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#BEBEBE"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Sign In')}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signUpButton} onPress={signUp}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text>{errorMessage}</Text>
    </KeyboardAvoidingView>

  );
}


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
  errorMessage: {
    color: 'red',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    borderRadius: 5,
  },
  linkText: {
    color: '#007BFF',
    marginBottom: 20,
  },
  signUpButton: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 5,
  },
  signUpButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});