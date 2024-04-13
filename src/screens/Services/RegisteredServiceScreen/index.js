import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { getServicesRegisteredByUser } from '../../../apis/apicalls'
import { useSelector } from 'react-redux'

export default function RegisteredServicesUser() {

  const token = useSelector(state=>state.AuthReducer.authToken)
  const getUserRegisteredServices = ()=>{
    getServicesRegisteredByUser(token)
    .then((response)=>{
      console.log(response)
    })
    .catch((error)=>{
      console.log(error)
    })
  }

  useEffect(()=>{
    getUserRegisteredServices()
  },[])
  return (
    <View>
      <Text>RegisteredServicesUser</Text>
    </View>
  )
}

const styles = StyleSheet.create({})