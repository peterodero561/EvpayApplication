import React, {use, useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen'
import UserScreen from './src/screens/Profile/UserScreen';
import ProfileScreen from './src/screens/Profile/ProfileScreen';
import EditProfileScreen from './src/screens/Profile/EditProfileScreen';
import AllActivitiesScreen from './src/screens/Profile/AllActivitiesScreen';
import FarePaymentScreen from './src/screens/Payments/FarePaymentScreen';
import QRScannerScreen from './src/screens/Payments/QRScannerScreen';
import ConfirmationScreen from './src/screens/Payments/ConfirmationScreen';
import BusInformationScreen from './src/screens/Profile/BusInformationScreen';
import GarageInformationScreen from './src/screens/Profile/GarageInformation';
import { ActivityIndicator, View } from 'react-native';
import { API_BASE_URL } from "@env";

const Stack = createStackNavigator();

export default function App() {
  const [isAuthonticated, setIsAuthonticated] = useState(null);

  // // clear async storage
  // useEffect(() => {
  //   const clearStorage= async () => {
  //     await AsyncStorage.clear();
  //     console.log("Async Storage cleared on startup!");
  //   };
  //   clearStorage();
  // }, []);

  useEffect(() => {
    const chekSession = async () => {
      const stored_token = await AsyncStorage.getItem('authToken');
      console.log("Stored token:", stored_token);
      const token = stored_token || null;

      if (token) {
        try {
          const headers = token ? { Authorization: `Bearer ${token}`} : {}; 
          const response = await axios.get(`${API_BASE_URL}/auth/check_session`, {headers});

          if (response.status === 200) {
            setIsAuthonticated(true); // user is logged in
          } else {
            setIsAuthonticated(false); //user not loggeg in
            await AsyncStorage.removeItem('authToken');
          }
        } catch (error){
          console.log('Session check failed: ', error);
          setIsAuthonticated(false);
          await AsyncStorage.removeItem('authToken');
        }
      } else {
        setIsAuthonticated(false);
      }
    };

    chekSession();
  }, []);

  if (isAuthonticated === null){
    return(
      <View style={{ flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size='large' color='#0000ff'/>
      </View>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name='UserScreen' component={UserScreen}/>
          <Stack.Screen name='Profile' component={ProfileScreen}/>
          <Stack.Screen name='EditProfile' component={EditProfileScreen}/>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name='Login' component={LoginScreen}/>
          <Stack.Screen name='Register' component={RegisterScreen}/>
          <Stack.Screen name='AllActivities' component={AllActivitiesScreen}/>
          <Stack.Screen name='FarePayment' component={FarePaymentScreen}/>
          <Stack.Screen name='QRScanner' component={QRScannerScreen}/>
          <Stack.Screen name='Confirm' component={ConfirmationScreen} />
          <Stack.Screen name='BusInformation' component={BusInformationScreen} />
          <Stack.Screen name='GarageInformation' component={GarageInformationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}