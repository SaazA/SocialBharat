import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {
  getCities,
  getMembers,
  getPartnermatrimonial,
  getState,
} from '../../../apis/apicalls';
import {useSelector} from 'react-redux';
import moment from 'moment';
import colors from '../../../constants/colors';
import {Dropdown} from 'react-native-element-dropdown';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import routes from '../../../constants/routes';
export default function Members({navigation}) {
  const [currentPage, setCurrentPage] = useState(1);
  const token = useSelector(state => state.AuthReducer.authToken);
  const userInfo = useSelector(state => state.UserReducer.userData);
  const community_id = userInfo.data.community_id;

  const [searchText, setSearchText] = useState('');
  const [selectedState, setSelectedState] = useState(null);
  const [membersData, setMembersData] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCityIdandName, setSelectedCityIdandName] = useState(null);
  const [dataLoadedforState, setDataLoadedforState] = useState(false);
  const [selectedStateIdandName, setSelectedStateIdandName] = useState(null);
  const [dataLoadedforCity, setDataLoadedforCity] = useState(false);
  const [stateData, setStateData] = useState(null);
  const [cityData, setCityData] = useState(null);

  const [hasNoData, setHasNoData] = useState(false);

  const [isFetching, setIsFetching] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);

  const getMembersData = (text, page, state, city) => {
    if (isFetching) {
      console.log('Already fetching data, skipping new request');
      return; // Prevent multiple fetches
    }

    setIsFetching(true);
    setHasNoData(false);
    setApiFailed(false);

    // console.log('Fetching data with params:', {text, page, state, city});

    getMembers(token, text, page, state, city)
      .then(response => {
        const users = response.data.data.users;
        // console.log('Fetched users:', users);
        console.log(response.data.data.totalFilteredRecords);

        if (users.length < 1) {
          setHasNoData(true);
          console.log('No users returned from API');
        }

        setPageCount(response.data.data.totalFilteredRecords);

        setMembersData(prevData => {
          // Filter out duplicates based on unique ID
          const newMembers = users.filter(
            user => !prevData.some(prevMember => prevMember.id === user.id),
          );

          console.log('Filtered new members:', newMembers);

          return [...prevData, ...newMembers]; // Append only new, non-duplicate members
        });
      })
      .catch(error => {
        // console.log('Error fetching members:', error);
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setApiFailed(true);
      })
      .finally(() => {
        setIsFetching(false);
        console.log('Finished fetching data');
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getStateData();
    setMembersData([]);
    getMembersData(searchText, 1, selectedState, selectedCity);
    setRefreshing(false);
  }, []);

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
    getCities(token, stateId)
      .then(response => {
        console.log('Cities' + response);
        setCityData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
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
    setSelectedCity(null);
    setSelectedCityIdandName(null);
    setDataLoadedforCity(false);
    setCurrentPage(1);
  };
  const handleCityIdAndName = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = cityData.find(city => city.id === selectedId)?.name;
    setSelectedCity(selectedName);
    setMembersData([]);
    getMembersData(searchText, 1, selectedState, selectedName);
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
    setCurrentPage(1);
  };
  const handleSelectedStates = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = stateData.find(state => state.id === selectedId)?.name;
    setSelectedState(selectedName);
    console.log('Selected Name:', selectedName);
    console.log('Selected ID:', selectedId);
    getCitiesData(selectedId);
    setDataLoadedforState(true);
    setMembersData([]);
  };

  const statedropdownOptions = stateData
    ? stateData.map(state => ({
        label: state.name,
        value: state.id.toString(),
      }))
    : [];

  useEffect(() => {
    setMembersData([]);
    getMembersData(searchText, 1, selectedState, selectedCity);
  }, [searchText, selectedState, selectedCity]);

  useEffect(() => {
    getStateData();
  }, []);

  const handleScroll = event => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const paddingToBottom = 20;

    if (
      !isFetching &&
      layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
    ) {
      console.log('Reached Bottom: Attempting to fetch more data');

      if (!isFetching && currentPage == Math.ceil(pageCount / 20)) {
        setHasNoData(true);
        console.log('No more pages to fetch');
      } else {
        const nextPage = currentPage + 1;
        console.log('Fetching page:', nextPage);
        setCurrentPage(nextPage);
        getMembersData(searchText, nextPage, selectedState, selectedCity);
      }
    }
  };

  return (
    <View>
      <ScrollView
        onScroll={handleScroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {membersData && stateData && !apiFailed ? (
          <View style={styles.innercontainer}>
            <View style={styles.searchboxinput}>
              <FontAwesome5 name="search" color={'#ffc107'} size={24} />
              <TextInput
                style={styles.searchbox}
                placeholder="Search By Name"
                placeholderTextColor={colors.black}
                onChangeText={text => {
                  setMembersData([]);
                  setCurrentPage(1);
                  getMembersData(text, 1, selectedState, selectedCity);
                  setSearchText(text);
                }}
                value={searchText}
              />
            </View>
            <View style={styles.dropdownoutsidecontainer}>
              <Text style={styles.textheaddropdown}>Select State</Text>
              {stateData && (
                <Dropdown
                  style={styles.dropdown}
                  data={statedropdownOptions}
                  search
                  inputSearchStyle={styles.searchTextInput}
                  itemTextStyle={styles.itemTextStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  value={selectedStateIdandName}
                  placeholder="--Select--"
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
                          color={'#ffc107'}
                          size={28}
                        />
                      );
                    }
                  }}
                />
              )}
              <Text style={styles.textheaddropdown}>Select City</Text>
              <Dropdown
                style={styles.dropdown}
                data={cityDropDownOptions}
                search
                inputSearchStyle={styles.searchTextInput}
                itemTextStyle={styles.itemTextStyle}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                value={selectedCityIdandName}
                placeholder="--Select--"
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
                        color={'#ffc107'}
                        size={28}
                      />
                    );
                  }
                }}
              />
            </View>

            {membersData && Object.keys(membersData).length > 0 ? (
              Object.keys(membersData).map((userId, index) => {
                return (
                  <View key={userId} style={styles.cardContainer}>
                    <View style={styles.card}>
                      {/* <Text style={{color: 'black'}}>{index}</Text> */}
                      <View style={styles.cardphotocontainer}>
                        <Image
                          style={styles.cardImage}
                          source={
                            membersData[userId].photo &&
                            membersData[userId].photo.length > 0
                              ? Array.isArray(membersData[userId].photo)
                                ? {uri: membersData[userId].photo[0]}
                                : {uri: membersData[userId].photo}
                              : require('../../../assests/nullphotocover.jpg')
                          }
                        />
                      </View>
                      <View style={styles.cardcontentcontainer}>
                        <Text style={styles.cardnamecentercontainer}>
                          {membersData[userId].name}
                        </Text>
                        <Text style={styles.cardjobcentercontainer}>
                          Job Profile -{' '}
                          {membersData[userId].occupation
                            ? membersData[userId].occupation
                            : 'NA'}
                        </Text>

                        <Text style={styles.cardtextcontent}>
                          Education-
                          {membersData[userId].highest_qualification !== null
                            ? membersData[userId].highest_qualification
                            : 'N/A'}
                        </Text>
                        <Text style={styles.cardtextcontent}>
                          Age-
                          {membersData[userId].dob !== null
                            ? Math.floor(
                                moment().diff(
                                  membersData[userId].dob,
                                  'years',
                                  true,
                                ),
                              )
                            : 'N/A'}
                        </Text>
                        <Text style={styles.cardtextcontent}>
                          City-{membersData[userId].native_place_city}(
                          {membersData[userId].native_place_state})
                        </Text>
                        <Text
                          style={styles.cardtextcontent}
                          onPress={() => handlePhonePress(userId)}>
                          Mobile-
                          <Text style={styles.phonenumberclick}>
                            {membersData[userId].mobile !== null
                              ? membersData[userId].mobile
                              : 'N/A'}
                          </Text>
                        </Text>
                      </View>
                      <View style={styles.cardBottomContainer}>
                        <View>
                          <TouchableOpacity
                            style={styles.iconbottomcontainer}
                            onPress={() =>
                              navigation.navigate('ChatScreenMembers', {
                                memberId: membersData[userId].id,
                                memberName: membersData[userId].name,
                              })
                            }>
                            <Image
                              source={require('../../../assests/chatMessageWallpaper.jpeg')}
                              style={styles.chatIcon}
                            />
                          </TouchableOpacity>
                        </View>
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate(routes.VIEWPROFILE, {
                                memberId: membersData[userId].id,
                                memberName: membersData[userId].name,
                              });
                            }}
                            style={styles.viewbuttoncontainer}>
                            <MaterialCommunityIcons
                              name="account-eye"
                              size={26}
                              color={colors.black}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <View></View>
            )}

            {hasNoData || apiFailed ? (
              <View style={styles.nomoretextcontainer}>
                <Text style={styles.nomoretext}>No More Data</Text>
              </View>
            ) : (
              <ActivityIndicator size={'large'} color={colors.danger} />
            )}
          </View>
        ) : (
          <>
            {apiFailed ? (
              <View style={styles.nomoretextcontainer}>
                <Text style={styles.nomoretext}>
                  Check your Internet, pull to refresh
                </Text>
              </View>
            ) : (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
  },
  innercontainer: {
    flex: 1,
    margin: 15,
    borderRadius: 10,
  },
  dropdown: {
    margin: 10,
    height: 50,
    borderBottomColor: colors.black,
    borderBottomWidth: 0.5,
  },
  dropdownoutsidecontainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.white,
    elevation: 25,
    borderRadius: 15,
  },
  textheaddropdown: {
    fontSize: 16,
    backgroundColor: colors.bgcolorSign_up_in,
    borderRadius: 120,
    color: colors.black,
    textAlign: 'center',
  },
  searchTextInput: {
    color: colors.black,
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
  },
  cardjobcentercontainer: {
    fontWeight: 'bold',
    color: colors.black,
    fontSize: 16,
    marginBottom: 5,
  },
  cardphotocontainer: {
    flex: 0.5,
    marginTop: 20,
    alignItems: 'center',
  },
  cardImage: {
    width: 150,
    height: 150,
    borderRadius: 150,
  },
  cardtextcontent: {
    color: colors.black,
    fontSize: 18,
    margin: 5,
    borderRadius: 10,
    padding: 5,
    marginLeft: 20,
    backgroundColor: '#CDCEC8',
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
  chatIcon: {
    width: 30,
    height: 30,
  },
  searchbox: {
    color: colors.black,
    flex: 1,
  },
  searchboxinput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    paddingLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#198754',
    borderRadius: 10,
  },
  nomoretextcontainer: {
    borderWidth: 1,
    margin: 10,
    marginBottom: 30,
    borderRadius: 10,
    backgroundColor: colors.grayLight,
    padding: 5,
  },
  nomoretext: {
    fontSize: 20,
    color: colors.blue,
  },
});
