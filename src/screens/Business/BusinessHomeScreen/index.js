import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Modal,
  Linking,
  RefreshControl,
  ToastAndroid,
  Alert,
} from 'react-native';

import React, {useState} from 'react';
import {useEffect, useCallback} from 'react';
import colors from '../../../constants/colors';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {getBusiness, getCities, getState} from '../../../apis/apicalls';
import {useSelector} from 'react-redux';
import {Dropdown} from 'react-native-element-dropdown';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useSafeAreaFrame} from 'react-native-safe-area-context';

export default function Business({navigation}) {
  const token = useSelector(state => state.AuthReducer.authToken);
  const [searchText, setSearchText] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [category, setCategory] = useState();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCityIdandName, setSelectedCityIdandName] = useState(null);
  const [dataLoadedforState, setDataLoadedforState] = useState(false);
  const [selectedStateIdandName, setSelectedStateIdandName] = useState(null);
  const [dataLoadedforCity, setDataLoadedforCity] = useState(false);
  const [stateData, setStateData] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [field, setField] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [businessData, setBusinessData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [dataLoadedForField, setDataLoadedForField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [hasNoData, setHasNoData] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);

  const handleShowMore = item => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  // const getBusinessData = (
  //   searchText,
  //   field,
  //   currentPage,
  //   selectedState,
  //   selectedCity,
  // ) => {
  //   console.log(
  //     'searchtext ==',
  //     searchText,
  //     'field===',
  //     field,
  //     'Currrent page== ',
  //     currentPage,
  //     'Selected State=',
  //     selectedState,
  //     'Selected City ==',
  //     selectedCity,
  //   );
  //   if (isFetching) return; // Prevent multiple fetches
  //   setIsFetching(true); // Start fetch control
  //   setIsLoading(true);
  //   getBusiness(
  //     token,
  //     searchText,
  //     field,
  //     currentPage,
  //     selectedState,
  //     selectedCity,
  //   )
  //     .then(response => {
  //       setPageCount(response.data.totalRowsAffected);
  //       // console.log(response);
  //       // console.log(
  //       //   'Business Data' + JSON.stringify(response.data.totalRowsAffected),
  //       // );

  //       if (response.data.result < 1) {
  //         console.log('Hey');
  //         // setCurrentPage(1);
  //         return;
  //       }
  //       setBusinessData(prevData => {
  //         console.log(response.data);
  //         // Combine previous data with new data, filtering out duplicates
  //         const newMembers = response.data.result.filter(
  //           user => !prevData.some(prevMember => prevMember.id === user.id),
  //         );
  //         setIsLoading(false);

  //         return prevData.concat(newMembers); // Append only new, non-duplicate members
  //       });
  //     })
  //     .catch(error => {
  //       console.log('sasasassa' + error);
  //     })
  //     .finally(() => {
  //       setIsLoading(false); // Stop loading
  //       setIsFetching(false); // Reset fetch control
  //     });
  // };\\

  const getBusinessData = (
    searchText,
    field,
    currentPage,
    selectedState,
    selectedCity,
  ) => {
    console.log(
      'searchtext ==',
      searchText,
      'field===',
      field,
      'Currrent page== ',
      currentPage,
      'Selected State=',
      selectedState,
      'Selected City ==',
    );
    console.log(currentPage);
    if (isFetching) return; // Prevent multiple fetches
    setIsFetching(true); // Start fetch control
    // setIsLoading(true);
    setHasNoData(false);
    setApiFailed(false);

    getBusiness(
      token,
      searchText,
      field,
      currentPage,
      selectedState,
      selectedCity,
    )
      .then(response => {
        setPageCount(response.data.totalRowsAffected);
        // console.log(response.data);
        if (response.data.result.length < 1) {
          console.log('No data found');
          setHasNoData(true);
          setIsFetching(false);
          setIsLoading(false);
          return;
        }
        setBusinessData(prevData => {
          // console.log(response.data);
          const newMembers = response.data.result.filter(
            user => !prevData.some(prevMember => prevMember.id === user.id),
          );
          return [...prevData, ...newMembers]; // Append only new, non-duplicate members
        });
      })
      .catch(error => {
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setApiFailed(true);
        setApiFailed(true);
      })
      .finally(() => {
        setIsLoading(false); // Stop loading
        setIsFetching(false); // Reset fetch control
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getStateData();
    getBusinessData(
      searchText,
      field,
      currentPage,
      selectedState,
      selectedCity,
    );
    setRefreshing(false);
  }, []);
  useEffect(() => {
    getBusinessData(
      searchText,
      field,
      currentPage,
      selectedState,
      selectedCity,
    );
  }, [searchText, field, selectedState, selectedCity]);

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
    setSelectedCityIdandName(selectedItem);
    handleCityIdAndName(selectedItem);
    console.log(selectedItem);
    setBusinessData([]);
    setDataLoadedforCity(true);
  };

  const handleClearCityDropdown = () => {
    setSelectedCity(null);
    setSelectedCityIdandName(null);
    setDataLoadedforCity(false);
    setBusinessData([]);
    setCurrentPage(1);
    getBusinessData(searchText, field, 1, selectedState, '');
  };
  const handleCityIdAndName = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = cityData.find(city => city.id === selectedId)?.name;
    setSelectedCity(selectedName);
    setCurrentPage(1);
    setBusinessData([]);
    getBusinessData(searchText, field, 1, selectedState, selectedName);
  };

  const handleStateDropdown = selectedItem => {
    setCurrentPage(1);
    setSelectedStateIdandName(selectedItem);

    handleSelectedStates(selectedItem);
  };

  const handleClearStateDropdown = () => {
    setBusinessData([]);
    console.log(hasNoData);
    setSelectedState(null);
    setSelectedStateIdandName(null);
    setDataLoadedforState(false);
    setCityData(null);
    setSelectedCity(null);
    // handleClearCityDropdown();
    setDataLoadedforCity(false);
    setCurrentPage(1);
    // console.log('aaa', businessData);
    setPageCount(0);
    setHasNoData(false);
    console.log(hasNoData);
    getBusinessData(searchText, field, 1, '', selectedCity);
  };
  const handleSelectedStates = selectedItem => {
    setCurrentPage(1);
    setBusinessData([]);
    const selectedId = parseInt(selectedItem.value);
    const selectedName = stateData.find(state => state.id === selectedId)?.name;
    setSelectedState(selectedName);
    console.log('Selected Name:', selectedName);
    console.log('Selected ID:', selectedId);
    getCitiesData(selectedId);
    setDataLoadedforState(true);
    setHasNoData(false);
    getBusinessData(searchText, field, 1, selectedName, selectedCity);
    console.log(hasNoData);
    // setHasNoData(true);
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

  const categoryObject = [
    {label: 'All', value: ''},
    {
      label: 'Information Technology (IT)',
      value: 'Information Technology (IT)',
    },
    {label: 'Sports', value: 'Sports'},
    {label: 'Sales', value: 'Sales'},
    {label: 'Marketing', value: 'Marketing'},
    {label: 'Manufacturing', value: 'Manufacturing'},
    {label: 'Service', value: 'Service'},
    {label: 'Finance', value: 'Finance'},
    {label: 'Real Estate', value: 'Real Estate'},
    {label: 'Healthcare', value: 'Healthcare'},
    {
      label: 'Transportation and Logistics',
      value: 'Transportation and Logistics',
    },
    {label: 'Hospitality', value: 'Hospitality'},
    {label: 'Education', value: 'Education'},
    {label: 'Nonprofit Organization', value: 'Nonprofit Organization'},
    {label: 'Polity', value: 'Polity'},
    {label: 'Other', value: 'Other'},
  ];

  const handleFieldDropDown = item => {
    setField(item.value);
    console.log(item.value);
    setCurrentPage(1);
    setBusinessData([]);
    setDataLoadedForField(true);
    getBusinessData(searchText, item.value, 1, selectedState, selectedCity);
  };
  const handleClearField = () => {
    setField('');
    setDataLoadedForField(false);
    setCurrentPage(1);
    setBusinessData([]);
    getBusinessData(searchText, '', 1, selectedState, selectedCity);
  };

  const handlePhonePress = phoneNumber => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };
  const handleViewWebsite = Link => {
    if (Link) {
      const url =
        Link.startsWith('http://') || Link.startsWith('https://')
          ? Link
          : `http://${Link}`;
      Linking.openURL(url).catch(
        err =>
          // Show the error message in a toast
          ToastAndroid.show('Failed to open URL', ToastAndroid.SHORT),
        // console.error('Failed to open URL:', err),
      );
    } else {
      ToastAndroid.show('No Link available', ToastAndroid.SHORT);
      // console.warn('Apply link is not available');
    }
  };

  const handleEmailPress = email => {
    if (email) {
      const mailto = `mailto:${email}`;
      Linking.openURL(mailto).catch(err =>
        console.error('Failed to open email client:', err),
      );
    } else {
      Alert.alert('No email available');
    }
  };
  const handleMapPress = item => {
    // console.log(item.id);
    console.log(item);
    console.log(item.google_map_link);
    const mapLink = item.google_map_link;

    Linking.openURL(mapLink).catch(err =>
      // console.error('Failed to open email client:', err),
      ToastAndroid.show('Failed to open email client:', ToastAndroid.SHORT),
    );
  };
  const isValidUrl = url => {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // Protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // Domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // Port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // Query string
        '(\\#[-a-z\\d_]*)?$',
      'i', // Fragment locator
    );
    return !!pattern.test(url);
  };

  const handleScroll = event => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const paddingToBottom = 20;
    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    ) {
      // if (!isFetching && currentPage == Math.ceil(pageCount / 10)) {
      //   setIsLoading(true);
      //   const nextPage = currentPage + 1;
      //   setCurrentPage(nextPage);
      //   getBusinessData(
      //     searchText,
      //     field,
      //     nextPage,
      //     selectedState,
      //     selectedCity,
      //   );
      // } else {
      //   setHasNoData(true);
      // }
      if (!isFetching && currentPage == Math.ceil(pageCount / 10)) {
        setHasNoData(true);
      } else {
        setIsLoading(true);
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        getBusinessData(
          searchText,
          field,
          nextPage,
          selectedState,
          selectedCity,
        );
      }
    }
  };
  return (
    <ScrollView
      onScroll={handleScroll}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {businessData && businessData.length >= 0 && !apiFailed ? (
        <View>
          <View style={styles.filtercontainer}>
            <View>
              <Text style={styles.dropdownlabeltext}>
                Select Business Field
              </Text>
              <Dropdown
                style={styles.dropdown}
                data={categoryObject}
                search
                itemTextStyle={styles.itemTextStyle}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={{color: colors.black}}
                value={field}
                placeholder="--Choose Field--"
                labelField="label"
                valueField="value"
                onChange={handleFieldDropDown}
                renderRightIcon={() => {
                  if (dataLoadedForField && field !== null) {
                    return (
                      <FontAwesome5
                        name="trash"
                        color={colors.orange}
                        size={20}
                        onPress={handleClearField}
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
                <>
                  <Text style={styles.dropdownlabeltext}>Select State</Text>
                  <Dropdown
                    style={styles.dropdown}
                    data={statedropdownOptions}
                    search
                    itemTextStyle={styles.itemTextStyle}
                    placeholderStyle={styles.placeholderStyle}
                    inputSearchStyle={{color: colors.black}}
                    selectedTextStyle={styles.selectedTextStyle}
                    value={selectedStateIdandName}
                    placeholder="--Select state--"
                    labelField="label"
                    valueField="value"
                    onChange={item => {
                      setCurrentPage(1), handleStateDropdown(item);
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
                </>
              )}

              <>
                <Text style={styles.dropdownlabeltext}>Select City</Text>
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
                  onChange={item => {
                    setCurrentPage(1);
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
              </>
            </View>
            <TouchableOpacity
              style={styles.promotebutton}
              onPress={() => {
                navigation.navigate('BusinessPromote');
              }}>
              <Text style={styles.textpromote}>Promote Your Business</Text>
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
                setCurrentPage(1);
                setBusinessData([]);
                getBusinessData(text, field, 1, selectedState, selectedCity);
              }}
              value={searchText}
            />
          </View>

          {businessData ? (
            <View>
              {businessData.map((item, index) => (
                <View key={index} style={styles.card}>
                  {/* <Text style={{color: colors.black}}>
                  {item.id} {index}
                </Text> */}
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
                  <Text style={styles.cardheadtext}>{item.business_name}</Text>
                  <Text style={styles.cardcategorytext}>
                    ({item.business_category})
                  </Text>

                  <View style={styles.content}>
                    <View style={styles.textbox}>
                      <Text style={styles.contenttextstatic}>Location:</Text>
                    </View>
                    <TouchableOpacity style={styles.infobox}>
                      <Text style={styles.contenttextDynamic}>
                        {item.city} ({item.state}) {item.country}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.content}>
                    <View style={styles.textbox}>
                      <Text style={styles.contenttextstatic}>
                        Street Address:
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.infobox}>
                      <Text style={styles.contenttextDynamic}>
                        {item.street_address}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      // borderWidth: 1,
                    }}>
                    <TouchableOpacity
                      style={styles.cardshowinfo}
                      onPress={() => handleShowMore(item)}>
                      <Text style={styles.showmoretext}>Show More</Text>
                    </TouchableOpacity>

                    {/* {item.google_map_link ? (
                      <TouchableOpacity
                        style={styles.cardmapshow}
                        onPress={() => handleMapPress(item)}>
                        <FontAwesome5
                          name="directions"
                          color={colors.black}
                          size={30}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.cardmapshow, styles.disabledButton]}
                        disabled={true}>
                        <FontAwesome5
                          name="directions"
                          color={colors.gray} // Use a different color to indicate disabled state
                          size={30}
                        />
                      </TouchableOpacity>
                    )} */}

                    {item.google_map_link &&
                    isValidUrl(item.google_map_link) ? (
                      <TouchableOpacity
                        style={styles.cardmapshow}
                        onPress={() => handleMapPress(item)}>
                        <FontAwesome5
                          name="directions"
                          color={colors.black}
                          size={30}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.cardmapshow, styles.disabledButton]}
                        disabled={true}>
                        <FontAwesome5
                          name="directions"
                          color={colors.gray} // Use a different color to indicate disabled state
                          size={30}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View>
              <ActivityIndicator size="100" color={colors.blue} />
            </View>
          )}

          {hasNoData ? (
            <View style={styles.nomoretextcontainer}>
              <Text>No More Data</Text>
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
      {selectedItem && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.cardheadtext}>
                {selectedItem.business_name}
              </Text>
              <Text style={styles.cardcategorytext}>
                ({selectedItem.business_category})
              </Text>
              <View style={styles.imagecontainer}>
                <Image
                  style={styles.cardImage}
                  source={
                    selectedItem.business_photos
                      ? Array.isArray(selectedItem.business_photos)
                        ? {uri: selectedItem.business_photos[0]}
                        : {uri: selectedItem.business_photos}
                      : require('../../../assests/nullphotocover.jpg')
                  }
                />
              </View>
              <View style={styles.content}>
                <View style={styles.textbox}>
                  <Text style={styles.contenttextstatic}>Posted By:</Text>
                </View>
                <View style={styles.infobox}>
                  <Text style={styles.contenttextDynamic}>
                    {selectedItem.name}
                  </Text>
                </View>
              </View>
              <View style={styles.content}>
                <View style={styles.textbox}>
                  <Text style={styles.contenttextstatic}>Location:</Text>
                </View>
                <View style={styles.infobox}>
                  <Text style={styles.contenttextDynamic}>
                    {selectedItem.city}({selectedItem.state})
                    {selectedItem.country}
                  </Text>
                </View>
              </View>
              {selectedItem.business_email && (
                <View style={styles.content}>
                  <View style={styles.textbox}>
                    <Text style={styles.contenttextstatic}>
                      Business Email:
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.infobox}
                    onPress={() =>
                      handleEmailPress(selectedItem.business_email)
                    }>
                    <Text style={[styles.contenttextDynamic, styles.bluetext]}>
                      {selectedItem.business_email}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {selectedItem.business_website && (
                <View style={styles.content}>
                  <View style={styles.textbox}>
                    <Text style={styles.contenttextstatic}>
                      Business Website:
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.infobox}
                    onPress={() =>
                      handleViewWebsite(selectedItem.business_website)
                    }>
                    <Text style={[styles.contenttextDynamic, styles.bluetext]}>
                      {selectedItem.business_website}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.content}>
                <View style={styles.textbox}>
                  <Text style={styles.contenttextstatic}>Contact No:</Text>
                </View>
                <TouchableOpacity
                  style={styles.infobox}
                  onPress={() => handlePhonePress(selectedItem.contact1)}>
                  <Text style={[styles.contenttextDynamic, styles.bluetext]}>
                    {selectedItem.contact1}
                  </Text>
                </TouchableOpacity>
              </View>
              {/* {[
                {
                  label: 'Posted By',
                  value: selectedItem.name,
                },
                {
                  label: 'Location',
                  value: `${selectedItem.city}, (${selectedItem.state}), ${selectedItem.country}`,
                },
                {
                  label: 'Business Email',
                  value: selectedItem.business_email,
                },
                {
                  label: 'Business Website',
                  value: selectedItem.business_website,
                },
                {
                  label: 'Contact No',
                  value: selectedItem.contact1,
                },
              ].map((info, index) => (
                <Dividedboxcontainer
                  key={index}
                  label={info.label}
                  value={info.value}
                />
              ))} */}
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  maincontaier: {
    backgroundColor: colors.RegisterandLoginButton,
    padding: 15,
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
  promotebutton: {
    height: 40,
    backgroundColor: '#008374',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  textpromote: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
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
  cardlocationtext: {
    color: colors.black,
    fontSize: 15,
  },
  boldText: {
    fontWeight: '600',
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
  showmoretext: {
    fontSize: 18,
    color: colors.black,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#00858F',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#0DCAF0',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.primary, // replace with your primary color
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  content: {
    flexDirection: 'row',
  },
  textbox: {
    flex: 0.5,
    justifyContent: 'center',
    padding: 5,
  },
  contenttextstatic: {
    color: '#000000',
    fontSize: 18,
  },
  dropdownlabeltext: {
    color: colors.gray,
    fontSize: 17,
    alignSelf: 'center',
  },
  contenttextDynamic: {
    color: colors.gray,
    fontSize: 18,
  },
  infobox: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bluetext: {
    color: colors.blue,
    fontStyle: 'italic',
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
  filtercontainer: {
    borderWidth: 1,
    margin: 5,
    padding: 5,
    backgroundColor: colors.white,
    borderColor: colors.grayLight,
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
