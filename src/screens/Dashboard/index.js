import {View, Text, StyleSheet , Image} from 'react-native';
import React from 'react';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import colors from '../../constants/colors';


const cardcontainerupper =(colorcode)=> ({
  backgroundColor: colorcode,
  display:'flex',
  flexDirection:'row',
  justifyContent:'space-between',
  margin: 10,
  height: 70,
  marginBottom: 0,
  borderTopRightRadius: 50,
});

const cardcontainerlower=(colorcode)=>( {
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
});

const Dashboard = () => {
  
  const card_data  =  [
    {
      color : colors.danger,
      card_title : "Card-1",
      card_title_main : "Main Title -1",
      cart_view_action   : "View-1",
      cart_edit_action : "Edit-1",
      card_icon_file  : require('../../assests/activities.png')
    },
    {
      color : colors.RegisterandLoginButton,
      card_title : "Card-2",
      card_title_main : "Main Title -1",
      cart_view_action   : "View-1",
      cart_edit_action : "Edit-1",
      card_icon_file  : require('../../assests/activities.png')
    },
    {
      color : colors.danger,
      card_title : "Card-1",
      card_title_main : "Main Title -1",
      cart_view_action   : "View-1",
      cart_edit_action : "Edit-1",
      card_icon_file  : require('../../assests/activities.png')
    },
    {
      color : colors.danger,
      card_title : "Card-1",
      card_title_main : "Main Title -1",
      cart_view_action   : "View-1",
      cart_edit_action : "Edit-1",
      card_icon_file  : require('../../assests/activities.png')
    },
    {
      color : colors.danger,
      card_title : "Card-1",
      card_title_main : "Main Title -1",
      cart_view_action   : "View-1",
      cart_edit_action : "Edit-1",
      card_icon_file  : require('../../assests/activities.png')
    },
    {
      color : colors.danger,
      card_title : "Card-1",
      card_title_main : "Main Title -1",
      cart_view_action   : "View-1",
      cart_edit_action : "Edit-1",
      card_icon_file  : require('../../assests/activities.png')
    },
  ]

  // const smallText = [
  //   Profile,
  //   BecomeSocial,
  //   Matrimonial,
  //   Business,

  // ]
  return (
    <ScrollView>
      {card_data.map((el, index)=>(
    <View>
        <View style={cardcontainerupper(el.color)}>
          <View style={styles.cardcontainerupperleft}>
            <Text style={styles.cardtextsmall}>{el.card_title}</Text>
            <Text style={styles.cardtextbig}>{el.card_title_main}</Text>
          </View>
          <View style={styles.cardcontainerupperright}><Image source={el.card_icon_file} resizeMode="cover" style={styles.image}></Image></View>
        </View>
        <View style={cardcontainerlower(el.color)}>
          <View style={styles.cardcontainerlowerleft}>
            <TouchableOpacity>
              <Text>{el.cart_view_action}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardcontainerlowerright}>
            <TouchableOpacity>
              <Text>{el.cart_edit_action}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      ))}
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  cardcontainer: {},
  cardcontainerupper: {
    backgroundColor: colors.RegisterandLoginButton,
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    margin: 10,
    height: 70,
    marginBottom: 0,
    borderTopRightRadius: 50,
  },
  cardcontainerlower: {
    backgroundColor: colors.RegisterandLoginButton,
    margin: 10,
    height: 50,
    display:'flex',
    borderTopColor:'black',
    borderTopWidth:1,
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop: 0,
    borderBottomLeftRadius: 30,
  },
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
