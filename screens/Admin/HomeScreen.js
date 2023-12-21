import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const App = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Welcome to Admin Panel</Text>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:'#fff'
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
    },
  });
  
  export default App;