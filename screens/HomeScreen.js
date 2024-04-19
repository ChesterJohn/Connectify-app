import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, Button, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import { fetchContacts, toggleFavorite } from '../components/Database';
import CustomTextInput from '../components/CustomTextInput';
import IconButton from '../components/IconButton';



const HomeScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadContacts();
    }, [])
  ); 

  const loadContacts = async () => {
    const data = await fetchContacts();
    setContacts(data);
    filterContacts(data);
  };

  const filterContacts = (contacts) => {
    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
      contact.phone.includes(searchText) ||
      (contact.email && contact.email.toLowerCase().includes(searchText.toLowerCase()))
    ).sort((a, b) => b.favorite - a.favorite); // Sort so that favorites are at the top
    setFilteredContacts(filtered);
  };

  useEffect(() => {
    filterContacts(contacts);
  }, [searchText, contacts]);

  const handleFavoriteToggle = async (id, isFavorite) => {
    await toggleFavorite(id, isFavorite);
    loadContacts();  // Reload contacts to update the list
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('ContactDetails', { ...item })}
    >
      <Text>{item.name}</Text>
      <TouchableOpacity onPress={() => handleFavoriteToggle(item.id, item.favorite)}>
        <Image
          style={styles.starIcon}
          source={item.favorite ? require('../assets/star-filled.png') : require('../assets/star-outline.png')}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  ); 

  return (
    <View style={styles.container}>
      <CustomTextInput
          value={searchText}
          onChangeText={text => {
              setSearchText(text);
              filterContacts(contacts);
          }}
          placeholder="Search Contacts..."
      />
      <FlatList
        data={filteredContacts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      /> 
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9EBEE',
    padding: 10,
    alignItems: 'center'
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    fontSize: 18,
    backgroundColor: '#f8f8f8',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  searchInput: {
    height: 40,
    fontSize: 18,
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray'
  },
  starIcon: {
    width: 30,
    height: 30
  }
});


export default HomeScreen;