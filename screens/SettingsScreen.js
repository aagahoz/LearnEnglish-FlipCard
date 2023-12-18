import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { signOut, updatePassword } from 'firebase/auth'; // Bu kısmı firebase sürümünüze göre ayarlayın
import { auth } from "../firebaseConfig";

export default function SettingsScreen({ setIsSignedIn }) {
  const [newPassword, setNewPassword] = useState('');

  const handleLogout = async () => {
    try {
      // Firebase'den çıkış yap
      await signOut(auth);
      setIsSignedIn(false); // Kullanıcıyı giriş yapmamış olarak işaretle
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  const handleChangePassword = async () => {
    try {
      // Firebase'de şifreyi güncelle
      await updatePassword(auth.currentUser, newPassword);
      console.log('Password changed successfully!');
      // Şifre değişimi başarılıysa, isteğe bağlı olarak kullanıcıyı otomatik çıkış yapabilirsiniz.
      // await signOut(auth);
      // setIsSignedIn(false);
    } catch (error) {
      console.error('Password Change Error:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Change Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={(text) => setNewPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
    </View>
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
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
});

