import React, { use, useEffect, useState} from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from 'expo-barcode-scanner';


const QRScannerScreen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data}) => {
        // scanned QRcode will have info
        let scannedData;
        try{
            scannedData = JSON.parse(data);
        } catch (error){
            console.error("Error acessing JSON data: ", error);
            return
        }
        // if sucessfull in passing data
        navigation.navigate("FarePayment", scannedData);
    }

    if (hasPermission === null){
        return <Text>Requesting for camera permision ...</Text>;
    }
    if (hasPermission === false){
        return <Text>No access to camera</Text>;
    }

    return(
        <View style={styles.container}>
            <BarCodeScanner onBarCodeScanned={handleBarCodeScanned} style={StyleSheet.absoluteFillObject}/>
            <Button title="Cancel" onPress={() => navigation.goBack()}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default QRScannerScreen;