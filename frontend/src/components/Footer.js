import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";

const Footer = ({navigation, user, menu, menuVisible}) => {
    // get the current route name from react navigation
    const route = useRoute()

    // Function to return the appropriate color base on active route
    const getIconColor = (screenName) => {
        return route.name === screenName ? '#007AFF' : '#8e8e8e';
    };

    return(
        <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('UserScreen', { user: user })} style={styles.footerItem} >
                <Icon name="home" size={30} color={getIconColor('UserScreen')} />
                <Text style={styles.footerText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile', { user: user })} style={styles.footerItem} >
                <Icon name="person" size={30} color={getIconColor('Profile')} />
                <Text style={styles.footerText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={menu} style={styles.footerItem} >
                <Icon name="menu" size={30} color={menuVisible ? "#007AFF": "#8e8e8e"} />
                <Text style={styles.footerText}>Menu</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
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

export default Footer;