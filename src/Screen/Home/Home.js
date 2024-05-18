import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Alert, FlatList, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { COLORS } from '../../Component/Constant/Color';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const [allUser, setAllUser] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await firestore().collection('Users').get();
        const usersArray = [];
        querySnapshot.forEach(doc => {
          const userData = doc.data();
          usersArray.push(userData);
        });
        setAllUser(usersArray);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUsers();
  }, []);

  const renderItem = ({ item }) => {
    console.log(item)
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => Alert.alert('Hi')}
        activeOpacity={0.7}>
        <Image
          source={{ uri: item.img }}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.subtitleText} numberOfLines={1}>{item.emailId}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' backgroundColor={COLORS.theme} />
      <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        data={allUser}
        renderItem={renderItem}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AllUser')}
        activeOpacity={0.8}>
        <Feather name='user' size={24} color='white' />
      </TouchableOpacity>
    </View >
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4'
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitleText: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.theme,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
