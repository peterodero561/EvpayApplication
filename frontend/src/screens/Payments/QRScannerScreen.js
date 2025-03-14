import React, { useEffect, useState} from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Camera } from "expo-camera";
import { CameraView } from "expo-camera";


const QRScannerScreen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        const getCameraPermission = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        };
        getCameraPermission();
    }, []);

    const handleBarCodeScanned = ({ type, data}) => {
        setScanned(true);
        // scanned QRcode will have info
        try{
            const scannedData = JSON.parse(data);
            navigation.navigate("FarePayment", scannedData);
        } catch (error){
            console.error("Error acessing JSON data: ", error);
            return
        }
    };

    if (hasPermission === null){
        return <Text>Requesting for camera permision ...</Text>;
    }
    if (hasPermission === false){
        return <Text>No access to camera</Text>;
    }

    return(
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barCodeTypes: ["qr", "pdf417"],
                }}
            >
                <View style={styles.buttonConainer}>
                    <Button title="Cancel" onPress={() => navigation.goBack()}/>
                </View>
            </CameraView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonConainer: {
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        backgroundColor: '#50ff50',
        color: 'black',
        fontWeight: 'bold'
    },
});

export default QRScannerScreen;