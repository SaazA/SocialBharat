import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useEffect } from 'react';
import colors from '../../constants/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { getHomePageData } from '../../apis/apicalls';



export default function Business() {
  return (
    <ScrollView>
    
    </ScrollView>
  )
}



const styles = StyleSheet.create({
  maincontaier:{
    backgroundColor:colors.RegisterandLoginButton,
    padding:15,
  }
})