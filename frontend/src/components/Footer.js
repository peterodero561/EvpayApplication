import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const Footer = ({navigation, user, menu}) => {
    return(
        <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('UserScreen')} style={styles.footerItem} >
                <Icon name="home" size={30} color='#007AFF' />
                <Text style={styles.footerText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile', { user: user })} style={styles.footerItem} >
                <Icon name="person" size={30} color='#8e8e8e' />
                <Text style={styles.footerText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={menu} style={styles.footerItem} >
                <Icon name="menu" size={30} color='#8e8e8e' />
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