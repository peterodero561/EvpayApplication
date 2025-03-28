import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { API_BASE_URL } from "@env"
import Footer from "../../components/Footer";
import SlidingMenu from "../../components/SlidingMenu";
import axios from "axios";

const ProfileScreen = ({navigation, route}) => {
    // user from UserScreen 
    const { user } = route.params;
    const [menuVisible, setMenuVisible] = useState(false);
    const toggleMenu = () => setMenuVisible(!menuVisible);
    const [additionalData, setAdditionalData] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [loading, setLoading] = useState(false);
    const profilePic = user?.userProfilePic ? { uri: `${API_BASE_URL}/static/images/profiles/${user.userProfilePic}` } : require('../../../assets/default.jpg');

    // fetch data accoring to role of user logged in
    useEffect(() => {
        const fetchRoleData = async () => {
            setLoading(true);
            try {
                if (user.userRole === 'driver') {
                    const response = await axios.get(`${API_BASE_URL}/api/profiles/driver_bus/${user.userId}`);
                    setAdditionalData(response.data);
                    console.log(response.data);
                } else if (user.userRole === 'garage manager') {
                    const response = await axios.get(`${API_BASE_URL}/api/profiles/manager_garage/${user.userId}`);
                    setAdditionalData(response.data);
                }
            } catch (error) {
                console.error('Error fetching role data: ', error);
            } finally {
                setLoading(false);
            }
        };

        if (user.userRole !== 'user') { fetchRoleData() }
    }, [user]);
    
    const renderRoleSpecificSection = () => {
        if (loading) return <ActivityIndicator size='large' color="0000ff" />;
        if (!additionalData) return null;

        switch (user.userRole){
            case 'driver':
                return (
                    <View style={styles.section}>
                        <View style={styles.sectionTitleRow}>
                            <Text style={styles.sectionTitle}>Bus Information</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("BusInformation", {user: user, isEdit: !additionalData.message})}>
                                <Text style={styles.addOrEdit}>{additionalData.message ? 'Add' : 'Edit'} Bus Info</Text>
                            </TouchableOpacity>
                        </View>
                        {additionalData.message ? (
                            <Text style={styles.info}>{additionalData.message}</Text>
                        ) : (
                            <>
                                <Text style={styles.info}>Bus Model: {additionalData.busModel}</Text>
                                <Text style={styles.info}>Bus plate number: {additionalData.busPlateNo}</Text>
                                <Text style={styles.info}>Bus batery model: {additionalData.busBatteryModel}</Text>
                                <Text style={styles.info}>Bus baterry company: {additionalData.busBatteryCompany}</Text>
                                <Text style={styles.info}>Bus Seats: {additionalData.busSeatsNo}</Text>
                            </>
                        )}
                    </View>
                );
            case 'garage manager':
                return(
                    <View style={styles.section}>
                        <View style={styles.sectionTitleRow}>
                            <Text style={styles.sectionTitle}>Garage Information</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("GarageInformation", { user: user, isEdit: !additionalData.message})}>
                                <Text style={styles.addOrEdit}>{additionalData.message ? 'Add' : 'Edit'} Garage Info</Text>
                            </TouchableOpacity>
                        </View>
                        {additionalData.message ? (
                            <Text style={styles.info}>{additionalData.message}</Text>
                        ) : (
                            <>
                                <Text style={styles.info}>Garage name: {additionalData.garName}</Text>  
                                <Text style={styles.info}>Garage Location: {additionalData.garLocation}</Text>
                                <Text style={styles.info}>Garage Services: {additionalData.garServices}</Text>  
                            </>
                        )}
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
            <Text style={styles.title}>
                ProfileScreen
            </Text>

            <Image source={profilePic} style={styles.profile}></Image>

            <View style={styles.profileInfo}>
                <Text style={styles.sectionTitle}>Profile Information</Text>
                <Text style={styles.info}>Name: {user?.userName} </Text>
                <Text style={styles.info}>Email: {user?.userEmail} </Text>
                <Text style={styles.info}>Designation: {user?.userRole} </Text>
            </View>

            {/* fetch data according to role */}
            {renderRoleSpecificSection()}

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
        marginBottom: 10,
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
    section: {
        marginVertical: 16,
        backgroundColor: '#e0e0e0',
        padding: 16,
        borderRadius: 10,
        width: '100%'
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333'
    },
    sectionTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center"
    },
    addOrEdit: {
        fontSize: 18,
        color: "#0000ff"
    },
});

export default ProfileScreen;