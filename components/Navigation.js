import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import ContactDetailsScreen from '../screens/ContactDetailsScreen';
import AddEditContactScreen from '../screens/AddEditContactScreen'; 
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import SplashScreen from '../screens/SplashScreen'; 
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const CustomBackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon name="arrow-back" color="#fff" />
      <Text style={{ color: '#fff', marginLeft: 5, fontSize: 18 }}>Back</Text>
    </TouchableOpacity>
  );
};

function Navigation() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" headerMode="none" screenOptions={{
        headerStyle: {
          backgroundColor: '#4267B3',  
        },
        headerTintColor: '#fff',  
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen}
         options={{
            headerShown: false,
            footerShown: false
          }} 
          headerMode="none" />
        <Stack.Screen name="Home" component={HomeScreen} options={({ navigation }) => ({
            headerStyle: {
              backgroundColor: '#4267B3',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            title: 'Connectify',
            headerLeft: () => (
              <Image
                source={require('../assets/connectify-white.png')}
                style={{ width: 30, height: 30, marginLeft: 10 }}
              />
            ),
            headerRight: () => (
              <Icon 
              name='add'
              type='material'
              color='#fff'
              size={30} 
              onPress={() => navigation.navigate('AddEditContact')}
            />
              
            ),
          })}/>
        <Stack.Screen name="ContactDetails" 
          component={ContactDetailsScreen}
          options={{ 
            title: 'Contact Details',
            headerLeft: () => (
              <CustomBackButton />
            ), }} />
        <Stack.Screen name="AddEditContact" 
          component={AddEditContactScreen}
          options={{ 
            title: 'Add or Edit Contact',
            headerLeft: () => (
              <CustomBackButton />
            ), }} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
