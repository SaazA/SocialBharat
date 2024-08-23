import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  RefreshControl,
  ToastAndroid,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
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
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Modal} from 'react-native-paper';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useFocusEffect} from '@react-navigation/native';
import routes from '../../../constants/routes';

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
  const [dataLoadedforOccupation, setDataLoadedforOccupation] = useState(false);
  const [occupation, setOccupation] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisibility, setModalVisibility] = useState({});

  const [selectedUserId, setSelectedUserId] = useState(null);

  const [hasNoData, setHasNoData] = useState(false);

  const [isFetching, setIsFetching] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const [partnerDataFetching, setPartnerDataFetching] = useState(true);
  const toggleModal = useCallback(
    userId => {
      setModalVisibility(prevState => ({
        ...prevState,
        [userId]: !prevState[userId],
      }));
    },
    [setModalVisibility],
  );

  const getpartnersmatrimonial = (
    text,
    page,
    state,
    city,
    gender,
    occupation,
    gotra,
    cast,
    subcastId,
  ) => {
    if (isFetching) {
      console.log('Already fetching data, skipping new request');
      return; // Prevent multiple fetches
    }
    setIsFetching(true);
    setHasNoData(false);
    setApiFailed(false);
    getPartnermatrimonial(
      token,
      text,
      page,
      community_id,
      state,
      city,
      gender,
      occupation,
      gotra,
      cast,
      subcastId,
    )
      .then(response => {
        const users = response.data.users;
        console.log(response.data.totalFilteredRecords);
        if (users.length < 1) {
          setHasNoData(true);
          console.log('No users returned from API');
        }
        setPageCount(response.data.totalFilteredRecords);
        setPartnerData(prevData => {
          const newMembers = users.filter(
            user => !prevData.some(prevMember => prevMember.id === user.id),
          );
          console.log('Filtered new members:', newMembers);
          return [...prevData, ...newMembers];
        });
        setIsFetching(false); // Reset isFetching after successful fetch
      })
      .catch(error => {
        // console.log(error);
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setApiFailed(true);
        setApiFailed(true);
        setIsFetching(false); // Reset isFetching if an error occurs
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getStateData();
    getSubCastesData();
    getpartnersmatrimonial(
      searchText,
      1,
      selectedState,
      selectedCity,
      gender,
      occupation,
      gotra,
      '',
      slectedSubCasteId,
    );
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getpartnersmatrimonial(
        searchText,
        1,
        selectedState,
        selectedCity,
        gender,
        occupation,
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
      occupation,
      gotra,
      slectedSubCasteId,
    ]),
  );

  const handleScroll = event => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const paddingToBottom = 20;

    if (
      !isFetching &&
      !hasNoData &&
      layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
    ) {
      console.log('Reached Bottom: Attempting to fetch more data');

      const nextPage = currentPage + 1;

      if (nextPage > Math.ceil(pageCount / 5)) {
        setHasNoData(true);
        console.log('No more pages to fetch');
      } else {
        setCurrentPage(nextPage);
        console.log('Fetching page:', nextPage);
        getpartnersmatrimonial(
          searchText,
          nextPage,
          selectedState,
          selectedCity,
          gender,
          occupation,
          gotra,
          '',
          slectedSubCasteId,
        );
      }
    }
  };

  const genderoptions = [
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
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
      occupation,
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
      occupation,
      gotra,
      '',
      slectedSubCasteId,
    );
    console.log('Selected Name:', selectedName);
    console.log('Selected ID:', selectedId);
    setDataLoadedforCity(true);
  };
  const getStateData = () => {
    getState(token)
      .then(response => {
        console.log('States' + response.data);
        setStateData(response.data);
      })
      .catch(error => {
        // console.log(error.message);
        // const errorMessage = error.message || 'An unexpected error occurred';
        // // Show the error message in a toast
        // ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      });
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
    setSelectedCity(null);
    setSelectedCityIdandName(null);
    setDataLoadedforCity(false);
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
      occupation,
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
    getCastes(token)
      .then(response => {
        console.log('Subcastes' + response.data);
        setSubCastes(response.data);
      })
      .catch(error => {
        // console.log(error);
      });
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
      occupation,
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

  const occupationOptions = [
    {label: 'Government', value: 'Government'},
    {label: 'Private', value: 'Private'},
    {label: 'Doctor', value: 'Doctor'},
    {label: 'Engineer', value: 'Engineer'},
    {label: 'Sales', value: 'Sales'},
    {label: 'Marketing', value: 'Marketing'},
  ];
  const handleOccupationDropDown = item => {
    setOccupation(item.value);
    setCurrentPage(1);
    console.log(item);
    setPartnerData([]);
    getpartnersmatrimonial(
      searchText,
      1,
      selectedState,
      selectedCity,
      gender,
      item.value,
      gotra,
      slectedCaste,
      slectedSubCasteId,
    );
    setDataLoadedforOccupation(true);
  };
  const handleClearOccupation = () => {
    setOccupation(null);
    setDataLoadedforOccupation(false);
  };

  const navigateToChatScreen = (partnerId, partnerName) => {
    // console.log(partnerId, partnerName, 'sssss');
    navigation.navigate(routes.CHATSCREEN, {
      memberId: partnerId,
      memberName: partnerName,
    });
  };

  const handlePhonePress = userId => {
    if (partnerData[userId].mobile) {
      const phoneNumber = `tel:${partnerData[userId].mobile}`;
      Linking.openURL(phoneNumber);
    }
  };

  const handleBioDataPress = userId => {
    console.log(userId);
    const bioDataUrl = partnerData[userId].biodata;
    console.log(bioDataUrl);
    if (bioDataUrl) {
      Linking.openURL(bioDataUrl);
    } else {
      Alert.alert('No Bio Data Available');
    }
  };

  return (
    <>
      {/* <ScrollView
        onScroll={handleScroll}
        style={styles.maincontainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }> */}

      <View style={styles.container}>
        <View style={styles.headingcontainer}>
          <Text style={styles.headingcontainertext}> Search Partner</Text>
        </View>
        {partnerData && partnerData.length >= 0 && !apiFailed ? (
          <ScrollView
            onScroll={handleScroll}
            style={styles.maincontainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={styles.dropdownoutsidecontainer}>
              <Text style={styles.textheaddropdown}>Select Gender</Text>
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
                placeholder={'--Select--'}
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
              <Text style={styles.textheaddropdown}>Select State</Text>
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
                          color={colors.blue}
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
                        color={colors.blue}
                        size={28}
                      />
                    );
                  }
                }}
              />
              <Text style={styles.textheaddropdown}>Select Subcast</Text>
              <Dropdown
                style={styles.dropdown}
                data={subCastesDropDownOption}
                search
                inputSearchStyle={styles.searchTextInput}
                itemTextStyle={styles.itemTextStyle}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                value={slectedCasteidAndName}
                placeholder="--Select--"
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
              <Text style={styles.textheaddropdown}>Select Occupation</Text>
              <Dropdown
                style={styles.dropdown}
                data={occupationOptions}
                search // Enable search functionality
                itemTextStyle={styles.itemTextStyle}
                placeholderStyle={styles.placeholderStyle}
                inputSearchStyle={styles.searchTextInput}
                selectedTextStyle={styles.selectedTextStyle}
                labelField="label"
                valueField="value"
                maxHeight={300}
                placeholder={'--Select--'}
                searchPlaceholder="Search..."
                value={occupation}
                onChange={handleOccupationDropDown}
                renderRightIcon={() => {
                  if (dataLoadedforOccupation && occupation !== null) {
                    return (
                      <FontAwesome5
                        name="trash"
                        color={colors.orange}
                        size={20}
                        onPress={handleClearOccupation}
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
                    text,
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
              Object.keys(partnerData).map((userId, index) => {
                return (
                  <View key={userId} style={styles.cardContainer}>
                    <View style={styles.card}>
                      {/* <Text style={{color: colors.black}}>{index}</Text> */}
                      <View style={styles.cardphotocontainer}>
                        <Image
                          style={styles.cardImage}
                          source={
                            partnerData[userId].proposal_photos &&
                            partnerData[userId].proposal_photos.length > 0
                              ? Array.isArray(
                                  partnerData[userId].proposal_photos,
                                )
                                ? {uri: partnerData[userId].proposal_photos[0]}
                                : {uri: partnerData[userId].proposal_photos}
                              : require('../../../assests/nullphotocover.jpg')
                          }
                        />
                      </View>
                      <View style={styles.cardcontentcontainer}>
                        <Text style={styles.cardnamecentercontainer}>
                          {partnerData[userId].matrimonial_profile_name}
                        </Text>
                        <Text style={styles.cardjobcentercontainer}>
                          Job Profile -
                          {partnerData[userId].matrimonial_profile_occupation
                            ? partnerData[userId].matrimonial_profile_occupation
                            : 'NA'}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleBioDataPress(userId)}
                          style={styles.downloadbiocontainer}>
                          <Text style={styles.downloadbiotext}>
                            Download Biodata
                          </Text>
                        </TouchableOpacity>
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
                          City-{partnerData[userId].city}(
                          {partnerData[userId].state})
                        </Text>
                        <Text
                          style={styles.cardtextcontent}
                          onPress={() => handlePhonePress(userId)}>
                          Mobile-
                          <Text style={styles.phonenumberclick}>
                            {partnerData[userId].mobile !== null
                              ? partnerData[userId].mobile
                              : 'N/A'}
                          </Text>
                        </Text>
                      </View>
                      <View style={styles.cardBottomContainer}>
                        <View>
                          <TouchableOpacity
                            style={styles.iconbottomcontainer}
                            onPress={() =>
                              navigateToChatScreen(
                                partnerData[userId].userId,
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
                            onPress={() => toggleModal(userId)}
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
          </ScrollView>
        ) : (
          <>
            {apiFailed ? (
              <View style={styles.nodatacontainer}>
                <Text style={styles.nomoretext}>
                  Check your Internet, pull to refresh
                </Text>
              </View>
            ) : (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
          </>
        )}
      </View>
      {/* </ScrollView> */}

      {Object.keys(partnerData).map(userId => {
        return (
          <Modal
            key={`modal_${userId}`}
            visible={modalVisibility[userId]}
            animationIn={null} // No animation when modal is displayed
            animationOut={null}
            onRequestClose={() => setModalVisibility(false)}>
            <ScrollView style={styles.modalContainer}>
              <TouchableOpacity onPress={() => setModalVisibility(false)}>
                <FontAwesome6
                  name="circle-xmark"
                  color={colors.black}
                  size={26}
                />
              </TouchableOpacity>

              <View style={styles.modalimagecontainer}>
                <Image
                  style={styles.modalImage}
                  source={
                    partnerData[userId].proposal_photos &&
                    partnerData[userId].proposal_photos.length > 0
                      ? Array.isArray(partnerData[userId].proposal_photos)
                        ? {uri: partnerData[userId].proposal_photos[0]}
                        : {uri: partnerData[userId].proposal_photos}
                      : require('../../../assests/nullphotocover.jpg')
                  }
                />
              </View>
              <View style={styles.uppercontainer}>
                <Text style={styles.modeltexthead}>
                  {partnerData[userId].matrimonial_profile_name}
                </Text>
                {partnerData[userId].matrimonial_profile_gender === 'Male' ? (
                  <Fontisto name="male" color={colors.black} size={26} />
                ) : (
                  <Fontisto name="female" color={colors.black} size={26} />
                )}
              </View>
              <View style={styles.contentcontainermodel}>
                <Text style={styles.modalcontainerinnertext}>
                  <Text style={styles.modalcontainerboldtext}>
                    Father name:
                  </Text>
                  {partnerData[userId].father_name
                    ? partnerData[userId].father_name
                    : 'NA'}
                </Text>
                <Text style={styles.modalcontainerinnertext}>
                  <Text style={styles.modalcontainerboldtext}>
                    Mother name:
                  </Text>
                  {partnerData[userId].mother_name
                    ? partnerData[userId].mother_name
                    : 'NA'}
                </Text>
                <Text style={styles.modalcontainerinnertext}>
                  <Text style={styles.modalcontainerboldtext}>Manglik:</Text>
                  {partnerData[userId].is_manglik
                    ? partnerData[userId].is_manglik
                    : 'NA'}
                </Text>
                <Text style={styles.modalcontainerinnertext}>
                  <Text style={styles.modalcontainerboldtext}>Height:</Text>
                  {partnerData[userId].height_in_feet
                    ? partnerData[userId].height_in_feet
                    : 'NA'}
                </Text>
                <Text style={styles.modalcontainerinnertext}>
                  <Text style={styles.modalcontainerboldtext}>Package:</Text>
                  {partnerData[userId].salary_package
                    ? partnerData[userId].salary_package
                    : 'NA'}
                </Text>
                <Text style={styles.modalcontainerinnertext}>
                  <Text style={styles.modalcontainerboldtext}>
                    Date Of Birth:
                  </Text>
                  {partnerData[userId].matrimonial_profile_dob
                    ? moment(
                        partnerData[userId].matrimonial_profile_dob,
                      ).format('DD/MM/YYYY')
                    : 'NA'}
                </Text>
                <Text style={styles.modalcontainerinnertext}>
                  <Text style={styles.modalcontainerboldtext}>Education:</Text>
                  {partnerData[userId].education
                    ? partnerData[userId].education
                    : 'NA'}
                </Text>
                <Text style={styles.modalcontainerinnertext}>
                  <Text style={styles.modalcontainerboldtext}>
                    Sister Count:
                  </Text>
                  {partnerData[userId].sister_count
                    ? partnerData[userId].sister_count
                    : 'NA'}
                </Text>
                <Text style={styles.modalcontainerinnertext}>
                  <Text style={styles.modalcontainerboldtext}>
                    Brother Count:
                  </Text>
                  {partnerData[userId].brother_count
                    ? partnerData[userId].brother_count
                    : 'NA'}
                </Text>
                <Text style={styles.modalcontainerinnertext}>
                  <Text style={styles.modalcontainerboldtext}>Subcast:</Text>
                  {partnerData[userId].subcast
                    ? partnerData[userId].subcast
                    : 'NA'}
                </Text>
                <Text style={styles.modalcontainerinnertext}>
                  <Text style={styles.modalcontainerboldtext}>Gender:</Text>
                  {partnerData[userId].matrimonial_profile_gender
                    ? partnerData[userId].matrimonial_profile_gender
                    : 'NA'}
                </Text>
                <Text style={styles.modalcontainerinnertext}>
                  <Text style={styles.modalcontainerboldtext}>
                    Paternal Gotra:
                  </Text>
                  {partnerData[userId].paternal_gotra
                    ? partnerData[userId].paternal_gotra
                    : 'NA'}
                </Text>
                <Text style={styles.modalcontainerinnertext}>
                  <Text style={styles.modalcontainerboldtext}>
                    Maternal Gotra:
                  </Text>
                  {partnerData[userId].maternal_gotra
                    ? partnerData[userId].maternal_gotra
                    : 'NA'}
                </Text>
              </View>
            </ScrollView>
          </Modal>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  outsidecont: {
    margin: 2,
  },
  maincontainer: {
    backgroundColor: colors.white,
  },
  modalContainer: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
  modeltexthead: {
    color: colors.black,
    fontSize: 20,
  },
  contentcontainermodel: {
    margin: 20,
  },
  modalcontainerinnertext: {
    color: colors.black,
    fontSize: 16,
    margin: 10,
  },
  modalcontainerboldtext: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  uppercontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    padding: 10,
    borderBottomColor: colors.grayLight,
  },
  modalimagecontainer: {
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  headingcontainer: {
    alignItems: 'center',
    backgroundColor: '#e1e8e3',
    borderRadius: 20,
    margin: 5,
  },
  headingcontainertext: {
    color: colors.black,
    fontSize: 20,
    fontWeight: 'bold',
  },

  container: {
    margin: 10,
  },
  dropdown: {
    margin: 10,
    height: 50,
    borderBottomColor: colors.black,
    borderBottomWidth: 0.5,
  },
  textheaddropdown: {
    fontSize: 16,
    color: colors.black,
    textAlign: 'center',
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
  downloadbiocontainer: {
    backgroundColor: '#198754',
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginBottom: 10,
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
  downloadbiotext: {
    color: colors.white,
    fontSize: 16,
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
  phonenumberclick: {
    color: '#0D6EFD',
  },
  searchbox: {
    color: colors.black,
    flex: 1,
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
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 50,
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
  nomoretextcontainer: {
    borderWidth: 1,
    margin: 10,
    marginBottom: 30,
    borderRadius: 10,
    backgroundColor: colors.grayLight,
    padding: 5,
  },
  nodatacontainer: {
    borderWidth: 1,
    margin: 10,
    flex: 1,
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
