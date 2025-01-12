import React, {useState} from "react";
import { Button, Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";

const RegisterScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [designation, setDesignation] = useState('');
    const [password, setPassword] = useState('');
    const [confrimPassword, setConfirmPassword] = useState('');

    const handleCreateAccount = () => {
        // Create account logic
        if (password === confrimPassword) {
            alert('Account Create Successfully');
            navigation.navigate('Login');
        } else {
            alert('There is a mismatch in password')
        }
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Evpay</Text>
            <Text style={styles.message}>
                Create your account
            </Text>

            <Text style={styles.name}>Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Your Name"
                value={name}
                onChange={setName}
            />

            <Text style={styles.email}>Email address</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                keyboardType="email-address"
                value={email}
                onChange={setEmail}
            />

            <Text style={styles.designation}>Confirm Designation</Text>
            <TextInput
                style={styles.input}
                placeholder=""
            />

            <Text style={styles.password}>Create User Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Password"
                secureTextEntry={true}
                value={password}
                onChange={setPassword}
            />

            <Text style={styles.password}>Confirm User Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry={true}
                value={confrimPassword}
                onChange={setConfirmPassword}
            />

            {/* Create account Button */}
            <TouchableOpacity style={styles.createButton}>
                <Text style={styles.createButtonText} onPress={handleCreateAccount}>Create account</Text>
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

export default RegisterScreen;