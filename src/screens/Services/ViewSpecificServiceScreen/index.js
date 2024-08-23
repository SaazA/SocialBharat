import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Touchable,
  TouchableOpacity,
  Linking,
  RefreshControl,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {getCities, getSpecificService, getState} from '../../../apis/apicalls';
import {useSelector} from 'react-redux';
import {Dropdown} from 'react-native-element-dropdown';
import colors from '../../../constants/colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Image} from 'react-native';
import routes from '../../../constants/routes';

const ViewSpecificService = ({route, navigation}) => {
  const {title} = route.params;
  const {id} = route.params;
  const {category} = route.params;
  console.log('Cateogy', category);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCityIdandName, setSelectedCityIdandName] = useState(null);
  const [dataLoadedforState, setDataLoadedforState] = useState(false);
  const [selectedStateIdandName, setSelectedStateIdandName] = useState(null);
  const [dataLoadedforCity, setDataLoadedforCity] = useState(false);
  const [stateData, setStateData] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [serviceData, setServiceData] = useState([]);
  const [roleset, selectedRole] = useState('user');
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);

  const token = useSelector(state => state.AuthReducer.authToken);

  const getStateData = () => {
    getState(token)
      .then(response => {
        console.log('States' + response.data);
        setStateData(response.data);
      })
      .catch(error => {
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        // console.log(error);
      });
  };

  const getCitiesData = stateId => {
    getCities(token, stateId)
      .then(response => {
        console.log('Cities' + response.data);
        setCityData(response.data);
      })
      .catch(error => {
        // console.log(error);
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
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

  const handleCityIdAndName = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = cityData.find(city => city.id === selectedId)?.name;
    setSelectedCity(selectedName);
    getSpecificeServiceData(
      roleset,
      searchText,
      selectedState,
      selectedName,
      1,
      title,
    );
  };
  const handleClearCityDropdown = () => {
    setSelectedCity(null);
    setSelectedCityIdandName(null);
    setDataLoadedforCity(false);
  };

  const handleStateDropdown = selectedItem => {
    setSelectedStateIdandName(selectedItem);
    handleSelectedStates(selectedItem);
  };

  const handleClearStateDropdown = () => {
    setSelectedState('');
    setSelectedStateIdandName(null);
    setDataLoadedforState(false);
    setCityData('');
    // setServiceData([]);
    handleClearCityDropdown();
    getSpecificeServiceData(
      roleset,
      searchText,
      selectedState,
      selectedCity,
      1,
      title,
    );
  };
  const handleSelectedStates = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = stateData.find(state => state.id === selectedId)?.name;
    setSelectedState(selectedName);
    console.log('Selected Name:', selectedName);
    console.log('Selected ID:', selectedId);
    getSpecificeServiceData(
      roleset,
      searchText,
      selectedName,
      selectedCity,
      1,
      title,
    );
    getCitiesData(selectedId);
    setDataLoadedforState(true);
  };

  const statedropdownOptions = stateData
    ? stateData.map(state => ({
        label: state.name,
        value: state.id.toString(),
      }))
    : [];

  useEffect(() => {
    getStateData();
  }, []);

  const getSpecificeServiceData = (
    role,
    searchQuerry,
    state,
    city,
    page,
    title,
  ) => {
    setApiFailed(false);
    getSpecificService(token, role, searchQuerry, state, city, page, title)
      .then(response => {
        console.log('Service Data' + JSON.stringify(response.data.data.users));
        setServiceData(response.data.data.users);
      })
      .catch(error => {
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setApiFailed(true);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getStateData();
    getSpecificeServiceData(
      roleset,
      searchText,
      selectedState,
      selectedCity,
      1,
      title,
    );
    setRefreshing(false);
  }, []);

  useEffect(() => {
    getSpecificeServiceData(
      roleset,
      searchText,
      selectedState,
      selectedCity,
      1,
      title,
    );
  }, [searchText, selectedState, selectedCity]);

  const handlePhonePress = phoneNumber => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const navigateToChatScreen = (partnerId, partnerName) => {
    navigation.navigate('ChatScreenMatrimonial', {
      partnerId: partnerId,
      partnerName: partnerName,
    });
  };
  return (
    <ScrollView
      style={styles.maincontainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {serviceData && !apiFailed ? (
        <>
          <View style={styles.uppercontainer}>
            <View style={styles.headingcontainer}>
              <Text style={styles.headservicetext}>{title}</Text>
            </View>
            <View style={styles.searchboxinput}>
              <FontAwesome5 name="search" color={'#ffc107'} size={24} />
              <TextInput
                style={styles.searchbox}
                placeholder="Search By Name"
                placeholderTextColor={colors.black}
                onChangeText={text => {
                  console.log(text);
                  setServiceData([]);
                  setSearchText(text);
                  getSpecificeServiceData(
                    roleset,
                    text,
                    selectedState,
                    selectedCity,
                    1,
                    title,
                  );
                }}
                value={searchText}
              />
            </View>
          </View>
          <View>
            {stateData && (
              <Dropdown
                style={styles.dropdown}
                data={statedropdownOptions}
                search
                inputSearchStyle={{color: colors.black}}
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
              inputSearchStyle={{color: colors.black}}
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
          <ScrollView
            nestedScrollEnabled={true}
            style={styles.outercontainerdisplay}>
            {serviceData.length > 0 ? (
              serviceData.map((item, index) => (
                <View key={index} style={styles.card}>
                  {/* <Text style={{color: colors.black}}>{item.id}</Text> */}
                  <View style={styles.imagecontainer}>
                    <Image
                      style={styles.cardImage}
                      source={
                        item.photo && item.photo.startsWith('http')
                          ? {uri: item.photo}
                          : require('../../../assests/nullphotocover.jpg')
                      }
                    />
                  </View>
                  <View>
                    <Text style={styles.nametext}>{item.name}</Text>
                    <Text style={styles.labeltext}>
                      Total Participate - {item.total_participating}
                    </Text>
                    <Text style={styles.labeltext}>
                      Description : {item.description}
                    </Text>
                    <Text style={styles.labeltext}>
                      Providing Services in - {item.category}
                    </Text>

                    <Text style={styles.labeltext}>
                      {item.occupation
                        ? 'Occupation -' + item.occupation
                        : 'Occupation -' + ' NA '}
                    </Text>
                    <Text style={styles.labeltext}>
                      Experience - {item.experience}
                    </Text>
                    <Text style={styles.labeltext}>
                      Service At - {item.state}
                      {item.city}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.labeltext}>Contact Number 1 : </Text>
                      <TouchableOpacity onPress={handlePhonePress}>
                        <Text style={styles.labeltext}>{item.mobile1} </Text>
                      </TouchableOpacity>
                    </View>
                    {item.mobile2 ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.labeltext}>Contact Number 2 :</Text>
                        <TouchableOpacity onPress={handlePhonePress}>
                          <Text style={styles.labeltext}>{item.mobile2} </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.labeltext}>Contact Number 2 :</Text>
                        <TouchableOpacity>
                          <Text style={{color: colors.black}}>'NA' </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <View style={styles.cardBottomContainer}>
                    <View>
                      <TouchableOpacity
                        style={styles.iconbottomcontainer}
                        onPress={() =>
                          navigateToChatScreen(item.id, item.name)
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
                            memberId: item.id,
                            memberName: item.name,
                          });
                        }}
                        style={styles.viewbuttoncontainer}>
                        <MaterialCommunityIcons
                          name="account-eye"
                          size={26}
                          color={colors.black}
                        />
                      </TouchableOpacity>
                      {/* <TouchableOpacity
                    // onPress={() => toggleModal(userId)}
                    style={styles.viewbuttoncontainer}>
                    <MaterialCommunityIcons
                      name="account-eye"
                      size={26}
                      color={colors.black}
                    />
                  </TouchableOpacity> */}
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View>
                <Text style={styles.labeltext}>No Data Available</Text>
              </View>
            )}
          </ScrollView>
        </>
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
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    margin: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
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
  dropdown: {
    // margin: 10,
    marginBottom: 5,
    marginTop: 5,
    height: 50,
    borderBottomColor: colors.black,
    borderWidth: 0.5,
    padding: 5,
  },
  dropdownoutsidecontainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.white,
    elevation: 25,
    borderRadius: 15,
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
  dropdown: {
    // margin: 10,
    marginBottom: 5,
    marginTop: 5,
    height: 50,
    borderBottomColor: colors.black,
    borderWidth: 0.5,
    padding: 5,
    margin: 5,
    borderRadius: 5,
  },
  searchboxinput: {
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: colors.white,
    borderWidth: 1,
    paddingLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#198754',
    borderRadius: 8,
    marginBottom: 10,
  },
  searchbox: {
    color: colors.black,
    flex: 1,
  },

  headservicetext: {
    color: colors.black,
    fontSize: 15,
    fontWeight: '500',
  },
  headingcontainer: {
    marginTop: 20,
    margin: 5,
  },
  outercontainerdisplay: {
    borderWidth: 1,
    maxHeight: 600,
    marginTop: 10,
    borderColor: colors.gray,
    marginBottom: 20,
    borderRadius: 10,
  },
  card: {
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    marginTop: 10,
    margin: 5,
  },
  cardImage: {
    width: 150,
    height: 150,
  },
  imagecontainer: {
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 150,
    marginBottom: 10,
  },
  nametext: {
    fontSize: 18,
    color: colors.black,
    fontWeight: '500',
  },
  labeltext: {color: colors.black, fontSize: 15, margin: 5},
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

export default ViewSpecificService;
