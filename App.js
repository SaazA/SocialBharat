/**
 * Sample React Native App
 * https://github.com/facebook/react-native
*
* @format
*/

import 'react-native-gesture-handler';
import React from 'react';
import { useState } from 'react';
import { AuthContext, AuthProvider } from './src/context/AuthContext';
import AppNav from './src/navigation/AppNav';





const App = () =>{

  return (
    <AuthProvider>
   <AppNav/>
    </AuthProvider>
)
}


export default App;
