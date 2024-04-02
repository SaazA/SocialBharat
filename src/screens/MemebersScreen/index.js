import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { getPartnermatrimonial } from '../../apis/apicalls';
import { useSelector } from 'react-redux';
import colors from '../../constants/colors';

export default function Members() {
  const [partnerData, setPartnerData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const token = useSelector((state) => state.AuthReducer.authToken);
  const userInfo = useSelector((state) => state.UserReducer.userData);
  const community_id = userInfo.data.community_id;

  const getpartnersmatrimonial = (
    text,
    page,
    state,
    city,
    gender,
    gotra,
    cast,
    subcastId
  ) => {
   
    try {
      getPartnermatrimonial(
        token,
        text,
        page,
        community_id,
        state,
        city,
        gender,
        gotra,
        cast,
        subcastId
      )
        .then((response) => {
          setPartnerData((prevData) => {
            const newData = {...prevData};
            response.data.users.forEach(user => {
              newData[user.id] = user;
            });
            return newData;
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getpartnersmatrimonial('', currentPage);
  }, []);

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    ) {
      setCurrentPage((prevPage) => prevPage + 1);
      getpartnersmatrimonial(
        searchText,
        currentPage + 1
      );
    }
  };

  return (
    <ScrollView onScroll={handleScroll}>
      <View style={styles.maincontainer}>
        <View style={styles.innercontainer}>
          <TextInput
            style={{ borderWidth: 1 }}
            onChangeText={(text) => {
              setSearchText(text);
              setPartnerData([]);
              setCurrentPage(1); 
              getpartnersmatrimonial(text, 1);
            }}
            value={searchText}
          />
          <Text>HEY</Text>
          <Text>HEY</Text>
          <Text>HEY</Text>
          <Text>HEY</Text>
          <Text>HEY</Text>
          <Text>HEY</Text>
          <Text>HEY</Text>
          <Text>HEY</Text>
          <Text>HEY</Text>
          <Text>HEY</Text>
          <Text>HEY</Text>
          <Text>HEY</Text>
          <Text>HEY</Text>
          <Text>HEY</Text>
          {Object.keys(partnerData).length > 0 ? (
  Object.keys(partnerData).map(userId => (
    <View key={userId}>
      <Text style={{ backgroundColor: 'blue', color: 'black' }}>{partnerData[userId].name}</Text>
    </View>
  ))
) : (
  <View>
    <Text>NO DATA AVAILABLE</Text>
  </View>
)}

        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
  },
  innercontainer: {
    backgroundColor: colors.grayLight,
    flex: 1,
    margin: 15,
    borderRadius: 10,
  },
});
