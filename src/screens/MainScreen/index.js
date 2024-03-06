import { View, Text, ImageBackground ,StyleSheet} from 'react-native'
import React ,{ useEffect }from 'react';

export default function MainScreen({navigation}) {
   setTimeout(()=>{navigation.navigate('WelcomeScreen');
  },2000)
  return (
    <ImageBackground source={require('../../assests/mainScreenbg.jpg')} resizeMode="cover" style = {styles.image}>
  <Text style ={styles.text}>Social Bharat</Text>
    </ImageBackground>
  )
}


const styles = StyleSheet.create({ 
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
      justifyContent: 'center',
    },
    text: {
      color: 'white',
      fontSize: 42,
      lineHeight: 84,
      fontWeight: 'bold',
      textAlign: 'center',
      backgroundColor: '#000000c0',
    },
  });