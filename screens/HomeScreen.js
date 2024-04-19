import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, Button, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import { fetchContacts, toggleFavorite } from '../components/Database';
import CustomTextInput from '../components/CustomTextInput';

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
    ).sort((a, b) => { 
      if (b.favorite - a.favorite !== 0) {
        return b.favorite - a.favorite;
      } 
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
    setFilteredContacts(filtered);
  };

  useEffect(() => {
    filterContacts(contacts);
  }, [searchText, contacts]);

  const handleFavoriteToggle = async (id, isFavorite) => {
    await toggleFavorite(id, isFavorite);
    loadContacts();  
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('ContactDetails', { ...item })}
    >
      <Image
      source={item.imageUri ? { uri: item.imageUri } : require('../assets/images/user-default.png')}
      style={styles.contactImage}
    />
      <Text style={styles.itemName}>{item.name}</Text>
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
    alignSelf: 'center',  
    width: '100%', 
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10, 
    width: '100%', 
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', 
    alignSelf: 'center',
  },
  itemName: {
    fontSize: 16,  
    color: '#333',  
    paddingHorizontal: 5,
    flex: 1,
  },
  searchInput: {
    height: 40,
    fontSize: 18,
    marginBottom: 10,
    width: '100%', // This ensures it matches the container's width
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray'
  },
  starIcon: {
    width: 30,
    height: 30
  },
  contactImage: {
    width: 40,  
    height: 40,  
    borderRadius: 20,  
    marginRight: 10,  
  },
});



export default HomeScreen;