import {View, Text, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {getCities, getMembers, getPartnermatrimonial, getState} from '../../apis/apicalls';
import {useSelector} from 'react-redux';
import colors from '../../constants/colors';
import {Dropdown} from 'react-native-element-dropdown';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
export default function Members() {
  const [partnerData, setPartnerData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const token = useSelector(state => state.AuthReducer.authToken);
  const userInfo = useSelector(state => state.UserReducer.userData);
  const community_id = userInfo.data.community_id;

  // =============

  const [searchText, setSearchText] = useState('');
  const [selectedState, setSelectedState] = useState(null);
  const [membersData,setMembersData] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCityIdandName, setSelectedCityIdandName] = useState(null);
  const [dataLoadedforState, setDataLoadedforState] = useState(false);
  const [selectedStateIdandName, setSelectedStateIdandName] = useState(null);
  const [dataLoadedforCity, setDataLoadedforCity] = useState(false);
  const [stateData, setStateData] = useState(null);
  const [cityData, setCityData] = useState(null);




  const getMembersData = (text , page,state , city) => {
    getMembers(token,text,page,state,city )
      .then(response => {
        console.log(response.data.data.users)
        setMembersData(prevData => {
          const newData = {...prevData};
          response.data.data.users.forEach(user => {
            newData[user.id] = user;
          });
          return newData;
        });
      })
      .catch(error => {
        console.log(error);
      });
  };





  const getStateData = () => {
    getState(token)
      .then(response => {
        console.log('States' + response.data);
        setStateData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getCitiesData = stateId => {
    try {
      getCities(token, stateId)
        .then(response => {
          console.log('Cities' + response);
          setCityData(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const cityDropDownOptions = cityData
    ? cityData.map(city => ({
        label: city.name,
        value: city.id.toString(),
      }))
    : [];
  const handleCityDropDown = selectedItem => {
    setSelectedCityIdandName(selectedItem);
    handleCityIdAndName(selectedItem);
    console.log(selectedItem);
    setDataLoadedforCity(true);
  };

  const handleClearCityDropdown = () => {
    getMembersData(searchText,1,selectedState,selectedCity);
    setSelectedCity(null);
    setSelectedCityIdandName(null);
    setDataLoadedforCity(false);
  };
  const handleCityIdAndName = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = cityData.find(city => city.id === selectedId)?.name;
    setSelectedCity(selectedName);
    setMembersData([])
    getMembersData(searchText,1,selectedState,selectedName);
  };

  const handleStateDropdown = selectedItem => {
    setSelectedStateIdandName(selectedItem);
    handleSelectedStates(selectedItem);
  };

  const handleClearStateDropdown = () => {
    setSelectedState(null);
    setSelectedStateIdandName(null);
    setDataLoadedforState(false);
    setSelectedCity(null);
    setSelectedCityIdandName(null);
    setCityData(null);
    getMembersData(searchText,1,selectedState,selectedCity);
  };
  const handleSelectedStates = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = stateData.find(state => state.id === selectedId)?.name;
    setSelectedState(selectedName);
    console.log('Selected Name:', selectedName);
    console.log('Selected ID:', selectedId);
    getCitiesData(selectedId);
    setDataLoadedforState(true);
    setMembersData([])
    getMembersData(searchText,1,selectedName,selectedCity);
  };

  const statedropdownOptions = stateData
    ? stateData.map(state => ({
        label: state.name,
        value: state.id.toString(),
      }))
    : [];

  useEffect(() => {
    getMembersData(searchText,currentPage,selectedState,selectedCity);
  }, []);

  //===============
 

  useEffect(() => {
 
    getStateData()
  }, []);

  const handleScroll = event => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const paddingToBottom = 20;
    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    ) {
      setCurrentPage(prevPage => prevPage + 1);
      getMembersData(searchText, currentPage + 1,selectedState,selectedCity);
    }
  };

  useEffect(() => {
    // Fetch members data whenever there's a change in searchText, selectedState, or selectedCity
    setMembersData([]); // Clear membersData
    getMembersData(searchText, 1, selectedState, selectedCity);
  }, [searchText, selectedState, selectedCity]); // Trigger effect when searchText, selectedState, or selectedCity changes
  

  return (
    <ScrollView onScroll={handleScroll}>
      <View style={styles.maincontainer}>
        <View style={styles.innercontainer}>
          
        <TextInput
            style={{borderWidth: 1}}
            onChangeText={text => {
              setMembersData([])
              getMembersData(text,1,selectedState,selectedCity);
              setSearchText(text);
            }}
            value={searchText}></TextInput>
          <View>
            {stateData && (
              <Dropdown
                style={styles.dropdown}
                data={statedropdownOptions}
                search
                itemTextStyle={styles.itemTextStyle}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                value={selectedStateIdandName}
                placeholder="--Select state--"
                labelField="label"
                valueField="value"
                onChange={handleStateDropdown}
                renderRightIcon={() => {
                  if (dataLoadedforState && selectedState !== null) {
                    return (
                      <FontAwesome5
                        name="trash"
                        color={colors.orange}
                        size={20}
                        onPress={handleClearStateDropdown}
                      />
                    );
                  } else {
                    return (
                      <FontAwesome5
                        name="caret-down"
                        color={colors.blue}
                        size={28}
                      />
                    );
                  }
                }}
              />
            )}
            <Dropdown
              style={styles.dropdown}
              data={cityDropDownOptions}
              search
              itemTextStyle={styles.itemTextStyle}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              value={selectedCityIdandName}
              placeholder="--Select city--"
              labelField="label"
              valueField="value"
              onChange={handleCityDropDown}
              renderRightIcon={() => {
                if (dataLoadedforCity && selectedCity !== null) {
                  return (
                    <FontAwesome5
                      name="trash"
                      color={colors.orange}
                      size={20}
                      onPress={handleClearCityDropdown}
                    />
                  );
                } else {
                  return (
                    <FontAwesome5
                      name="caret-down"
                      color={colors.blue}
                      size={28}
                    />
                  );
                }
              }}
            />
          </View>

          {membersData && Object.keys(membersData).length > 0 ? (
          Object.keys(membersData).map(userId => {
            return (
              <View key={userId} style={styles.cardContainer}>
                <View style={styles.card}>
                  <View style={styles.cardcontentcontainer}>
                    <Text style={styles.cardnamecentercontainer}>
                      {membersData[userId].name}
                    </Text>
                  </View>
                 
                </View>
              </View>
            );
          })
        ):(
          <View>
         <Text> No Data Available</Text>
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
  dropdown:{
    margin:60
  }
});
