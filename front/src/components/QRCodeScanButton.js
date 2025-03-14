import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Iconicons from "react-native-vector-icons/Ionicons";

const QRCodeScanButton = ({ navigation }) => {
    return(
        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("QRScanner")}
        >
            <Iconicons name="qr-code-outline" size={30} color="#000"/>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button:{
        position: "absolute",
        top: 40,
        right: 20,
        zIndex: 10,
    },
});

export default QRCodeScanButton;