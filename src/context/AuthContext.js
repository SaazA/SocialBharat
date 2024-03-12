import { View, Text } from 'react-native'
import React, { createContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../apis/urls';


export const AuthContext=createContext();


export const AuthProvider = ({children})=>{
    const [isLoading,setIsLoading]=useState(false);
    const [userToken, setUserToken]=useState(null);
    const [userInfo, setUserInfo]=useState(null);

    const login = (mobile , password)=>{
        setIsLoading(true);
        axios.post(`${BASE_URL}/login-by-password`,{
            mobile,
            password
        })
        .then(res=>{
            let userInfo = res.data;
            setUserInfo(userInfo);
            setUserToken(userInfo.token.token);
            AsyncStorage.setItem('userInfo',JSON.stringify(userInfo));
            AsyncStorage.setItem('userToken',userInfo.token.token)
            console.log(userInfo);
            console.log("TTTTTTTTTTTTTTT"+userInfo.token.token);
        })
        .catch(e=> {
            console.log(e);
        });
        // setUserToken('fdhfsdhf');
        setIsLoading(false);
    }


    const logout = ()=>{
        setIsLoading(true);
        setUserToken(null);
        AsyncStorage.removeItem('userInfo');
        AsyncStorage.removeItem('userToken');
        setIsLoading(false);
    }

    const isLoggedIn = async ()=>{
        try {
            setIsLoading(true);
            let userInfo = await AsyncStorage.getItem('userInfo');
            let userToken = await AsyncStorage.getItem('userToken');
            userInfo = JSON.parse(userInfo);

            if(userInfo){
                setUserToken(userToken)
                setUserInfo(userInfo)
            }
            setIsLoading(false);
        } catch (error) {
            console.log("Error from is Logged-in" + error);
        }
    }

    useEffect(()=>{
        isLoggedIn();
    },[])
    return(
        <AuthContext.Provider value={{login,logout,isLoading,userToken , userInfo}}>
            {children}
        </AuthContext.Provider>
    );
}