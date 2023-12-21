import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RandomTextScreen = () => {
  const [displayText, setDisplayText] = useState('Merhaba, dünyaya hoş geldiniz!');
  const [favorites, setFavorites] = useState([]);

  const changeText = () => {
    setDisplayText("Hello, world!");
  };

  const addToFavorites = () => {
    setFavorites([...favorites, displayText]);
  };

  const goNext = () => {
  };

  const goBack = () => {
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={addToFavorites} style={styles.favoritesButton}>
        <Text style={styles.buttonText}>add to learned</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <TouchableOpacity onPress={changeText} style={styles.textContainer}>
          <Text style={styles.text}>{displayText}</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={goBack} style={styles.button}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={goNext} style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
  },
  favoritesButton: {
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
    backgroundColor: '#00CC33',
    marginBottom: 70,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginBottom: 50,
    padding: 20,
    borderRadius: 40,
    width: '70%',
    height: '70%',
    justifyContent: 'center',
    backgroundColor: '#999966',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: 20,
    backgroundColor: '#999999',
    borderRadius: 5,
    width: '35%',
  },
});

export default RandomTextScreen;
