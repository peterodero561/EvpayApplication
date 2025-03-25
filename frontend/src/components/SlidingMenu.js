import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Animated, { useAnimatedStyle, withTiming} from "react-native-reanimated";

const SlidingMenu = ({ menuVisible, toggleMenu, user, navigation }) => {
    // Animated styles for menu
    const animatedMenuStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: withTiming(menuVisible ? 0 : 300, {duration: 300}),
            },
        ],
    }));

    const overlayStyle = useAnimatedStyle(() => ({
        opacity: withTiming(menuVisible ? 0.5 : 0, { duration: 300}),
    }));

    // Defin menu options based on user role
    const menuOptions = [
        {id: 1, title: "Evpay Bus Locator", roles: ['user', 'driver'], screen: "BusLocator"},
        {id: 2, title: "Garages", roles: ["driver", 'garage manager'], screen: "Garage"},
        {id: 3, title: "Payment", roles: ["user", "driver", "garage manager"], screen: "Payment"},
    ];

    return(
        <>
            {/* Overlay when menu is visible */}
            {menuVisible && (
                <Animated.View style={[styles.overlay, overlayStyle]}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={toggleMenu}/>
                </Animated.View>
            )}

            {/* Sliding Menu */}
            <Animated.View style={[styles.menuContainer, animatedMenuStyle]}>
                <View style={styles.menuHeader}>
                    <Text style={styles.menuTitle}>Menu</Text>
                    <TouchableOpacity onPress={toggleMenu}>
                        <Icon name="close" size={30} color="#000" />
                    </TouchableOpacity>
                </View>
                <View style={styles.menuOptions}>
                    {menuOptions
                        .filter((option) => option.roles.includes(user?.userRole))
                        .map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                onPress={() => {
                                    toggleMenu(); // close menu
                                    navigation.navigate(option.screen, {user: user})
                                }}
                                >
                                <Text style={styles.menuOption}>{option.title}</Text>
                            </TouchableOpacity>
                        ))}
                </View>
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 1.0)",
        zIndex: 5,
    },
    menuContainer: {
        backgroundColor: '#50ff50',
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: "50%",
        zIndex: 10,
        padding: 20,
        borderRadius: 5,
    },
    menuHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    menuTitle: {
        color: '#000',
        fontSize: 24,
        fontWeight: "bold",
    },
    menuOptions: {
        marginTop: 20,
    },
    menuOption: {
        color: "#000",
        fontSize: 18,
        marginVertical: 10,
        fontWeight: "bold",
        borderRadius: 5,
    },
});

export default SlidingMenu;