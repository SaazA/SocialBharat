import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../../constants/colors';
import {Dropdown} from 'react-native-element-dropdown';
import moment from 'moment';
import {
  getCastes,
  getCities,
  getPartnermatrimonial,
  getState,
} from '../../../apis/apicalls';
import {useSelector} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Matrimonial({navigation}) {
  const token = useSelector(state => state.AuthReducer.authToken);
  const userInfo = useSelector(state => state.UserReducer.userData);
  const community_id = userInfo.data.community_id;
  const [stateData, setStateData] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [gender, setGender] = useState(null);
  const [selectedStateIdandName, setSelectedStateIdandName] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCityIdandName, setSelectedCityIdandName] = useState(null);
  const [subCastes, setSubCastes] = useState(null);
  const [gotra, setGotra] = useState(null);
  const [slectedCasteidAndName, setSlectedCasteidAndName] = useState(null);
  const [slectedCaste, setSlectedCaste] = useState(null);
  const [slectedSubCasteId, setSelectedSubCasteId] = useState(null);
  const [partnerData, setPartnerData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataLoadedforgender, setDataLoadedforgender] = useState(false);
  const [dataLoadedforState, setDataLoadedforState] = useState(false);
  const [dataLoadedforCity, setDataLoadedforCity] = useState(false);
  const [dataLoadedforCaste, setDataLoadedforCaste] = useState(false);
  const [partnerDataFetching, setPartnerDataFetching] = useState(true);

  const getpartnersmatrimonial = (
    text,
    page,
    state,
    city,
    gender,
    gotra,
    cast,
    subcastId,
  ) => {
    setPartnerDataFetching(true);
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
      subcastId,
    )
      .then(response => {
        setPartnerDataFetching(false);
        setPartnerData(prevData => {
          const newData = {...prevData};
          response.data.users.forEach(user => {
            newData[user.id] = user;
          });
          return newData;
        });
      })
      .catch(error => {
        console.log(error);
        setPartnerDataFetching(false);
      });
  };
  useEffect(() => {
    getpartnersmatrimonial(
      searchText,
      1,
      selectedState,
      selectedCity,
      gender,
      gotra,
      '',
      slectedSubCasteId,
    );
  }, [
    searchText,
    currentPage,
    selectedState,
    selectedCity,
    gender,
    gotra,
    slectedSubCasteId,
  ]);

  const handleScroll = event => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const paddingToBottom = 20;
    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    ) {
      // Use the updated currentPage value directly
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      getpartnersmatrimonial(
        searchText,
        nextPage, // Use nextPage here
        selectedState,
        selectedCity,
        gender,
        gotra,
        '',
        slectedSubCasteId,
      );
    }
  };

  const genderoptions = [
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
    {label: 'other', value: ''},
  ];

  const handleGenderDropDown = item => {
    setGender(item.value);
    setCurrentPage(1);
    setPartnerData([]);
    getpartnersmatrimonial(
      searchText,
      1,
      selectedState,
      selectedCity,
      item.value,
      gotra,
      slectedCaste,
      slectedSubCasteId,
    );
    setDataLoadedforgender(true);
  };
  const handleClearClickGender = () => {
    setGender(null);
    setDataLoadedforgender(false);
  };

  const getCitiesData = stateId => {
    try {
      getCities(token, stateId)
        .then(response => {
          console.log('Cities' + response.data);
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
    setCurrentPage(1);
    setPartnerData([]);
    setSelectedCityIdandName(selectedItem);
    handleCityIdAndName(selectedItem);
  };

  const handleClearCityDropdown = () => {
    setSelectedCity(null);
    setSelectedCityIdandName(null);
    setDataLoadedforCity(false);
  };
  const handleCityIdAndName = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = cityData.find(city => city.id === selectedId)?.name;
    setSelectedCity(selectedName);
    getpartnersmatrimonial(
      searchText,
      1,
      selectedState,
      selectedName,
      gender,
      gotra,
      '',
      slectedSubCasteId,
    );
    console.log('Selected Name:', selectedName);
    console.log('Selected ID:', selectedId);
    setDataLoadedforCity(true);
  };
  const getStateData = () => {
    try {
      getState(token)
        .then(response => {
          console.log('States' + response.data);
          setStateData(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handleStateDropdown = selectedItem => {
    setCurrentPage(1);
    setPartnerData([]);
    setSelectedStateIdandName(selectedItem);
    handlecountrydropdown(selectedItem);
  };

  const handleClearStateDropdown = () => {
    setSelectedState(null);
    setSelectedStateIdandName(null);
    setDataLoadedforState(false);
    setCityData(null);
  };
  const handlecountrydropdown = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = stateData.find(
      country => country.id === selectedId,
    )?.name;
    setSelectedState(selectedName);
    console.log('Selected Name:', selectedName);
    console.log('Selected ID:', selectedId);
    getpartnersmatrimonial(
      searchText,
      1,
      selectedName,
      selectedCity,
      gender,
      gotra,
      '',
      slectedSubCasteId,
    );
    getCitiesData(selectedId);
    setDataLoadedforState(true);
  };
  const countriesdropdownOptions = stateData
    ? stateData.map(state => ({
        label: state.name,
        value: state.id.toString(),
      }))
    : [];

  useEffect(() => {
    getStateData();
  }, []);
  const getSubCastesData = () => {
    try {
      getCastes(token)
        .then(response => {
          console.log('Subcastes' + response.data);
          setSubCastes(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const subCastesDropDownOption = subCastes
    ? subCastes.map(subCastes => ({
        label: subCastes.subcast,
        value: subCastes.subcast_id.toString(),
      }))
    : [];
  const handleSubcasteDropDown = selectedItem => {
    setSlectedCasteidAndName(selectedItem);
    setCurrentPage(1);
    setPartnerData([]);
    handleSubcastes(selectedItem);
  };
  const handleSubcastes = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = subCastes.find(
      subCastes => subCastes.subcast_id === selectedId,
    )?.subcast;
    setSelectedSubCasteId(selectedId);
    setSlectedCaste(selectedName);
    getpartnersmatrimonial(
      searchText,
      1,
      selectedState,
      selectedCity,
      gender,
      gotra,
      '',
      selectedId,
    );
    console.log('Selected Name:', selectedName);
    console.log('Selected ID:', selectedId);
    setDataLoadedforCaste(true);
  };
  const handleClearCasteDropdown = () => {
    setDataLoadedforCaste(false);
    setSelectedSubCasteId(null);
    setSlectedCaste(null);
    setSlectedCasteidAndName(null);
  };
  useEffect(() => {
    getSubCastesData();
  }, []);

  const navigateToViewMatrimonial = (partnerId, partnerName) => {
    navigation.navigate('ViewMatrimonial', {
      partnerId: partnerId,
      partnerName: partnerName,
    });
  };

  const navigateToChatScreen = (partnerId, partnerName) => {
    navigation.navigate('ChatScreenMatrimonial', {
      partnerId: partnerId,
      partnerName: partnerName,
    });
  };

  // const clearValues = ()=>{
  //   handleClearCasteDropdown();
  //   handleClearCityDropdown();
  //   handleClearClickGender();
  //   handleClearStateDropdown();
  // }
  // const handleNoDataAlert = () => {
  //   Alert.alert(
  //     'No Data',
  //     'No data is available.',
  //     [{ text: 'OK' }],
  //     { cancelable: false }
  //   );
  // };

  return (
    <ScrollView onScroll={handleScroll} style={styles.maincontainer}>
      <View style={styles.container}>
        <View style={styles.headingcontainer}>
          <Text style={styles.headingcontainertext}> Search Partner</Text>
        </View>
        <View style={styles.dropdownoutsidecontainer}>
          <Dropdown
            style={styles.dropdown}
            data={genderoptions}
            search // Enable search functionality
            itemTextStyle={styles.itemTextStyle}
            placeholderStyle={styles.placeholderStyle}
            inputSearchStyle={styles.searchTextInput}
            selectedTextStyle={styles.selectedTextStyle}
            labelField="label"
            valueField="value"
            maxHeight={300}
            placeholder={'--Select-Gender--'}
            searchPlaceholder="Search..."
            value={gender}
            onChange={handleGenderDropDown}
            renderRightIcon={() => {
              if (dataLoadedforgender && gender !== null) {
                return (
                  <FontAwesome5
                    name="trash"
                    color={colors.orange}
                    size={20}
                    onPress={handleClearClickGender}
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
          {stateData && (
            <Dropdown
              style={styles.dropdown}
              data={countriesdropdownOptions}
              search
              inputSearchStyle={styles.searchTextInput}
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
                  // Show the broom icon only if data has been loaded and a gender is selected
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
            inputSearchStyle={styles.searchTextInput}
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
          <Dropdown
            style={styles.dropdown}
            data={subCastesDropDownOption}
            search
            inputSearchStyle={styles.searchTextInput}
            itemTextStyle={styles.itemTextStyle}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            value={slectedCasteidAndName}
            placeholder="--Select Subcast--"
            labelField="label"
            valueField="value"
            onChange={handleSubcasteDropDown}
            renderRightIcon={() => {
              if (dataLoadedforCaste && slectedSubCasteId !== null) {
                return (
                  <FontAwesome5
                    name="trash"
                    color={colors.orange}
                    size={20}
                    onPress={handleClearCasteDropdown}
                  />
                );
              } else {
                return (
                  <FontAwesome5
                    name="caret-down"
                    color={colors.blue}
                    size={28}
                  />
                ); // Hide the broom icon initially
              }
            }}
          />

          <View style={styles.addMatrimonialContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddMatrimonial')}>
              <Text style={styles.addMatrimonialbutton}>
                Add Matrimonial Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* {(searchData.length > 0 ? searchData : partnerData).map((item) => (
        <View key={item.id}>
          <Text style={{ backgroundColor: colors.orange, color: 'black' }}>{item.name}</Text>
        </View>
      ))} */}

        <View style={styles.searchboxinput}>
          <FontAwesome5 name="search" color={colors.gray} size={24} />
          <TextInput
            style={styles.searchbox}
            placeholder="Search By Name"
            placeholderTextColor={colors.black}
            onChangeText={text => {
              setPartnerData([]);
              setSearchText(text);
              setCurrentPage(1);
              getpartnersmatrimonial(
                searchText,
                1,
                selectedState,
                selectedCity,
                gender,
                gotra,
                '',
                slectedSubCasteId,
              );
            }}
            value={searchText}
          />
        </View>

        {Object.keys(partnerData).length > 0 ? (
          Object.keys(partnerData).map(userId => {
            return (
              <View key={userId} style={styles.cardContainer}>
                <View style={styles.card}>
                  <View style={styles.cardphotocontainer}>
                    <Image
                      style={styles.cardImage}
                      source={
                        partnerData[userId].proposal_photos !== null &&
                        partnerData[userId].proposal_photos.length > 0
                          ? {uri: partnerData[userId].proposal_photos[0]}
                          : require('../../../assests/nullphotocover.jpg')
                      }
                    />
                  </View>
                  <View style={styles.cardcontentcontainer}>
                    <Text style={styles.cardnamecentercontainer}>
                      {partnerData[userId].name}
                    </Text>
                    <Text style={styles.cardtextcontent}>
                      Education-
                      {partnerData[userId].highest_qualification !== null
                        ? partnerData[userId].highest_qualification
                        : 'N/A'}
                    </Text>
                    <Text style={styles.cardtextcontent}>
                      Age-
                      {partnerData[userId].matrimonial_profile_dob !== null
                        ? Math.floor(
                            moment().diff(
                              partnerData[userId].matrimonial_profile_dob,
                              'years',
                              true,
                            ),
                          )
                        : 'N/A'}
                    </Text>
                    <Text style={styles.cardtextcontent}>
                      City-{partnerData[userId].native_place_city}(
                      {partnerData[userId].native_place_state})
                    </Text>
                  </View>
                  <View style={styles.cardBottomContainer}>
                    <View>
                      <TouchableOpacity
                        style={styles.iconbottomcontainer}
                        onPress={() =>
                          navigateToChatScreen(
                            partnerData[userId].id,
                            partnerData[userId].name,
                          )
                        }>
                        <Image
                          source={require('../../../assests/chatMessageWallpaper.jpeg')}
                          style={styles.chatIcon}
                        />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={() =>
                          navigateToViewMatrimonial(
                            partnerData[userId].id,
                            partnerData[userId].name,
                          )
                        }
                        style={styles.viewbuttoncontainer}>
                        <Text style={{fontSize: 15.5, color: '#198754'}}>
                          VIEW
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        ) : partnerDataFetching ? (
          <View>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <View>
            <Text> No Data Available</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    backgroundColor: colors.white,
  },
  headingcontainer: {
    alignItems: 'center',
    backgroundColor: '#e1e8e3',
    borderRadius: 20,
    margin: 10,
  },
  headingcontainertext: {
    color: colors.black,
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    margin: 15,
  },
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: colors.black,
    borderBottomWidth: 0.5,
  },
  searchTextInput: {
    color: colors.black,
  },
  icon: {
    marginRight: 5,
  },
  chatIcon: {
    width: 30,
    height: 30,
  },
  nodataavailabiltytext: {
    color: colors.black,
    fontSize: 20,
  },
  placeholderStyle: {
    fontSize: 16,
    color: colors.black,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: colors.black,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  itemTextStyle: {
    color: colors.black,
    fontSize: 18,
  },
  dropdownoutsidecontainer: {
    marginTop: 10,
    backgroundColor: colors.white,
    elevation: 25,
    borderRadius: 15,
  },
  addMatrimonial: {
    backgroundColor: colors.orange,
    width: 200,
  },
  addMatrimonialbutton: {
    textAlign: 'center',
    color: colors.black,
  },
  addMatrimonialContainer: {
    backgroundColor: '#ffc107',
    marginTop: 30,
    height: 40,
    justifyContent: 'center',
    margin: 10,
    elevation: 25,
    marginBottom: 20,
  },
  searchbox: {
    color: colors.black,
  },
  searchboxinput: {
    marginTop: 20,
    margin: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    paddingLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#198754',
    borderRadius: 10,
  },
  cardContainer: {},
  card: {
    marginTop: 15,
    flex: 1,
    marginBottom: 15,
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 10,
  },
  cardnamecentercontainer: {
    fontWeight: 'bold',
    color: colors.black,
    fontSize: 22,
    marginBottom: 5,
  },
  cardphotocontainer: {
    flex: 0.5,
    margin: 10,
    alignItems: 'center',
  },
  cardImage: {
    width: 150,
    height: 120,
    borderRadius: 150,
  },
  cardtextcontent: {
    color: colors.black,
    fontSize: 18,
    margin: 5,
    marginLeft: 20,
    backgroundColor: '#dee2e6',
  },
  cardcontentcontainer: {
    flex: 0.5,
    margin: 10,
    padding: 10,
  },
  cardBottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 20,
  },
  viewbuttoncontainer: {
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconbottomcontainer: {
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
