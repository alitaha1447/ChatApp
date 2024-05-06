import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStack from './src/Navigation/AuthStack';
import AppStack from './src/Navigation/AppStack';
import { Provider, useSelector } from 'react-redux';
import store from './src/Redux/Store';



const Stack = createStackNavigator();

const App = () => {



  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </Provider>
  );
}


function AppContent() {

  const { login } = useSelector(state => state.User);
  console.log('Login : ' + login)

  return (
    <Stack.Navigator>
      {!login ? (
        <Stack.Screen name='AuthStack' component={AuthStack} options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name='AppStack' component={AppStack} options={{ headerShown: false }} />
      )}

    </Stack.Navigator>
  )
}

export default App;