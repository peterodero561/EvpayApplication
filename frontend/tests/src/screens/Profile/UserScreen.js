import React, { act, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import Carousel from 'react-native-reanimated-carousel';
import Icon from "react-native-vector-icons/Ionicons";
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const UserScreen = ({navigation}) => {

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
                height={400} // Provide height for the carousel
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
                    <Text style={styles.menuOption}>Option 1</Text>
                    <Text style={styles.menuOption}>Option 2</Text>
                    <Text style={styles.menuOption}>Option 3</Text>
                    <Text style={styles.menuOption}>Option 4</Text>
                </View>
            </Animated.View>

            {/* Footer Bar */}
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('UserScreen')} style={styles.footerItem} >
                    <Icon name="home" size={30} color='#007AFF' />
                    <Text style={styles.footerText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.footerItem} >
                    <Icon name="person" size={30} color='#8e8e8e' />
                    <Text style={styles.footerText}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleMenu} style={styles.footerItem} >
                    <Icon name="menu" size={30} color='#8e8e8e' />
                    <Text style={styles.footerText}>Menu</Text>
                </TouchableOpacity>
            </View>
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
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 10,
    },
    footerItem: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        marginTop: 5,
        color: '#8e8e8e',
    },
});

export default UserScreen;