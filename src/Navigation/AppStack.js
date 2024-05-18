import React from 'react';
import { Alert, TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../Redux/reducer/user';
import { COLORS } from '../Component/Constant/Color';
import Home from '../Screen/Home/Home';
import AllUser from '../Screen/User/AllUser';
import SingleChat from '../Screen/Home/SingleChat';


const Stack = createStackNavigator();

const AppStack = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.User); // Destructuring
  // const  userData  = useSelector(state => state.User.userData)

  const handleLogOut = () => {
    dispatch(logOut());
  }

  const HeaderTitle = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={{ uri: userData.img }} style={styles.avatar} />
        <Text style={{ fontSize: 18, marginRight: 10, color: COLORS.theme, fontWeight: '900' }}>{userData.name}</Text>
      </View>
    )
  }
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name='Home' component={Home} options={{
        headerRight: () => (
          <TouchableOpacity onPress={handleLogOut}>
            <AntDesign name='logout' size={24} color={'black'} />
          </TouchableOpacity>
        ),
        headerTitle: HeaderTitle
      }} /> */}
      <Stack.Screen name='AllUser' component={AllUser} options={{
        headerRight: () => (
          <TouchableOpacity onPress={handleLogOut} style={{ paddingRight: 10 }}>
            <AntDesign name='logout' size={24} color={'black'} />
          </TouchableOpacity>
        ),
        headerTitle: HeaderTitle
      }} />
      <Stack.Screen name='SingleChat' component={SingleChat} />

    </Stack.Navigator>
  )
}

export default AppStack;
const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
});