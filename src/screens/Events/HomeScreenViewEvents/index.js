import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {getCities, getState, SearchEvents} from '../../../apis/apicalls';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from '../../../constants/colors';
import {Dropdown} from 'react-native-element-dropdown';
import Dividedboxcontainer from '../../../Components/dividedboxcontainer';
import moment from 'moment';
import routes from '../../../constants/routes';

const EventsScreen = ({navigation}) => {
  const token = useSelector(state => state.AuthReducer.authToken);
  const [searchText, setSearchText] = useState('');
  const [eventData, setEventData] = useState();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCityIdandName, setSelectedCityIdandName] = useState(null);
  const [dataLoadedforState, setDataLoadedforState] = useState(false);
  const [selectedStateIdandName, setSelectedStateIdandName] = useState(null);
  const [dataLoadedforCity, setDataLoadedforCity] = useState(false);
  const [stateData, setStateData] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);

  const Searchevent = (searchText, page, state, city) => {
    setApiFailed(false);
    SearchEvents(token, searchText, page, state, city)
      .then(response => {
        console.log(response.data);
        setEventData(response.data.events);
      })
      .catch(error => {
        const errorMessage = error.message || 'An unexpected error occurred';
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        console.log(error, 'Events');
        setApiFailed(true);
      });
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getStateData();
    Searchevent(searchText, 1, selectedState, selectedCity);

    setRefreshing(false);
  }, []);
  const handleApplyPress = () => {
    const applyLink = 'https://www.socialbharat.org/user/my-events';
    Linking.openURL(applyLink);
  };

  useEffect(() => {
    Searchevent(searchText, 1, selectedState, selectedCity);
  }, []);

  const getStateData = () => {
    getState(token)
      .then(response => {
        console.log('States' + response.data);
        setStateData(response.data);
      })
      .catch(error => {
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
    setEventData([]);
    Searchevent(searchText, 1, selectedState, selectedCity);
    setDataLoadedforCity(false);
  };
  const handleCityIdAndName = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = cityData.find(city => city.id === selectedId)?.name;
    setSelectedCity(selectedName);
    setEventData([]);
    Searchevent(searchText, 1, selectedState, selectedName);
  };

  const handleStateDropdown = selectedItem => {
    setSelectedStateIdandName(selectedItem);

    handleSelectedStates(selectedItem);
  };

  const handleClearStateDropdown = () => {
    setSelectedState(null);
    setSelectedStateIdandName(null);
    setDataLoadedforState(false);
    setCityData(null);
    setSelectedCity(null);
    setEventData([]);
    Searchevent(searchText, 1, selectedState, selectedCity);
    // handleClearCityDropdown();
    setDataLoadedforCity(false);
  };
  const handleSelectedStates = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = stateData.find(state => state.id === selectedId)?.name;
    setSelectedState(selectedName);
    console.log('Selected Name:', selectedName);
    console.log('Selected ID:', selectedId);
    setEventData([]);
    Searchevent(searchText, 1, selectedName, selectedCity);
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
  return (
    <ScrollView
      style={styles.maincontainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {eventData && !apiFailed ? (
        <View>
          <View>
            <View style={styles.headingcontainer}>
              <Text style={styles.headingText}>Search Events</Text>
            </View>
            <TouchableOpacity
              style={styles.touchablecontainer}
              onPress={() => navigation.navigate(routes.CREATEEVENTS)}>
              <Text style={styles.touchabletext}>Post Your Event</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.touchablecontainer}
              onPress={handleApplyPress}>
              <Text style={styles.touchabletext}>My Events</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchboxinput}>
            <FontAwesome5 name="search" color={colors.gray} size={24} />
            <TextInput
              style={styles.searchbox}
              placeholder="Search By Name"
              placeholderTextColor={colors.black}
              onChangeText={text => {
                setSearchText(text);
                Searchevent(text, 1, selectedState, selectedCity);
              }}
              value={searchText}
            />
          </View>

          {stateData && (
            <View style={styles.dropdownoutsidecontainer}>
              <Text style={styles.dropdownlabeltext}>Select State</Text>
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
                onChange={item => {
                  handleStateDropdown(item);
                }}
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
            </View>
          )}

          <View style={styles.dropdownoutsidecontainer}>
            <Text style={styles.dropdownlabeltext}>Select City</Text>
            <Dropdown
              style={styles.dropdown}
              data={cityDropDownOptions}
              search
              itemTextStyle={styles.itemTextStyle}
              inputSearchStyle={{color: colors.black}}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              value={selectedCityIdandName}
              placeholder="--Select city--"
              labelField="label"
              valueField="value"
              onChange={item => {
                handleCityDropDown(item);
              }}
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

          {/* <ScrollView style={styles.scrollviewcont} nestedScrollEnabled={true}>
            {eventData &&
              eventData.map((item, index) => (
                <View key={index} style={styles.card}>
                  <View style={styles.imagecontainer}>
                    <Image
                      style={styles.cardImage}
                      source={
                        item.business_photos
                          ? Array.isArray(item.business_photos)
                            ? {uri: item.business_photos[0]}
                            : {uri: item.business_photos}
                          : require('../../../assests/nullphotocover.jpg')
                      }
                    />
                  </View>
                  <Text style={styles.cardheadtext}>{item.title}</Text>
                  <Text style={styles.cardcategorytext}>({item.name})</Text>

                  {[
                    {label: 'Job title', value: item.event_type},
                    {label: 'Company Name:', value: item.venue},
                    {
                      label: 'Application Start:',
                      value: item.start_datetime
                        ? moment(item.start_datetime).format('MMMM Do YYYY')
                        : 'NA',
                    },
                    {
                      label: 'Expire Date:',
                      value: item.end_datetime
                        ? moment(item.end_datetime).format('MMMM Do YYYY')
                        : 'NA',
                    },
                  ].map((info, index) => (
                    <Dividedboxcontainer
                      key={index}
                      label={info.label}
                      value={info.value}
                    />
                  ))}

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      // borderWidth: 1,
                    }}>
                    <TouchableOpacity
                      style={styles.cardshowinfo}
                      onPress={() =>
                        navigation.navigate(routes.VIEWSPECIFICEVENT, {
                          id: item.id,
                        })
                      }>
                      <Text style={styles.showmoretext}>Show More</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </ScrollView> */}
          <ScrollView style={styles.scrollviewcont} nestedScrollEnabled={true}>
            {eventData && eventData.length > 0 ? (
              eventData.map((item, index) => (
                <View key={index} style={styles.card}>
                  <View style={styles.imagecontainer}>
                    <Image
                      style={styles.cardImage}
                      source={
                        item.business_photos
                          ? Array.isArray(item.business_photos)
                            ? {uri: item.business_photos[0]}
                            : {uri: item.business_photos}
                          : require('../../../assests/nullphotocover.jpg')
                      }
                    />
                  </View>
                  <Text style={styles.cardheadtext}>{item.title}</Text>
                  <Text style={styles.cardcategorytext}>({item.name})</Text>

                  {[
                    {label: 'Job title', value: item.event_type},
                    {label: 'Company Name:', value: item.venue},
                    {
                      label: 'Application Start:',
                      value: item.start_datetime
                        ? moment(item.start_datetime).format('MMMM Do YYYY')
                        : 'NA',
                    },
                    {
                      label: 'Expire Date:',
                      value: item.end_datetime
                        ? moment(item.end_datetime).format('MMMM Do YYYY')
                        : 'NA',
                    },
                  ].map((info, index) => (
                    <Dividedboxcontainer
                      key={index}
                      label={info.label}
                      value={info.value}
                    />
                  ))}

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      // borderWidth: 1,
                    }}>
                    <TouchableOpacity
                      style={styles.cardshowinfo}
                      onPress={() =>
                        navigation.navigate(routes.VIEWSPECIFICEVENT, {
                          id: item.id,
                        })
                      }>
                      <Text style={styles.showmoretext}>Show More</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.nomoretextcontainer}>
                <Text style={styles.nomoretext}>No Data Available</Text>
              </View>
            )}
          </ScrollView>
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
  );
};

