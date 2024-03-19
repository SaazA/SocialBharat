import { View, Text ,FlatList, StyleSheet , ScrollView , Image , TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../../constants/colors';



const  cardcontainerupper=(colorcode)=> ({
  backgroundColor: colorcode,
  display:'flex',
  flexDirection:'row',
  justifyContent:'space-between',
  margin: 10,
  height: 70,
  marginBottom: 0,
  borderTopRightRadius: 50,
})

const cardcontainerlower = (colorcode)=>({
  backgroundColor: colorcode,
  margin: 10,
  height: 50,
  display:'flex',
  borderTopColor:'black',
  borderTopWidth:1,
  flexDirection:'row',
  justifyContent:'space-between',
  marginTop: 0,
  borderBottomLeftRadius: 30,
})

export default function JobsScreen() {

    const card_Data = [
      {
        card_color:colors.bgColor,
        card_title : "Private",
        card_title_main:"Business",
        card_photo:require('../../assests/activities.png'),
        card_left_nav:"View",
        card_right_nav:"Edit",
      },
      {
        card_color:colors.bgColor,
        card_title : "Private",
        card_title_main:"Business",
        card_photo:require('../../assests/activities.png'),
        card_left_nav:"View",
        card_right_nav:"Edit",
      },
      {
        card_color:colors.bgColor,
        card_title : "Private",
        card_title_main:"Business",
        card_photo:require('../../assests/activities.png'),
        card_left_nav:"View",
        card_right_nav:"Edit",
      },
      {
        card_color:colors.bgColor,
        card_title : "Private",
        card_title_main:"Business",
        card_photo:require('../../assests/activities.png'),
        card_left_nav:"View",
        card_right_nav:"Edit",
      },
      {
        card_color:colors.bgColor,
        card_title : "Private",
        card_title_main:"Business",
        card_photo:require('../../assests/activities.png'),
        card_left_nav:"View",
        card_right_nav:"Edit",
      },
      {
        card_color:colors.bgColor,
        card_title : "Private",
        card_title_main:"Business",
        card_photo:require('../../assests/activities.png'),
        card_left_nav:"View",
        card_right_nav:"Edit",
      },
      {
        card_color:colors.bgColor,
        card_title : "Private",
        card_title_main:"Business",
        card_photo:require('../../assests/activities.png'),
        card_left_nav:"View",
        card_right_nav:"Edit",
      },
      {
        card_color:colors.bgColor,
        card_title : "Private",
        card_title_main:"Business",
        card_photo:require('../../assests/activities.png'),
        card_left_nav:"View",
        card_right_nav:"Edit",
      },
      {
        card_color:colors.bgColor,
        card_title : "Private",
        card_title_main:"Business",
        card_photo:require('../../assests/activities.png'),
        card_left_nav:"View",
        card_right_nav:"Edit",
      },

    ]
  return (
       <ScrollView>
        {card_Data.map((el, index)=>(
          <View>
    <View style={cardcontainerupper(el.card_color)}>
          <View style={styles.cardcontainerupperleft}>
            <Text style={styles.cardtextsmall}>{el.card_title}</Text>
            <Text style={styles.cardtextbig}>{el.card_title_main}</Text>
          </View>
          <View style={styles.cardcontainerupperright}><Image  source={el.card_photo} resizeMode="cover" style={styles.image}></Image></View>
        </View>
        <View style={cardcontainerlower(el.card_color)}>
          <View style={styles.cardcontainerlowerleft}>
            <TouchableOpacity>
              <Text>{el.card_left_nav}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardcontainerlowerright}>
            <TouchableOpacity>
              <Text>{el.card_right_nav}</Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
 ))}
    </ScrollView>

  )
}



const styles = StyleSheet.create({
  cardcontainer: {},
  cardcontainerupperleft:{
    margin:10
  },
  cardcontainerupperright:{
  margin:10
  },
  image:{
    margin:10,
    width:40,
    height:40
  },
  cardtextsmall:{

  },
  cardtextbig:{
    fontSize:20,
    textAlign:'center'
  },
  cardcontainerlowerleft:{
    margin:10
  },
  cardcontainerlowerright:{
    margin:10
  }
  

});