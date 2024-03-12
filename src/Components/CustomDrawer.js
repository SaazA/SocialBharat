import { View, Text, ImageBackground,Image } from 'react-native'
import React, { useContext } from 'react'

import { DrawerContentScrollView,DrawerItemList } from '@react-navigation/drawer';
import colors from '../constants/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../context/AuthContext';



const CustomDrawer = (props) => {
    const {logout} = useContext(AuthContext);
    const {userInfo} = useContext(AuthContext);
  return (
    <View style = {{flex:1}}>
<DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor:colors.bgColor}}>
<Image source={require('../assests/sb-logo.png')} style={{margin:10, height:90,width:'95%'}}></Image>
<Image source={{ uri: userInfo.data.photo }} style={{marginLeft:15,height:80,width:80,borderRadius:40}}/>
<Text style={{fontSize:18, padding:10}}>{userInfo.data.name}</Text>

<View style={{flex:1,backgroundColor:'#fff',paddingTop:10}}>
<DrawerItemList {...props}/>
</View>
</DrawerContentScrollView>  
<View style={{padding:20,borderTopWidth:1,borderTopColor:'#ccc'}}>
    <TouchableOpacity style={{paddingVertical:15}}>
        <Text style={{color:colors.RegisterandLoginButton}}>Refer a Friend</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={()=>{logout()}}>
    <Text style={{color:colors.RegisterandLoginButton}}>SignOut</Text>
    </TouchableOpacity>
</View>
</View>
)
}

export default CustomDrawer