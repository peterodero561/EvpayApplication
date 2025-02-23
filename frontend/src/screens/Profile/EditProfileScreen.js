import React, {useState} from "react";
import axios from 'axios';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import Constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_BASE_URL } from "@env";
import * as ImagePicker from 'expo-image-picker';

const EditProfileScreen = ({navigation, route}) => {
    const user = route.params;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confrimPassword, setConfirmPassword] = useState('');
    const [profilePic, setProfilePic] = useState('');

    const pickImage = async () => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted'){
            alert('permision to access gallery is required');
            return;
        }
        
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled){
            setProfilePic(result.assets[0].uri);
        }
    };

    const handleSaveInfo = async () => {
        if (password !== confrimPassword) {
            alert("Password and Confirm Password must match");
            return;
        }

        // get session token
        const token = await AsyncStorage.getItem('authToken');

        try {
            const response = await axios.put(`${API_BASE_URL}/profiles/account_update`, {
                name,
                email,
                password,
            }, {headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }});

            if (response.status === 200) {
                console.log("Updated user: ", response.data);
                navigation.navigate('Profile', {user: response.data.user});
            }
        } catch (error) {
            console.log("Edit profile error: ", error);
            alert("Something went wrong with Editing profile. Please try again");
        }
    };

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile Screen</Text>

            {/* Profile Picture */}
            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                {profilePic ? (
                    <Image source={{ uri: profilePic }} style={styles.profileImage}/>
                ) : (
                    <Text style={styles.imagePlaceholder}>Pick a Profile Picture </Text>
                )}
            </TouchableOpacity>

            <Text style={styles.label}>New Name</Text>
            <TextInput
                placeholder="Enter new name"
                style={styles.input}
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>New Email address</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your New email address"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            
            <Text style={styles.label}>Create New User Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter New Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            
            <Text style={styles.label}>Confirm New User Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                secureTextEntry={true}
                value={confrimPassword}
                onChangeText={setConfirmPassword}
            />
            
            {/* Create Save Button */}
            <TouchableOpacity style={styles.createButton} onPress={handleSaveInfo}>
                <Text style={styles.createButtonText}>Save New Information</Text>
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
    label: {
        fontSize:18,
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
    imageContainer: {
        alignSelf: 'center',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    imagePlaceholder: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
    }
});

export default EditProfileScreen;