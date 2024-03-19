import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useEffect } from 'react';
import colors from '../../constants/colors';
import { ScrollView } from 'react-native-gesture-handler';
export default function Business() {
  useEffect(()=>{
    getData();
  },[])


  const [data,setData]=useState([]);

  const getData = async () =>{
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("https://jsonplaceholder.typicode.com/posts", requestOptions)
      .then(response => response.json())
      .then(result => setData(result))
      .catch(error => console.log('error', error));
  }
  return (
    <ScrollView>
    <View style={styles.maincontaier}>
      {data.map(item=>(
        <View key={item.id}>
          <Text>{item.title}</Text>
          <Text>{item.id}</Text>
          </View>
      ))}
    </View>
    </ScrollView>
  )
}



const styles = StyleSheet.create({
  maincontaier:{
    backgroundColor:colors.RegisterandLoginButton,
    padding:15,
  }
})