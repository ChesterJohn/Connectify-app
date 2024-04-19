import React, { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { fetchContactById, deleteContact, updateContactImage, saveRecordingURI  } from '../components/Database';
import { InfoAlert, ConfirmAlert, ConfirmNoteDelete } from '../components/Alerts';
import * as ImagePicker from 'expo-image-picker'; 
import defaultImage from '../assets/images/user-default.png'; 
import IconButton from '../components/IconButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Audio } from 'expo-av';


const IconOnlyButton = ({ name, onPress, disabled }) => (
  <TouchableOpacity 
    onPress={onPress} 
    style={[styles.socialButton, disabled && styles.disabledButton]}
    disabled={disabled}
  >
    <Icon name={name} size={32} color={disabled ? "#cccccc" : "#4267B3"} /> 
  </TouchableOpacity>
);

const ContactDetailsScreen = ({ route, navigation }) => {
  const [contact, setContact] = useState(null);
  const [showInfoAlert, setShowInfoAlert] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [showConfirmNoteDelete, setShowConfirmNoteDelete] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingURI, setRecordingURI] = useState(null); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const [status, setStatus] = useState('');
  const timeoutIdRef = useRef(null); 
 
  const requestAudioPermission = async () => {
    try {
      if (permissionResponse.status !== 'granted') {
        console.log("Requesting permissions");
        await requestPermission();
      } 
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

    } catch (error) {
      console.log('Error requesting audio recording permission:', error);
    }
  }


  const startRecording = async () => {
    try {
      await requestAudioPermission();

      const recordingObject = new Audio.Recording();
      await recordingObject.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recordingObject.startAsync(); 
 
      setRecording(recordingObject);
      setIsRecording(true);
      setStatus('Recording');
      timeoutIdRef.current = setTimeout(() => {
        stopRecording();
      }, 30000);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        clearTimeout(timeoutIdRef.current);
        const uri = recording.getURI();
        setRecording(null);
        setIsRecording(false);
        console.log('Recording stopped');
        saveRecording(uri);
        console.log('Recording saved to the datatabase');
        setStatus('Recording has been saved.');
      } else {
        console.warn('Recording object is null.');
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };
  

  const saveRecording = async (uri) => {
    try { 
      if (contact?.id) {
        await saveRecordingURI(contact.id, uri);   
        setRecordingURI(uri);
      } else {
        console.error('Contact ID not found');
      }
    } catch (error) {
      console.error('Failed to save recording:', error);
    }
  };

  const playRecording = async () => {
    try {

      if (!recordingURI) {
        console.log('No audio data available');
        return;
      }
  
      const { sound } = await Audio.Sound.createAsync(
        { uri: recordingURI },
        { shouldPlay: isPlaying },
        playbackStatusUpdate
      );
  
      if (isPlaying) {
        await sound.pauseAsync();  
        setIsPlaying(false);
        setStatus('Paused');
      } else {
        await sound.playAsync();  
        setIsPlaying(true);
        setStatus('Playing');
      }
    } catch (error) {
      console.error('Failed to play recording:', error);
    }
  };
  
  // Function to handle playback status update
  const playbackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setIsPlaying(false);  
      setStatus('Audio note available');
    }
  };
  
  
  
  
  const deleteRecording = async () => {


    try {
      if (contact?.id) {
        await saveRecordingURI(contact.id, null);  
      } else {
        console.error('Contact ID not found');
      }
    } catch (error) {
      console.error('Failed to delete recording:', error);
    }
  };

 
  async function getCameraPermissions() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    console.log("Camera Permission Status:", status);
    if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera permissions to make this work!');
        return false;
    }
    return true;
  }

  async function getMediaLibraryPermissions() {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("Media Library Permission Status:", status);
      if (status !== 'granted') {
          Alert.alert('Permission required', 'Sorry, we need media library permissions to make this work!');
          return false;
      }
      return true;
  }


  useFocusEffect(
    useCallback(() => {
      const loadContactDetails = async () => {
        if (route.params?.id) {
          const data = await fetchContactById(route.params.id);
          if (data) {
            setContact(data);
            setImageUri(data.imageUri);     

            if (data.audioNote && typeof data.audioNote === 'string') {
              setRecordingURI(data.audioNote);
              setStatus('Audio note available');
            } else {
              setStatus('No audio note');
            }

          } else {
            setInfoMessage('Contact not found');
            setShowInfoAlert(true);
          }
        }
      };
      loadContactDetails();
    }, [route.params?.id])
  );



  const handleDelete = async () => {
    try {
      if (contact?.id) {
        await deleteContact(contact.id);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Failed to delete contact:', error);
      setInfoMessage('Failed to delete contact');
      setShowInfoAlert(true);
    }
  };

  const handleImageSave = async (uri) => {
    if (!contact?.id) return;  

    try {
        const result = await updateContactImage(contact.id, uri); 
        setImageUri(uri); 
        setInfoMessage('Image updated successfully');
        setShowInfoAlert(true);
    } catch (error) {
        console.error('Failed to update image:', error);
        setInfoMessage('Failed to update image');
        setShowInfoAlert(true);
    }
};


  const pickImage = async () => {
      const hasPermission = await getMediaLibraryPermissions();
      if (!hasPermission) return;

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
 
      if (!result.cancelled) {
        console.log("image URI from photos app:", result.assets[0].uri);
        handleImageSave(result.assets[0].uri);
      }
  };

  const takePhoto = async () => {
      const hasPermission = await getCameraPermissions();
      if (!hasPermission) return;

      let result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
      });

      if (!result.cancelled) {
        console.log("image URI from camera:", result.assets[0].uri);
        handleImageSave(result.assets[0].uri);
      }
  };

  const handleEmailPress = async (email) => {
    const url = `mailto:${email}`;
    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    }
  };

  const handlePhonePress = async (phone) => { 
    const url = `tel:${phone}`;
    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    }
  };

  const handleFacebookPress = async (url) => { 
    console.log(url);
    if (!url) {
      setInfoMessage('No facebook profile found.');
      setShowInfoAlert(true); 
      return;
    }

    const appURL = `fb://facewebmodal/f?href=${url}`; 
    if (await Linking.canOpenURL(appURL)) {
      await Linking.openURL(appURL);
    } else if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    } else { 
      console.error('Failed to open URL:', url);
    }
  };
  
  const handleInstagramPress = async (username) => {
    const url = `instagram://user?username=${username}`;
    const webURL = `https://instagram.com/${username}`;
    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    } else if (await Linking.canOpenURL(webURL)) {
      await Linking.openURL(webURL);
    }
  };

