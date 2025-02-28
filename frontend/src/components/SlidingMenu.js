import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Animated, { useAnimatedStyle, withTiming} from "react-native-reanimated";

const SlidingMenu = ({ menuVisible, toggleMenu }) => {
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
                    <TouchableOpacity>
                        <Text style={styles.menuOption}>Evpay Bus Locator</Text>
                    </TouchableOpacity>
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