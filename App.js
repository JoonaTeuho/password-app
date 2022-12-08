import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Header, Icon } from'react-native-elements';
import { Input, Button } from'react-native-elements';
import { ListItem } from'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import { initializeApp } from'firebase/app';
import { getDatabase, push, ref, onValue, remove } from'firebase/database';


export default function App() {

  const firebaseConfig = {
    apiKey: "AIzaSyDiN2spVurkNTasXlLeCV2PYalQXMW4Tx8",
    authDomain: "passwordapp-c71a3.firebaseapp.com",
    databaseURL:"https//passwordapp-c71a3-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "passwordapp-c71a3",
    storageBucket: "passwordapp-c71a3.appspot.com",
    messagingSenderId: "650246652653",
    appId: "1:650246652653:web:5341ea16d15235882dc2e4",
    measurementId: "G-VB65R1F2T7"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  const [passwords, setPasswords] = useState([]);
  const [appName, setAppName] = useState('');
  const [pass, setPass] = useState('');

  let length = 8
  let upper = "on"
  let lower = "on"
  let special = "on"
  let numbers = "on"

  useEffect(() => {
    const passwordsRef = ref(database, 'passwords/');
    onValue(passwordsRef, (snapshot) => {
      const data = snapshot.val();
      const passwords = data ? Object.keys(data).map(key => ({ key, ...data[key] })) : [];
      setPasswords(passwords);
    });
  }, []);

  const savePassword = () =>{
    console.log(appName + pass)
    console.log(passwords)
    push(
        ref(database, 'passwords/'),
       { 'appName': appName, 'Password': pass }
      );
  }

  const deleteProduct = (key) => {
    remove(
      ref(database, 'passwords/' + key),
    )
  }

  const listSeparator = () => {
    return(
      <View
        style={{
          height: 5,
          width: '80%',
          backgroundColor: '#fff',
          marginLeft: '80%'
        }}
      />
    );
  };

  renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 10 }}>
        <ListItem.Title>{ item.appName }</ListItem.Title>
        <ListItem.Subtitle>{ item.Password }</ListItem.Subtitle>
        </View>
        <View style={{ flex: 1 }}>
        <MaterialCommunityIcons name="trash-can" size={ 30 } color="red"
              onPress={() => deleteProduct(item.key)} />
          </View>
        </View>
      </ListItem.Content>
    </ListItem>
  );

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

      <Header
        centerComponent={{ text: 'Passwords', style: { color: '#fff' } }}
        containerStyle={{ justifyContent: 'space-around' }}
      />
      
      <Input
        placeholder='Enter app name' label='App Name'
        onChangeText={ appName => setAppName(appName) }
        value={ appName }
      />

        <Text>
          Generated password: {pass}
        </Text>
        <Button 
            containerStyle={{ width: '65%', marginBottom: 5}}
            title="Press to generate a password"
            icon={{ color: '#fff' }} 
            onPress={ () => getPassword()}
        />

      <Button 
        raised 
        containerStyle={{ width: '60%', marginBottom: 7}}
          icon={{ name: 'save', color: '#fff' }} 
          onPress={ savePassword } 
          title='SAVE' />

      <FlatList
        data={ passwords }
        ItemSeparatorComponent={ listSeparator }
        renderItem={ renderItem }
        keyExtractor={ item => item.key }
      />

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