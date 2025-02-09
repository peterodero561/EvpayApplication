import React, {use, useState} from "react";
import { Button, Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Constants from 'expo-constants';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from "axios";

import { API_BASE_URL } from "@env"

const RegisterScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: 'Garage Manager', value: 'garage manager'},
        {label: 'Driver', value: 'driver'},
        {label: 'Passenger', value: 'user'},
    ])

    const handleCreateAccount = async () => {
        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            alert('There is a mismatch in password');
            return
        }
        try{
            const response = await axios.post(
                `${API_BASE_URL}/auth/register_user`,
                { email, name, password },
                { headers: {"Content-Type": "application/json"}}
            )
            
            // show sucess message
            alert(response.data.message);
        } catch(error) {
            console.log("Registering error, ", error);
            alert ("Something Went wrong in Registering! Please try again");
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
                onChangeText={setName}
            />

            <Text style={styles.email}>Email address</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <Text style={styles.designation}>Confirm Designation</Text>
            <DropDownPicker
                placeholder="Select Destination"
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                style={styles.dropdown}
            />

            <Text style={styles.password}>Create User Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />

            <Text style={styles.password}>Confirm User Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
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
    },
    dropdown: {
        borderWidth: 1,
        borderRadius: 5
    }
});

export default RegisterScreen;