import React, { act, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import Carousel from 'react-native-reanimated-carousel';
import Icon from "react-native-vector-icons/Ionicons";
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Footer from '../../components/Footer';

const { width } = Dimensions.get('window');

const UserScreen = ({navigation, route}) => {
    //user from login parameters
    const user = route.params?.user;

    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    // Animated styles for menu
    const animatedMenuStyle = useAnimatedStyle (() => ({
        transform: [
            {
                translateX: withTiming(menuVisible ? 0: width, { duration: 300}),
            },
        ],
    }));

    const overlayStyle = useAnimatedStyle(() => ({
        opacity: withTiming(menuVisible ? 0.5 : 0, { duration: 300 }),
    }));


    const [pictures, setPictures] = useState([
        {id: 1, url: require('../../../assets/images/EVCharge.jpeg')},
        {id: 2, url: require('../../../assets/images/EVCharge2.jpeg')},
        {id: 3, url: require('../../../assets/images/EVCharge3.jpeg')},
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

            <View style={styles.activities}>
                <Text style={styles.activitiesTitle}>
                    My Evpay Activities
                </Text>

                <Text style={styles.activity}>Activity one</Text>
                <Text style={styles.activity}>Activity one</Text>
                <Text style={styles.activity}>Activity one</Text>
                <Text style={styles.activity}>Activity one</Text>
            </View>

            {/* Overlay when the menu is visible */}
            {menuVisible && (
                <Animated.View style={[styles.overlay, overlayStyle]}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={toggleMenu} />
                </Animated.View>
            )}

            {/* sliding Menu */}
            <Animated.View style={[styles.menuContainer, animatedMenuStyle]}>
                <View style={styles.menuHeader}>
                    <Text style={styles.menuTitle}>Menu</Text>
                    <TouchableOpacity onPress={toggleMenu}>
                        <Icon name="close" size={30} color='#000'/>
                    </TouchableOpacity>
                </View>
                <View style={styles.menuOptions}>
                    <TouchableOpacity>
                        <Text style={styles.menuOption}>Evpay Bus Locator</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* Footer Bar */}
            <Footer navigation={navigation} user={user} menu={toggleMenu}/>
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
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 1.0)', // making semitensparent
        zIndex: 5,
    },
    menuContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '50%',
        backgroundColor: '#50ff50',
        zIndex: 10,
        padding: 20,
        borderRadius: 10,
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    menuTitle: {
        color: '#000',
        fontSize: 24,
        fontWeight: 'bold',
    },
    menuOptions: {
        marginTop: 20,
    },
    menuOption: {
        color: '#000',
        fontSize: 18,
        marginVertical: 10,
    }
});

export default UserScreen;