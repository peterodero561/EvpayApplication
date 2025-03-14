import React, {useState} from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";

const EditProfileScreen = ({navigation}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confrimPassword, setConfirmPassword] = useState('');

    const handleSaveInfo = () => {
        if (password === confrimPassword) {
            navigation.navigate('Profile');
        }
    };

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile Screen</Text>

            <Text style={styles.name}>New Name</Text>
            <TextInput
                placeholder="Enter new name"
                style={styles.input}
                value={name}
                onChange={setName}
            />

            <Text style={styles.email}>New Email address</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your New email address"
                keyboardType="email-address"
                value={email}
                onChange={setEmail}
            />
            
            <Text style={styles.password}>Create New User Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter New Password"
                secureTextEntry={true}
                value={password}
                onChange={setPassword}
            />
            
            <Text style={styles.password}>Confirm New User Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                secureTextEntry={true}
                value={confrimPassword}
                onChange={setConfirmPassword}
            />
            
            {/* Create Save Button */}
            <TouchableOpacity style={styles.createButton}>
                <Text style={styles.createButtonText} onPress={handleSaveInfo}>Save New Information</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'top',
    },
    title: {
        fontSize: 28,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    message: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ccc',
        height: 40,
        marginBottom: 20,
        paddingHorizontal: 15,
    },
    email: {
        fontSize: 18,
        marginBottom: 10,
    },
    name: {
        fontSize: 18,
        marginBottom: 10,
    },
    designation: {
        fontSize: 18,
        marginBottom: 10,
    },
    password: {
        fontSize: 18,
        marginBottom: 10,
    },
    createButton: {
        backgroundColor: '#50ff50',
        borderRadius: 20,
        alignItems: 'center',
        padding: 15,
    },
    createButtonText: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
    }
});

export default EditProfileScreen;