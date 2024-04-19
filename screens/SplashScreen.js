
import React, { useEffect } from 'react'; 
import { View, Image, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => { 
    const timer = setTimeout(() => {
      navigation.replace('Home');  
    }, 3000);

    return () => clearTimeout(timer);  
  }, [navigation]);

  return (
    <View style={styles.container}> 
      <Image source={require('../assets/connectify-splash.png')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', 
  },
  image: {
    width: '100%',  
    height: '100%',  
    resizeMode: 'cover', 
  },
});

export default SplashScreen;
