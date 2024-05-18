import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { COLORS } from '../../Component/Constant/Color';
import Entypo from 'react-native-vector-icons/Entypo';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const SingleChat = () => {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);



  const navigation = useNavigation();
  const route = useRoute();
  const selectedUserData = route.params.selectedUserData;
  const { userData } = useSelector(state => state.User);

  // Dynamically generate roomId based on user IDs
  const generateRoomId = (userId1, userId2) => {
    const sortedIds = [userId1, userId2].sort();
    return sortedIds.join('');
  };

  const roomId = generateRoomId(userData.id, selectedUserData.id);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('ChatList')
      .doc(roomId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // data.map(item => console.log(item.message))
        setMessages(data);
      });

  }, [roomId]);

  const sendMsg = async (msg) => {
    const messageObject = {
      senderId: userData.id,
      receiverId: selectedUserData.id,
      message: msg,
      createdAt: new Date().toISOString(),
    };
    try {
      await firestore()
        .collection('ChatList')
        .doc(roomId)
        .collection('messages')
        .add(messageObject);

      setMsg('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }) => {
    const isSender = item.senderId === userData.id;
    return (
      <View style={{ marginVertical: 5, marginHorizontal: 10, alignSelf: isSender ? 'flex-end' : 'flex-start' }}>
        <Text style={{ backgroundColor: isSender ? COLORS.theme : COLORS.white, color: isSender ? COLORS.white : COLORS.black, padding: 10, borderRadius: 10, maxWidth: '70%' }}>
          {item.message}
        </Text>
      </View>
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerContainer} >
          <Image
            source={{ uri: selectedUserData?.img }}
            style={styles.headerImage}
          />
          <Text style={styles.headerText}>{selectedUserData.name}</Text>
        </View >
      ),
    });
  }, [selectedUserData]);

  return (
    <View style={styles.container}>
      {/* <ChatHeader data={selectedUserData} /> */}
      <ImageBackground
        source={require('../../Assets/images/Background.jpg')}
        style={{ flex: 1 }}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={{ flexGrow: 1 }}
          inverted
        />
      </ImageBackground>
      <View style={styles.msgTextBox}>
        <TextInput
          style={styles.msgText}
          placeholder="Type a message"
          placeholderTextColor={COLORS.black}
          multiline={true}
          value={msg}
          onChangeText={(value) => setMsg(value)}
        />
        <TouchableOpacity onPress={() => sendMsg(msg)}>
          <Entypo name='paper-plane' color={COLORS.white} size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SingleChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  msgTextBox: {
    backgroundColor: COLORS.theme,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    justifyContent: 'space-evenly',
  },
  msgText: {
    backgroundColor: COLORS.white,
    width: '80%',
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: COLORS.white,
    paddingHorizontal: 15,
    color: COLORS.black,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  headerImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold'
  },
});
