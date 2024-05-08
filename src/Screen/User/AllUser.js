import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, StatusBar, FlatList, Alert, TouchableOpacity, Image, TextInput } from 'react-native';
import { COLORS } from '../../Component/Constant/Color';
import AntDesign from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';

const AllUser = () => {

  const { userData } = useSelector(state => state.User);

  const [allUser, setAllUser] = useState();
  const [search, setSearch] = useState('');
  const [searchFilter, setSearchFilter] = useState('')

  const navigation = useNavigation();

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      const querySnapshot = await firestore().collection('Users').get();
      const usersArray = [];
      querySnapshot.forEach(doc => {
        const userData = doc.data();
        usersArray.push(userData);
      });
      setAllUser(usersArray.filter((item) => item.id !== userData.id)); // Set the fetched data into state
      setSearchFilter(usersArray.filter((item) => item.id !== userData.id))
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  const createChatList = (data) => {
    navigation.navigate('SingleChat', { selectedUserData: data }); // navigate to SingleChatScreen and transfer data as a props
    // navigation.navigate('ChatScreen', { selectedUserData: data }); // navigate to SingleChatScreen and transfer data as a props
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => createChatList(item)} style={styles.itemContainer} activeOpacity={0.7}>
        <Image
          source={{ uri: item.img }}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.nameText}>{item.emailId}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  const buttonSearch = (search) => {
    const filter = search.trim() === '' ? allUser : allUser.filter(user => user.name.toLowerCase().includes(search.toLowerCase()));
    console.log(filter);
    setSearchFilter(filter)
  }

  const textSearch = (search) => {
    if (search.trim() === '') {
      setSearchFilter(allUser)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.theme} />
      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Search by name..."
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            textSearch(text);
          }}
          style={styles.searchInput}
          placeholderTextColor="#666"
        />
        <TouchableOpacity onPress={() => buttonSearch(search)} style={styles.searchIcon}>
          <AntDesign name="search1" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={searchFilter}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default AllUser;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    paddingRight: 30, // add padding to prevent text from being hidden behind the icon
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    color: 'black',
  },
  searchIcon: {
    position: 'absolute',
    right: 20,
    padding: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    marginHorizontal: 10,
    marginTop: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
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
});