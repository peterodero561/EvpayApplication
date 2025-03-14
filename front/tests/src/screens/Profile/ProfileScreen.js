import React, {cloneElement, useState} from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const ProfileScreen = ({navigation}) => {
    const [profilePic, setProfilePic] = useState(require('../../../assets/images/profile.jpeg'));
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                ProfileScreen
            </Text>

            <Image source={profilePic} style={styles.profile}></Image>

            <View style={styles.profileInfo}>
                <Text style={styles.info}>Name: Peter Omondi</Text>
                <Text style={styles.info}>Email: peterodero561@gmail.com</Text>
                <Text style={styles.info}>Designation: User</Text>
            </View>

            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        flexDirection: 'column',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,

    },
    profile: {
        width: 150,
        height: 150,
        borderRadius: 15,
        alignSelf: 'center',
        marginBottom: 30,
    },
    profileInfo: {
        marginVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#cccccc',
        padding: 10,
        borderRadius: 15,

    },
    info: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        width: '80%'
    },
    editButton: {
        backgroundColor: '#50ff50',
        padding: 12,
        borderRadius: 8,
        alignSelf: 'center',
        width: '70%',
        position: 'absolute',
        bottom: 250,
    },
    editButtonText: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default ProfileScreen;