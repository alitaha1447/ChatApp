import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../Screen/Auth/Login';
import Register from '../Screen/Auth/Register';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default AuthStack