export default EventsScreen;

const styles = StyleSheet.create({
  maincontainer: {
    margin: 10,
  },
  searchboxinput: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    paddingLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#198754',
    borderRadius: 8,
  },
  searchbox: {
    color: colors.black,
    flex: 1,
  },
  dropdownlabeltext: {
    color: colors.black,
    alignSelf: 'center',
  },
  dropdown: {
    margin: 10,
    height: 50,
    borderBottomColor: colors.black,
    borderBottomWidth: 0.5,
  },
  dropdownoutsidecontainer: {
    marginTop: 5,
    padding: 5,
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
  touchablecontainer: {
    height: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
  },
  touchabletext: {
    fontSize: 16,
    color: colors.white,
  },
  headingText: {fontSize: 16, color: colors.black},
  headingcontainer: {
    height: 30,
    margin: 5,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollviewcont: {
    maxHeight: 400,
    borderWidth: 2,
    minHeight: 200,
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderRadius: 10,
    marginBottom: 10,
  },
  card: {
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: colors.white,
    borderColor: colors.grayLight,
    margin: 10,
    borderRadius: 10,
    padding: 5,
  },
  cardheadtext: {
    fontSize: 20,
    color: '#00858F',
    fontWeight: '500',
  },
  cardcategorytext: {
    color: '#0DCAF0',
    fontSize: 16,
  },

  cardImage: {
    height: 130,
    width: 130,
  },
  imagecontainer: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  cardshowinfo: {
    borderWidth: 1,
    margin: 5,
    padding: 5,
    borderRadius: 10,
    backgroundColor: colors.grayLight,
    borderColor: colors.grayLight,
  },
  cardmapshow: {
    borderWidth: 1,
    margin: 5,
    padding: 5,
    borderRadius: 10,

    borderColor: colors.grayLight,
  },
  contenttextDynamic: {
    color: colors.gray,
    fontSize: 18,
  },
  contenttextstatic: {
    color: '#000000',
    fontSize: 18,
  },
  showmoretext: {
    color: colors.white,
    fontSize: 18,
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
