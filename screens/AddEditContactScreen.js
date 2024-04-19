import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { addContact, updateContact } from '../components/Database';
import { InfoAlert, ConfirmAlert } from '../components/Alerts';
import CustomTextInput from '../components/CustomTextInput';

const AddEditContactScreen = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(''); 
  const [id, setId] = useState(null);


  const [facebook, setFacebook] = useState('');
  const [xApp, setX] = useState('');
  const [instagram, setInstagram] = useState('');

  const [showInfoAlert, setShowInfoAlert] = useState(false);
  const [infoMessage, setInfoMessage] = useState(''); 


  useEffect(() => {
    if (route.params?.id) {
      setId(route.params.id);
      setName(route.params.name);
      setPhone(route.params.phone);
      setEmail(route.params.email);
      setFacebook(route.params.facebook);
      setInstagram(route.params.instagram);
      setX(route.params.xApp);
    }
  }, [route.params]);
  
  const handleSave = async () => {
    try {
      if (id) { 
        await updateContact(id, name, phone, email, facebook, instagram, xApp, false); 
        setInfoMessage('Contact updated successfully');
        setShowInfoAlert(true); 
      } else { 
        await addContact(name, phone, email, facebook, instagram, xApp, false); 
        setInfoMessage('Contact saved successfully');
        setShowInfoAlert(true);  
      }
    } catch (error) {
      console.error('Failed to save contact:', error); 
      setInfoMessage('Failed to save contact');
      setShowInfoAlert(true);

    }
  };
  

  return (
    <View style={styles.container}>

      <CustomTextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
      />

      <CustomTextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone number"
      />

      <CustomTextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
      />   


      <CustomTextInput
          value={facebook}
          onChangeText={setFacebook}
          placeholder="Facebook profile link"
      />   


      <CustomTextInput
          value={instagram}
          onChangeText={setInstagram}
          placeholder="Instagram Username"
      />   

      <CustomTextInput
          value={xApp}
          onChangeText={setX}
          placeholder="Twitter Username"
      />   
 
      <Button title="Save Contact" onPress={handleSave} />
      
      <InfoAlert
        showAlert={showInfoAlert}
        title="Information"
        message={infoMessage} 
        onConfirmPressed={() => {
            setShowInfoAlert(false);  
            navigation.goBack(); 
          }}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default AddEditContactScreen;
