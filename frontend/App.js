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
import { ActivityIndicator, View } from 'react-native';
import { API_BASE_URL } from "@env";

const Stack = createStackNavigator();

export default function App() {
  const [isAuthonticated, setIsAuthonticated] = useState(null);

  useEffect(() => {
    const chekSession = async () => {
      const token = await AsyncStorage.getItem('authToken');

      if (token) {
        try {
          const response = await axios.get(`${API_BASE_URL}/auth/check_session`, {
            headers: { Authorization: `Bearer ${token}`}
          });

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
      <Stack.Navigator>
          <Stack.Screen name='UserScreen' component={UserScreen}/>
          <Stack.Screen name='Profile' component={ProfileScreen}/>
          <Stack.Screen name='EditProfile' component={EditProfileScreen}/>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name='Login' component={LoginScreen}/>
          <Stack.Screen name='Register' component={RegisterScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}