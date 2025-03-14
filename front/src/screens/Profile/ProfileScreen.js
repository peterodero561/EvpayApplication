import React, {cloneElement, use, useState} from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { API_BASE_URL } from "@env"
import Footer from "../../components/Footer";
import SlidingMenu from "../../components/SlidingMenu";

const ProfileScreen = ({navigation, route}) => {
    // user from UserScreen
    const { user } = route.params;
    const [menuVisible, setMenuVisible] = useState(false);
    const toggleMenu = () => setMenuVisible(!menuVisible);
    const profilePic = user?.userProfilePic ? { uri: `${API_BASE_URL}/static/images/profiles/${user.userProfilePic}` } : require('../../../assets/default.jpg');


    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
            <Text style={styles.title}>
                ProfileScreen
            </Text>

            <Image source={profilePic} style={styles.profile}></Image>

            <View style={styles.profileInfo}>
                <Text style={styles.info}>Name: {user?.userName} </Text>
                <Text style={styles.info}>Email: {user?.userEmail} </Text>
                <Text style={styles.info}>Designation: {user?.userRole} </Text>
            </View>

            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile', {user:user})}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            </ScrollView>

            {/* Sliding Menu component */}
            <SlidingMenu menuVisible={menuVisible} toggleMenu={toggleMenu} user={user} navigation={navigation}/>

            {/* Footer Bar */}
            <Footer navigation={navigation} user={user} menu={toggleMenu} menuVisible={false}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    contentContainer: {
        flexGrow: 1,
        padding: 16,
        justifyContent: 'center'
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
        marginBottom: 20,
    },
    editButtonText: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default ProfileScreen;