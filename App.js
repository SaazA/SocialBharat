/**
 * Sample React Native App
 * https://github.com/facebook/react-native
*
* @format
*/

import 'react-native-gesture-handler';
import React from 'react';
import { useState } from 'react';
 
import RootNav from './src/navigation/RootNav';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import store, { persistor } from './src/redux/store';





const App = () =>{
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
   <RootNav/>
   </PersistGate>
   </Provider>
)
}


export default App;
