import {
  View,
  Text,
  StyleSheet,
  Image,
  PanResponder,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

import routes from '../../constants/routes';
import colors from '../../constants/colors';
export default function WelcomeScreen({navigation}) {

  const onPressSignin=() =>{
  navigation.navigate(routes.LOGIN);
  }
  const onPressSignUp=() =>{
    navigation.navigate(routes.SIGNUP)
    }
  return (
    <View style={styles.maincontainer}>
      <StatusBar backgroundColor={colors.statusbarcolor}/>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assests/WelcomeScreen.png')}
          resizeMode="cover"
          style={styles.image}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.headertext}>Hello</Text>
        <Text style={styles.text}>Welcome to Social Bharat!</Text>
        <Text style={styles.text}>One stop for all your needs!</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onPressSignin}>
            <Text style={styles.buttonText}>Sign-In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onPressSignUp}>
            <Text style={styles.buttonText}>Sign-Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },

  imageContainer: {
    flex: 0.5,
    margin: 15,
  },
  contentContainer: {
    flex: 0.5,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  headertext: {
    fontWeight: 'bold',
    fontSize: 50,
    textAlign: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 20,
  },
  button: {
    backgroundColor: colors.loginlogoutbutton,
    width: 100,
    height: 40,
    borderRadius: 30,
    display:'flex',
    justifyContent:'center'
  },
  buttonText: {
    textAlign: 'center',
  },
});
