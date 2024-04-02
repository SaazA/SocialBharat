import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import colors from '../../../constants/colors'
import { Dropdown } from 'react-native-element-dropdown'

const AddMatrimonial = () => {
    const [personalValue, setPersonalValue] = useState(null);
    const ProfileCreatingOptions = [
        {label:'Self' , value:'self'},
        {label:'Brother' , value:'brother'},
        {label:'Sister' , value:'sister'},
        {label:'Son' , value:'son'},
        {label:'Daughter' , value:'daughter'},
    ]
    const handlePersonalValue = (selectedItem)=>{
        setPersonalValue(selectedItem);
        handlePersonalValueDropdown(selectedItem);
    }
    const handlePersonalValueDropdown = (selectedItem)=>{
        console.log(selectedItem.label);
        console.log(selectedItem.value);
    }
  return (
    <View style={styles.mainContainer}>
      <View><Text>Matrimonial Info</Text></View>
      <View>
        <Text>For Whom, You are creating profile</Text>
        <Dropdown
        style={styles.dropdown}
        data={ProfileCreatingOptions}
        itemTextStyle={styles.itemTextStyle}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        value={personalValue}
        placeholder="Select item"
        labelField="label"
         valueField="value"
         onChange={handlePersonalValue}
        />
      </View>
    </View>
  )
}



const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        margin:10,
        backgroundColor:colors.grayLight
    },
    dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
      },
      placeholderStyle: {
        fontSize: 16,
      },
      selectedTextStyle: {
        fontSize: 16,
        color:colors.black
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      itemTextStyle:{
        color:colors.black
      }
})

export default AddMatrimonial