const handlexTwitterPress = async (username) => {
  console.log(username);
  const url = `twitter://user?screen_name=${username}`;
  const webURL = `https://x.com/${username}`;
  if (await Linking.canOpenURL(url)) {
    await Linking.openURL(url);
  } else if (await Linking.canOpenURL(webURL)) {
    await Linking.openURL(webURL);
  }
};

  return (
    <View style={styles.container}>
      {contact ? (
        <>
        
          {imageUri ? <Image source={{ uri: imageUri }} style={styles.profilePic} /> : <Image source={defaultImage} style={styles.profilePic} />}
          
          <Text style={styles.contactName}>{contact.name}</Text>
          <View style={styles.buttonRow}> 
            <IconButton icon="photo" title="Upload" onPress={pickImage}/> 
            <IconButton icon="camera" title="Camera" onPress={takePhoto}/> 

            <IconButton  icon="edit" title="Edit" onPress={() => navigation.navigate('AddEditContact', { ...contact })} />
            <IconButton icon="trash" title="Delete" onPress={() => setShowConfirmAlert(true)} />
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionCardContainer}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.contactInfo}>
                <Icon name="phone" size={25} color="#4267B3" />
                <TouchableOpacity onPress={() => handlePhonePress(contact.phone)}>
                  <Text style={styles.text}>{contact.phone}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.contactInfo}>
                <Icon name="envelope" size={22} color="#4267B3" />
                <TouchableOpacity onPress={() => handleEmailPress(contact.email)}>
                  <Text style={styles.text}>{contact.email}</Text>
                </TouchableOpacity>
              </View>
            </View>


            <View style={styles.sectionCardContainer}>
              <Text style={styles.sectionTitle}>Socials</Text>
                <View style={styles.buttonRow}> 
                  <IconOnlyButton 
                    name="facebook" 
                    onPress={() => handleFacebookPress(contact.facebook)}
                    disabled={!contact.facebook}
                  />
                  <IconOnlyButton 
                    name="instagram" 
                    onPress={() => handleInstagramPress(contact.instagram)}
                    disabled={!contact.instagram}
                  />
                  <IconOnlyButton 
                    name="twitter" 
                    onPress={() => handlexTwitterPress(contact.xApp)}
                    disabled={!contact.xApp}
                  /> 
              </View>
            </View>
            
            <View style={styles.sectionCardContainer}>
              <Text style={styles.sectionTitle}>Audio Note</Text>
              <Text>Status: {status}</Text>
              <View style={styles.buttonRow}>  
                <IconOnlyButton name={isRecording ? "stop" : "circle"} 
                  onPress={() => isRecording ? stopRecording() : startRecording()}  
                  disabled={recordingURI !== null && !isRecording}
                />
                <IconOnlyButton name={isPlaying ? "pause" : "play"} 
                  onPress={() => playRecording()}  
                  disabled={!recordingURI} 
                />
                <IconOnlyButton name="trash" onPress={() => setShowConfirmNoteDelete(true)}  
                  disabled={!recordingURI}
                />  
              </View>
            </View>
          </View>
  
          <ConfirmAlert
            showAlert={showConfirmAlert}
            title="Confirmation"
            message="Are you sure you want to delete this contact?"
            onCancelPressed={() => setShowConfirmAlert(false)}
            onConfirmPressed={() => {
              handleDelete();
              setShowConfirmAlert(false);
            }}
          />
          <ConfirmNoteDelete
            showAlert={showConfirmNoteDelete}
            title="Confirmation"
            message="Are you sure you want to delete this audio note?"
            onCancelPressed={() => setShowConfirmNoteDelete(false)}
            onConfirmPressed={() => {
              deleteRecording();
              setRecordingURI(null);
              setStatus('No audio note');
              setShowConfirmNoteDelete(false);
            }}
          />


          <InfoAlert
            showAlert={showInfoAlert}
            title="Information"
            message={infoMessage}
            onConfirmPressed={() => setShowInfoAlert(false)}
          />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
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
  contactName: {
    fontSize: 28,
    padding: 10,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 100,
    alignSelf: 'center', 
    marginTop: 20,  
    marginBottom: 20,  
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', 
    alignItems: 'center',
    width: '100%',  
    marginVertical: 10,  
    marginBottom: 10,
  },
  contactName: {
    textAlign: 'center',  
    fontSize: 32,  
    marginVertical: 8,  
    width: '100%',  
  },

  sectionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center", 
    marginTop: -15,
  },
  sectionCardContainer: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#4267B3",
    borderRadius: 5,
    padding: 10, 
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  text: {
    color: "#000", 
    fontSize: 16, 
    marginLeft: 15,
  },
  disabledButton: { 
    opacity: 0.4,
  },
});

export default ContactDetailsScreen;
