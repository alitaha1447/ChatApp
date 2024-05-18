import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, StyleSheet, Dimensions, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS } from '../../Component/Constant/Color';
import { FONTS } from '../../Component/Constant/Font';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import uuid from 'react-native-uuid';
import firestore from '@react-native-firebase/firestore';
import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';


const { width, height } = Dimensions.get('window');

const Register = () => {

  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imgName, setImgName] = useState('');



  const isName = (inputString) => {
    return inputString.match(/[a-zA-Z]/g)
  }

  const isEmail = (inputString) => {
    return inputString.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/g);
  };

  const isPassword = (inputString) => {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/.test(inputString);
  }

  const validateFields = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('All fields are required!');
      return false;
    }

    if (!isName(name)) {
      Alert.alert('No numeric value only alpha');
      return false;
    }

    if (!isEmail(email)) {
      Alert.alert('Invalid emailId format');
      return false;
    }

    if (!isPassword(password)) {
      Alert.alert('Invalid password');
      return false;
    }

    return true;
  };

  const registerUser = async () => {

    // const emailExists = async () => {
    //   const querySnapshot = await firestore().collection('Users').where('emailId', '==', email).get();

    //   return !querySnapshot.empty; // It will return false if no emailId exists else true if exists
    // }

    const imageUrl = await uploadImageToStorage(imgName, imageUri); // Upload image and get URL

    if (validateFields()) {
      try {
        // if (emailExists()) {
        //   Alert.alert('Email already in use. Please use a different email.');
        //   return;
        // }

        {
          let data = {
            id: uuid.v4(),
            name: name.trim(),
            emailId: email.trim(),
            password: password,
            img: imageUrl // Store the URL obtained from storage
          };

          await firestore()
            .collection('Users')
            .add(data);

          Alert.alert('Registration Successfully Done!!!');
          navigation.navigate('Login');
          // Clear the fields after registration
          setName('');
          setEmail('');
          setPassword('');
        }
      } catch (error) {
        console.error('Error registering user: ', error);
        Alert.alert('Failed to register');
      }
    }
  };

  const uploadImageToStorage = async (fileName, uri) => {

    try {
      const reference = storage().ref(fileName);
      // const pathToFile = `${utils.FilePath.PROFILE_PIC}/${uri}`;
      await reference.putFile(uri); // Use the uri directly
      const url = await reference.getDownloadURL();
      console.log('Uploaded Image URL:', url);
      return url;
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload failed:', error.message);
    }
  }

  const selectImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.5
    });
    if (!result.didCancel && result.assets && result.assets[0].uri) {
      const uri = result.assets[0].uri;
      setImageUri(uri); // Set image to state to display in the UI
      const fileName = result.assets[0].fileName;
      setImgName(fileName);
    } else {
      setImageUri(null); // Ensure it resets to null if the selection is canceled or fails
    }
  }

  return (

    <View style={{ flex: 1, backgroundColor: COLORS.lightgray }}>
      <StatusBar backgroundColor={COLORS.theme} barStyle="light-content" hidden={false} />
      <View style={styles.uppercard}>
        <TouchableOpacity onPress={selectImage}>
          <View style={styles.container}>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.heading}>Register</Text>
            <Text style={styles.subHeading}>Fill out all fields to register your account</Text>
            {/*  */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIconView}>
                <FontAwesome6 name="person" style={styles.icon} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter Full Name"
                placeholderTextColor={COLORS.liteBlack}
                value={name}
                onChangeText={(value) => setName(value)} />
            </View>
            {/*  */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIconView}>
                <MaterialCommunityIcons name="gmail" style={styles.icon} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter Email Id"
                placeholderTextColor={COLORS.liteBlack}
                value={email}
                onChangeText={(value) => setEmail(value)} />
            </View>
            {/*  */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIconView}>
                <Ionicons name="key" style={styles.icon} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter Password"
                placeholderTextColor={COLORS.liteBlack}
                secureTextEntry={true} // Initially hide password
                value={password}
                onChangeText={(value) => setPassword(value)} />
            </View>
            {/*  */}
            <TouchableOpacity style={styles.btn} onPress={registerUser}>
              <Text style={styles.btnText}>Register Now</Text>
            </TouchableOpacity>
            {/*  */}
            <View style={styles.footer}>
              <Text style={styles.smallTxt}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.smallTxt, styles.link]}>Login Now</Text>
              </TouchableOpacity>
            </View>
            {/*  */}
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  uppercard: {
    height: height / 4,
    backgroundColor: COLORS.theme,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: height / 8,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  title: {
    color: '#fff',
    fontFamily: FONTS.Bold,
    fontSize: 25,
    marginTop: 10,
  },
  container: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    width: width - 40,
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },

  heading: {
    fontFamily: FONTS.Bold,
    fontSize: 20,
    marginBottom: 10,
  },
  subHeading: {
    color: COLORS.gray,
    marginBottom: 20,
  },
  inputContainer: {
    borderRadius: 30,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginBottom: 10,
    elevation: 2,
  },

  inputIconView: {
    width: 40,
    borderRadius: 30,
    height: '100%', // Cover the entire height of the input container
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: COLORS.theme,
  },
  icon: {
    color: 'white',
    fontSize: 18,
    marginRight: 10,

  },
  input: {
    flex: 1,
    fontFamily: FONTS.Regular,
    fontSize: 20,
    color: COLORS.black,
    paddingVertical: 8,
  },
  btn: {
    backgroundColor: COLORS.theme,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
    width: '50%',
    alignSelf: 'center'
  },
  btnText: {
    color: '#fff',
    fontFamily: FONTS.Bold,
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  smallTxt: {
    fontFamily: FONTS.Regular,
    fontSize: 16,
    color: COLORS.gray,
  },
  link: {
    color: COLORS.theme,
    marginLeft: 5,
  },
});
