import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { COLORS } from '../../Component/Constant/Color';
import Entypo from 'react-native-vector-icons/Entypo';
import ChatHeader from '../../Component/Header/ChatHeader';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import uuid from 'react-native-uuid';
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
    // console.log(userId1)
    // console.log(userId2)
    const sortedIds = [userId1, userId2].sort();
    // console.log(sortedIds)
    return sortedIds.join('');
  };

  const roomId = generateRoomId(userData.id, selectedUserData.id);
  // console.log(roomId)

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('ChatList')
      .doc(roomId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        console.log('SingleChat')
        console.log(snapshot.docs)
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('---------------')
        console.log(data);
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
      headerTitle: selectedUserData.name // Set header title dynamically
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
      <View style={{ backgroundColor: COLORS.theme, elevation: 5, flexDirection: 'row', alignItems: 'center', paddingVertical: 7, justifyContent: 'space-evenly' }}>
        <TextInput
          style={{ backgroundColor: COLORS.white, width: '80%', borderRadius: 25, borderWidth: 0.5, borderColor: COLORS.white, paddingHorizontal: 15, color: COLORS.black }}
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
});
