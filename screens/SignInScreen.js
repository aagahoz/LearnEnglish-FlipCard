import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import auth from '@react-native-firebase/auth';

const SignInScreen = ({ navigation, setIsSignedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      // const userCredential = await auth().signInWithEmailAndPassword(email, password);
      // console.log('Kullanıcı giriş yaptı:', userCredential.user);

      // Kullanıcı giriş yaptıktan sonra navigasyonu güncelle
      setIsSignedIn(true);
      console.log("basarili")
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>
        Giriş Yap
      </Text>
      <Input
        placeholder="E-posta"
        value={email}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
      />
      <Input
        placeholder="Şifre"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        autoCapitalize="none"
      />
      <Button
        title="Giriş Yap"
        onPress={handleSignIn}
        loading={loading}
        disabled={loading}
        containerStyle={styles.buttonContainer}
      />
      <Button
        title="Üye Ol"
        type="clear"
        onPress={() => navigation.navigate('SignUp')}
        titleStyle={styles.signupButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 16,
  },
  signupButton: {
    color: 'blue', // Üye Ol buton rengi
  },
});

export default SignInScreen;
