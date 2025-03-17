import React, { useEffect, useState} from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Camera, CameraView } from "expo-camera";


const QRScannerScreen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        const getCameraPermission = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
            console.log("Camera permission status: ", status);
        };
        getCameraPermission();
    }, []);

    const handleBarCodeScanned = ({ type, data}) => {
        console.log("Qr code scanned - Type: ", type, "Data: ", data);
        setScanned(true);
        // scanned QRcode will have info
        try{
            const scannedData = JSON.parse(data);
            console.log("parsed data: ", { seat: scannedData });
            navigation.navigate("FarePayment", scannedData);
        } catch (error){
            console.error("Parse Error: ", error);
            console.error("RAW DATA THAT FAILED: ", data);
            setTimeout(() => setScanned(false), 5000);
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
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            >
                <View style={styles.overlay}>
                    <Text style={styles.overlayText}>Scan QR Code</Text>
                </View>
                <View style={styles.buttonContainer}>
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
    buttonContainer: {
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        backgroundColor: '#50ff50',
        color: 'black',
        fontWeight: 'bold'
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    overlayText: {
        color: "white",
        fontSize: 20,
    },
});

export default QRScannerScreen;
