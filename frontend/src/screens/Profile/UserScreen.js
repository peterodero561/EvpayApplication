import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import Carousel from 'react-native-reanimated-carousel';
import Footer from '../../components/Footer';
import SlidingMenu from "../../components/SlidingMenu";
import Activities from "../../components/Activities";

const { width } = Dimensions.get('window');

const UserScreen = ({navigation, route}) => {
    //user from login parameters
    const user = route.params?.user;

    const [menuVisible, setMenuVisible] = useState(false);
    const toggleMenu = () => setMenuVisible(!menuVisible);

    const [pictures, setPictures] = useState([
        {id: 1, url: require('../../../assets/images/EVCharge.jpeg')},
        {id: 2, url: require('../../../assets/images/EVCharge2.jpeg')},
        {id: 3, url: require('../../../assets/images/EVCharge3.jpeg')},
    ]);

    const [activities, setActivities] = useState([
        "Payment of $20",
        "Profile update",
        "Check balance: $50",
    ]);

    const renderItem = ({ item }) => {
        return (
            <View style={styles.imageContainer}>
                <Image source={item.url} style={styles.image}></Image>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Evpay</Text>
            <Text style={styles.message}>Welcome to Evpay</Text>

            <Carousel
                data={pictures}
                width={width} // Required for horizontal carousels
                height={(Dimensions.get('window').height)/2} // Provide height for the carousel
                renderItem={renderItem}
                loop={true}
            />

            {/* Activities component */}
            <Activities navigation={navigation}/>

            {/* Sliding Menu component */}
            <SlidingMenu menuVisible={menuVisible} toggleMenu={toggleMenu} user={user} navigation={navigation}/>

            {/* Footer Bar */}
            <Footer navigation={navigation} user={user} menu={toggleMenu} menuVisible={menuVisible}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    message: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dddddd',
        borderRadius: 30,
        padding: 0,
    },
    image: {
        width: width * 0.8,
        height: '100%',
        resizeMode: 'contain',
    },
    activities: {
        backgroundColor: '#50ff50',
        margin: 20,
        padding: 15,
        borderRadius: 10,
    },
    activitiesTitle: {
        fontSize: 24,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    activity: {
        fontSize: 18,
        marginBottom: 5,
    },
});

export default UserScreen;