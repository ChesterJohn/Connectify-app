import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

const CustomTextInput = ({ value, onChangeText, placeholder }) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#ccc"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        width: '100%',
    },
    input: {
        height: 40,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '100%',
        fontSize: 16,
    }
});

export default CustomTextInput;
