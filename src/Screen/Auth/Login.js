import React, { useState } from 'react';
import { View, Text, StatusBar, StyleSheet, Dimensions, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS } from '../../Component/Constant/Color';
import { FONTS } from '../../Component/Constant/Font';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { setUser } from '../../Redux/reducer/user';
import { useDispatch } from 'react-redux';





const { width, height } = Dimensions.get('window');

const Login = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();


  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const loginUser = async () => {

    try {
      const querySnapshot = await firestore()
        .collection('Users')
        .where('emailId', '==', email)
        .get()

      querySnapshot.forEach(doc => {
        const userData = doc.data();
        // console.log(userData)
        if (userData.password === pass && userData.emailId === email) {
          // console.log(`Logged in user: ${userData.name}`);
          Alert.alert('Login Successfully!!!')
          dispatch(setUser(userData));

        } else {
          console.log('Invalid Credential!!!')
        }
      });
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.lightgray }}>
      <StatusBar backgroundColor={COLORS.theme} barStyle="light-content" hidden={false} />
      <View style={styles.uppercard}>
        <Image style={styles.logo} source={require('../../Assets/images/developerSin.jpg')} />
        <Text style={styles.title}>DEVELOPERS' SIN</Text>
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
                value={pass}
                onChangeText={(value) => setPass(value)} />
            </View>
            {/*  */}
            <TouchableOpacity style={styles.btn} onPress={loginUser}>
              <Text style={styles.btnText}>Login Now</Text>
            </TouchableOpacity>
            {/*  */}
            <View style={styles.footer}>
              <Text style={styles.smallTxt}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[styles.smallTxt, styles.link]}>Register Now</Text>
              </TouchableOpacity>
            </View>
            {/*  */}
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default Login;

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
