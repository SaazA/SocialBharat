import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground
} from 'react-native';
import {useState} from 'react';
import React from 'react';
import {Picker} from '@react-native-picker/picker';
import colors from '../../constants/colors';

export default function SignUp({navigation}) {

  const onpressLogin = ()=>{
    navigation.navigate('LoginScreen');
  }
  const [selectedCommunity, setSelectedCommunity] = useState();
  return (
    <View style={styles.maincontainer}>
      <View style={styles.imagecontainer}>
        <Image
          source={require('../../assests/Signuppage.png')}
          resizeMode="cover"
          style={styles.image}
        />
      </View>
      <View style={styles.contentcontainer}>
        <Text style={styles.centerheadtext}>Sign Up</Text>
        <TextInput
          style={styles.inputbox}
          placeholder="Enter your name"></TextInput>
        <TextInput
          style={styles.inputbox}
          placeholder="Enter your number"></TextInput>
        <Picker
          selectedValue={selectedCommunity}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedCommunity(itemValue)
          }>
          <Picker.Item label="---Select Community---" value="" disabled />
          <Picker.Item label="Java" value="java" />
          <Picker.Item label="JavaScript" value="js" />
        </Picker>
        <TouchableOpacity style={styles.buttonbox}>
          <Text style={styles.buttontext}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.lefttextbox} onPress={onpressLogin}>
        <Text style={styles.text}>Already User? Login</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: colors.bgcolorSign_up_in,
  },
  imagecontainer: {
    flex: 0.5,
  },
  contentcontainer: {
    flex: 0.5,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  centerheadtext: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.black,
  },
  inputbox: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  buttonbox: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.RegisterandLoginButton,
  },
  buttontext: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  lefttextbox:{
    height: 40,
    marginLeft:15
  },
  text:{
    fontSize:18,
    fontWeight:'bold'
  }

});
