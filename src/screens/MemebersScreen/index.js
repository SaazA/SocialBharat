import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useEffect } from 'react';


export default function Members() {
 useEffect (()=>{
getData();
 },[])

const [data,setData] = useState([]);
  const getData =async()=>{
      var requestOptions ={
        method:'GET',
        redirect:'follow'
      };
  
      fetch("http://192.168.255.11:3000/users",requestOptions)
      .then(response =>response.json())
      .then(result=>{
        setData(result)
        console.log(data+"dbchb");
      })
      .catch(error=> console.log('error' , error));

  }
  return (
    <View>
      <Text>index</Text>
    </View>
  )
}