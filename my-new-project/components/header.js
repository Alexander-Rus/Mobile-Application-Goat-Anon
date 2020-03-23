import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';


//This is the header that goes on top of our Application
export default function Header(props) {
  return (
    <View style={styles.header}>
      <Text style={styles.text}>{props.title}</Text>
    </View>
  );
}

//Css styling
const styles = StyleSheet.create({
  header: {
    height: 100,
    paddingTop: 55,
    backgroundColor: '#ff5757',
    width: 400,
    marginLeft: -20, 
    marginTop: -50,
  },
  text: {
      color: '#fff',
      fontSize: 33,
      textAlign: 'center',
      fontFamily: 'Futura',
      fontWeight: 'bold',
  },
  icon: {
      position: "absolute",
      right: 340,
      top: 59,
  }
});
