import React from "react";
import {View, Text, StyleSheet, Button} from 'react-native';
import { PanGestureHandler } from "react-native-gesture-handler";
import QRCodeScanButton from "../components/QRCodeScanButton";

const HomeScreen = ({ navigation }) => {

    const handleGesture = (event) => {
      const {translationX, translationY} = event.nativeEvent;
      if (translationX > 100) {
        // Navigate to Login on a right swipe
        navigation.navigate('Login');
      }
      if (translationX > -100) {
        // Navigate to Login on a left swipe
        navigation.navigate('Login');
      }
      if (translationY > -100) {
        // Navigate to Login on an up swipe
        navigation.navigate('Login');
      }
    }

    return (
    <PanGestureHandler onGestureEvent={handleGesture}>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* {<Text style={styles.backButton} onPress={() => navigation.goBack()}>&larr;</Text>} */}
          <View style={styles.titleBorder}>
            <Text style={styles.title}>EVPay</Text>
          </View>
          {/* QR scan button positioned at the top right */}
          <QRCodeScanButton navigation={navigation}/>
        </View>
      </View>
    </PanGestureHandler>
    );
};

// Stylesheet for the component
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000',
    },
    titleBorder: {
      borderRadius: 500,
      borderWidth: 8,
      borderColor: '#50ff50',
      padding:20,
      marginTop: 180,
    },
  });
  
export default HomeScreen;
