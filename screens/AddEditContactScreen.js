import React, { useState, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, ScrollView, StyleSheet, Platform } from 'react-native';
import { addContact, updateContact } from '../components/Database';
import { InfoAlert, ConfirmAlert } from '../components/Alerts';
import CustomTextInput from '../components/CustomTextInput';
import IconButtonInline from '../components/IconButtonInline';

const formatPhoneNumber = (value) => { 
  value = value.replace(/\D/g, '');
  // Apply the mask (XXX) XXX-XXXX 
  if (value.length < 4) return value;
  if (value.length < 7) return `(${value.slice(0, 3)}) ${value.slice(3)}`;
  return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
};

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

  const isEditing = id !== null; 
  const [formattedPhone, setFormattedPhone] = useState('');


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

  useEffect(() => {
    if (route.params?.phone) {
      const formatted = formatPhoneNumber(route.params.phone);
      setPhone(route.params.phone);
      setFormattedPhone(formatted);
    }
  }, [route.params?.phone]);

  const handlePhoneChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setPhone(text.replace(/\D/g, ''));  
    setFormattedPhone(formatted);  
  };
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView>
        <View style={styles.form}>

          <Text style={styles.sectionTitle}>{isEditing ? 'Modify Contact' : 'New Contact'}</Text>

          <Text style={styles.inputLabel}>Name</Text>
          <CustomTextInput
              value={name}  
              onChangeText={setName}
              placeholder="Name"
          />

          <Text style={styles.inputLabel}>Phone Number</Text>
          <CustomTextInput
              value={formattedPhone}
              onChangeText={handlePhoneChange}
              placeholder="(123) 456-7890"
              keyboardType="numeric"
          />

          <Text style={styles.inputLabel}>Email</Text>
          <CustomTextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
          />   

          <Text style={styles.inputLabel}>Facebook Profile</Text>
          <CustomTextInput
              value={facebook}
              onChangeText={setFacebook}
              placeholder="Facebook profile link"
          />   

          <Text style={styles.inputLabel}>Instagram Username</Text>
          <CustomTextInput
              value={instagram}
              onChangeText={setInstagram}
              placeholder="Instagram Username"
          />   

          <Text style={styles.inputLabel}>X Username</Text>
          <CustomTextInput
              value={xApp}
              onChangeText={setX}
              placeholder="X Username"
          />   
      
          <IconButtonInline icon="save" title="Save" onPress={handleSave}/> 
        </View>
      </ScrollView>

      <InfoAlert
        showAlert={showInfoAlert}
        title="Information"
        message={infoMessage} 
        onConfirmPressed={() => {
            setShowInfoAlert(false);  
            navigation.goBack(); 
          }}
      />

    </KeyboardAvoidingView>
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
  sectionTitle: {
    fontSize: 28,
    padding: 10,
  },
  inputLabel: {
    fontSize: 16,  
    marginTop: 10,  
    marginLeft: 10,  
    fontWeight: 'bold',  
  },
  form: {
    padding: 10,
  },

});

export default AddEditContactScreen;
