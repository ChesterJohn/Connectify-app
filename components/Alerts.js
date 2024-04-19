import React from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';
 
export const InfoAlert = ({ showAlert, title, message, onConfirmPressed }) => {
  return (
    <AwesomeAlert
      show={showAlert}
      showProgress={false}
      title={title}
      message={message}
      closeOnTouchOutside={true}
      closeOnHardwareBackPress={false}
      showConfirmButton={true}
      confirmText="OK"
      titleStyle={{ fontSize: 20 }}
      messageStyle={{ fontSize: 16 }}
      confirmButtonStyle={{
        width: 100,  
        height: 40,  
      }}
      confirmButtonTextStyle={{
        textAlign: 'center',  
        fontSize: 16,  
        fontWeight: 'bold', 
        lineHeight: 30,
      }}
      confirmButtonColor="#4267B3" 
      onConfirmPressed={onConfirmPressed}
    />
  );
};
 
export const ConfirmAlert = ({ showAlert, title, message, onCancelPressed, onConfirmPressed }) => {
  return (
    <AwesomeAlert
      show={showAlert}
      showProgress={false}
      title={title}
      message={message}
      closeOnTouchOutside={true}
      closeOnHardwareBackPress={false}
      showCancelButton={true}
      showConfirmButton={true}
      cancelText="No"
      confirmText="Yes"
      titleStyle={{ fontSize: 20 }}
      messageStyle={{ fontSize: 16 }}
      confirmButtonColor="#4267B3" 
      onCancelPressed={onCancelPressed}
      onConfirmPressed={onConfirmPressed}
      confirmButtonStyle={{
        width: 100,  
        height: 40,  
      }}
      cancelButtonStyle={{
        width: 100, 
        height: 40,  
      }}
      confirmButtonTextStyle={{
        textAlign: 'center',  
        fontSize: 16,  
        fontWeight: 'bold', 
        lineHeight: 30,
      }}
      cancelButtonTextStyle={{
        textAlign: 'center',  
        fontSize: 16, 
        fontWeight: 'bold', 
        lineHeight: 30,
      }}
    />
  );
};

export const ConfirmNoteDelete = ({ showAlert, title, message, onCancelPressed, onConfirmPressed }) => {
  return (
    <AwesomeAlert
      show={showAlert}
      showProgress={false}
      title={title}
      message={message}
      closeOnTouchOutside={true}
      closeOnHardwareBackPress={false}
      showCancelButton={true}
      showConfirmButton={true}
      cancelText="No"
      confirmText="Yes"
      titleStyle={{ fontSize: 20 }}
      messageStyle={{ fontSize: 16 }}
      confirmButtonColor="#4267B3" 
      onCancelPressed={onCancelPressed}
      onConfirmPressed={onConfirmPressed}
      confirmButtonStyle={{
        width: 100,  
        height: 40,  
      }}
      cancelButtonStyle={{
        width: 100, 
        height: 40,  
      }}
      confirmButtonTextStyle={{
        textAlign: 'center',  
        fontSize: 16,  
        fontWeight: 'bold', 
        lineHeight: 30,
      }}
      cancelButtonTextStyle={{
        textAlign: 'center',  
        fontSize: 16, 
        fontWeight: 'bold', 
        lineHeight: 30,
      }}
    />
  );
};
