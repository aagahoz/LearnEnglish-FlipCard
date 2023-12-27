import {
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../firebaseConfig";
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';

export default function SignUpPage({ navigation, setIsSignedIn }) {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');
  let [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  let signUp = async () => {
    try {
      setLoading(true); // Set loading to true when sign-up begins

      if (email !== "" && password !== "" && confirmPassword !== "") {
        if (await checkEmailExists(email)) {
          console.log("Email Already Exist");
        } else {
          if (password === confirmPassword) {
            createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                console.log(userCredential.user);
                setIsSignedIn(true);
                setErrorMessage("");
                setEmail("");
                setPassword("");
                setConfirmPassword('');
                const auth = getAuth();
                const user = auth.currentUser;
                addUser(user.uid, email, isAdmin = false, isActive = true);
              })
              .catch((error) => {
                setErrorMessage(error.message);
              });

          } else {
            setErrorMessage("Passwords do not match");
          }
        }
      } else {
        setErrorMessage("Please enter an email, password, and confirm password");
      }
    } finally {
      setLoading(false); // Set loading to false when sign-up is complete (success or failure)
    }
  };

  const checkEmailExists = async (email) => {
    try {
      const firestore = getFirestore();
      const usersCollection = collection(firestore, 'Users');
      const querySnapshot = await getDocs(usersCollection);

      for (const doc of querySnapshot.docs) {
        const userData = doc.data();
        if (userData.email === email) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking email existence:', error);
      return false;
    }
  };

  const addUser = async (userId, email, isAdmin = false, isActive = true) => {
    try {
      const firestore = getFirestore();
      const userRef = doc(firestore, 'Users', userId);

      const newUser = {
        email,
        isAdmin,
        isActive,
      };

      await setDoc(userRef, newUser);

      return userId;
    } catch (error) {
      console.error('Error adding user:', error);
      return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={60}
      style={styles.container}
    >
      <AntDesign name="adduser" size={44} color="black" />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#BEBEBE"
        value={email}
        onChangeText={setEmail}
        marginTop={20}
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
      <TouchableOpacity style={styles.signUpButton} onPress={signUp} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.errorMessage}>{errorMessage}</Text>
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
  errorMessage: {
    color: 'tomato',
    marginTop: 15,
    fontSize: 14,
  },
});