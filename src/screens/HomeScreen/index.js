import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import routes from '../../constants/routes';



export default function Home({navigation}) {
  const [data, setupdatedData] = useState();
useEffect(()=>{
  getData();
},[])
const getData = async () =>{
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("https://jsonplaceholder.typicode.com/posts/1", requestOptions)
    .then(response => response.json())
    .then(result => setupdatedData(result))
    .catch(error => console.log('error', error));
    console.log("HSHSGSGSG"+data);
}
  const handleOnPress = ()=>{
    navigation.navigate(routes.JOBSSCREEN);
  }
  return (
    <View style={{backgroundColor:'green' , flex:1}}>
      <TouchableOpacity onPress={handleOnPress}>
      <Text>{data ? data.title : "Loading..."}</Text>
      <Text>{data ? data.body : "Loading..."}</Text>
      </TouchableOpacity>
    </View>
  )
}
