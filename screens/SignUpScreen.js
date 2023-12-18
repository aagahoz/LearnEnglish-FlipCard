import {
  View,
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

export default function SignUp({ navigation, setIsSignedIn }) {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');
  let [errorMessage, setErrorMessage] = useState("");

  let signUp = () => {
    if (email !== "" && password !== "" && confirmPassword !== "") {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            console.log(userCredential.user);
            // navigation.navigate("Home", { user: userCredential.user });
            setIsSignedIn(true);
            setErrorMessage("");
            setEmail("");
            setPassword("");
            setConfirmPassword('');
          })
          .catch((error) => {
            setErrorMessage(error.message);
          });
      } else {
        setErrorMessage("Passwords do not match");
      }
    } else {
      setErrorMessage("Please enter an email, password, and confirm password");
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
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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