import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Button } from 'react-native';

export default function App() {

  const [pass, setPass] = useState('');

  let length = 8
  let upper = "on"
  let lower = "on"
  let special = "on"
  let numbers = "on"

  /* const getPassword = () => {
    fetch(`https://passwordwolf.com/api/?length=${length}&upper=${upper}&lower=${lower}&special=${special}&numbers=${numbers}&repeat=1`)
    .then(response => response.json())
    .then(data => console.log(data))

    .catch(error => {
      console.error(error)
    });
  }*/

  const getPassword = async () => {
    try {
      const response = await fetch(
        `https://passwordwolf.com/api/?length=${length}&upper=${upper}&lower=${lower}&special=${special}&numbers=${numbers}&repeat=1`
        );
      const data = await response.json();
      const generatedPassword = await data[0].password;
      setPass(generatedPassword);
      
      console.log(data)
      console.log(generatedPassword)
      console.log("Generated password: " + pass)

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <View style={styles.container}>
      <Text>{pass}</Text>
      <Button 
      title="Create a password"
      type="button"
      onPress={ () => getPassword()}

      />
      <StatusBar style="auto" />
      </View>
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
