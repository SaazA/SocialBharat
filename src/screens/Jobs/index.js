import { View, Text ,FlatList, StyleSheet} from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../../constants/colors';

export default function JobsScreen() {
 useEffect(()=>{
  getData();
 },[])

  const [data, setData] = useState([]);
  const getData= async()=>{
    var requestOptions ={
      method:'GET',
      redirect:'follow'
    };

    fetch("https://jsonplaceholder.typicode.com/posts",requestOptions)
    .then(response =>response.json())
    .then(result=>{
      setData(result)
      console.log(data+"dbchb");
    })
    .catch(error=> console.log('error' , error));
  }

const renderItem = ({item})=>{

  return(
    <View style={styles.itemcontainer} key={item.id}>
      <Text>{item.id}</Text>
      <Text>{item.body}</Text>
    </View>
  )}
  return (
    <View style={styles.maincontainer}>
      {
        data.length?
        <FlatList
        data={data}
       renderItem={renderItem}
       />
        :
        <View><Text>"Loading The FlatList"</Text>
      </View>
      }
    </View>
  )
}


const styles= StyleSheet.create({
maincontainer:{
backgroundColor:colors.RegisterandLoginButton,
flex:1,
alignItems:'center',
justifyContent:'center'
},
itemcontainer:{
  borderBottomColor:'#ccc',
  borderBottomWidth:1,
  padding:10,
}
})