import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

const IconButton = ({ onPress, icon, title }) => (
  <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
    <View style={styles.iconContainer}>
      <Icon name={icon} size={22} color="#fff" />
    </View>
    <Text style={styles.appButtonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  appButtonContainer: {
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 10,
    margin: 5,  
    borderRadius: 20,  
    backgroundColor: '#4267B3',  
    width: 70,  
    height: 70, 
  },
  appButtonText: {
    fontSize: 14,
    color: '#fff',
    paddingTop: 4, 
    textAlign: 'center',  
  },
  iconContainer: {
    width: 24,  
    height: 24,  
    marginBottom: 4,  
    justifyContent: 'center',  
    alignItems: 'center',  
  },
});

export default IconButton;
