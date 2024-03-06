import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function Home({navigation}) {

  const handleOnPress = ()=>{
    navigation.navigate('JobsScreen');
  }
  return (
    <View style={{backgroundColor:'green' , flex:1}}>
      <TouchableOpacity onPress={handleOnPress}>
      <Text>HomeScreen</Text>
      </TouchableOpacity>
    </View>
  )
}