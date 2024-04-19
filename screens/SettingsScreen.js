import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const SettingsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings Screen</Text>
      <Button title="Backup Contacts" onPress={() => console.log('Backup functionality to be implemented')} />
      <Button title="Restore Contacts" onPress={() => console.log('Restore functionality to be implemented')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  text: {
    fontSize: 18,
    padding: 10,
  },
});

export default SettingsScreen;
