import axios from "axios";
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Constants from 'expo-constants';

import { API_BASE_URL } from "@env";
console.log("API_BASE_URL: ",API_BASE_URL); // Debugging

const LoginScreen = ({navigation}) => {
    // state variables for email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //login logic
    const handleLogin = async () => {
        if (!email || !password) {
            alert("Please enter both email and password!");
            return;
        }

        // call to backend
        try {
            const response = await axios.post(
                `${API_BASE_URL}/auth/login_pass`,
                { email, password, },
                {headers: {"Content-Type": "application/json"}}
            );

            // show success message
            alert(response.data.message)

            // navigate to user homepage
            navigation.navigate('UserScreen');

        } catch (error) {
            console.error("Login error: ", error);

            if (error.response) {
                alert(error.response.data.message || "Something went wrong!")
            } else {
                alert("Something went wrong. Please try again");
            }
        }
    }

    const handleRegister = () => {
        // Register page
        navigation.navigate('Register')
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>EVPay</Text>

            <Text style={styles.message}>Sign in to access your account</Text>

            <Text style={styles.email}>Email Address</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <Text style={styles.password}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />

            {/* Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.text}>
                Don't have an account?
                <Text style={styles.link} onPress={handleRegister}> Sign Up</Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        justifyContent: 'top',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    message: {
        fontSize: 24,
        color: '',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    loginButton: {
        backgroundColor: '#50ff50',
        padding: 15,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    loginButtonText: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 18,
        marginBottom: 5,
    },
    password: {
        fontSize: 18,
        marginBottom: 5,
    },
    text: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
    link: {
        color: '#00ff00',
    },
});

export default LoginScreen;