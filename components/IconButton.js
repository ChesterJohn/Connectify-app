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
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: 10,
    margin: 5, // Space between buttons
    borderRadius: 20, // Slightly rounded corners
    backgroundColor: '#4267B3', // Fixed background color
    width: 70, // Match icon size
    height: 70, // Match icon size
  },
  appButtonText: {
    fontSize: 14,
    color: '#fff',
    paddingTop: 4, // Space between icon and text
    textAlign: 'center', // Center text horizontally
  },
  iconContainer: {
    // Optionally create a container for the icon if additional styling is needed
    width: 24, // Match icon size
    height: 24, // Match icon size
    marginBottom: 4, // Space between icon and text
    justifyContent: 'center', // Center icon in the container
    alignItems: 'center', // Center icon in the container
  },
});

export default IconButton;
