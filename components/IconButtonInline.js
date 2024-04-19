import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

const IconButtonInline = ({ onPress, icon, title }) => (
  <View style={styles.appButtonContainer}>
    <Icon.Button
      name={icon}
      type='material'
      backgroundColor='#4267B3'
      color='#fff' 
      onPress={onPress}
      style={styles.appButton}
    >
      <Text style={styles.appButtonText}>{title}</Text>
    </Icon.Button>
  </View>
);

const styles = StyleSheet.create({
    appButton: {
        paddingVertical: 12,  
        paddingHorizontal: 12,  
        borderRadius: 6,  
        flexDirection: 'row',  
        alignItems: 'center', 
        justifyContent: 'center',  
      },
      appButtonText: {
        fontSize: 17,
        color: '#fff',
      },
      appButtonContainer: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        width: 150
      },
});

export default IconButtonInline;