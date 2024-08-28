import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
  RefreshControl,
  View,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {
  CreatenewJob,
  getCities,
  getState,
  PostEvent,
  uploadBiodataPdf,
  uploadImages,
  uploadSingleImage,
} from '../../../apis/apicalls';
import {useSelector} from 'react-redux';
import colors from '../../../constants/colors';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5, {FA5Style} from 'react-native-vector-icons/FontAwesome5';
import {Dropdown} from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';
import {TouchableOpacity} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import routes from '../../../constants/routes';

const CreateEvent = ({navigation}) => {
  const [dataLoadedforState, setDataLoadedforState] = useState(false);
  const [dataLoadedforCity, setDataLoadedforCity] = useState(false);
  const [stateData, setStateData] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [selectedStateIdandName, setSelectedStateIdandName] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCityIdandName, setSelectedCityIdandName] = useState(null);
  const [dataLoadedforEvent, setDataLoadedforEvent] = useState(false);
  const [event, setEvent] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openStartPicker, setOpenStartPicker] = useState(false);
  const [openEndPicker, setOpenEndPicker] = useState(false);
  const [imageUri, setImageUri] = useState([]);
  const [parsedPhotoData, setParsedPhotoData] = useState('');

  const [eventTitle, setEventTitle] = useState('');

  const [address, setAddress] = useState('');
  const [thumbImg, setThumbImg] = useState('');
  const [description, setDescripton] = useState('');

  const token = useSelector(state => state.AuthReducer.authToken);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getStateData();
    setRefreshing(false);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const PostNewEvent = (
    banner_image,
    city,
    description,
    end_datetime,
    event_type,
    start_datetime,
    state,
    thumb_image,
    title,
    venue,
  ) => {
    PostEvent(
      token,
      banner_image,
      city,
      description,
      end_datetime,
      event_type,
      start_datetime,
      state,
      thumb_image,
      title,
      venue,
    )
      .then(res => {
        console.log('asssssssss', res);
        Alert.alert('Events Created');
        // console.log(Object.values(res).join('\n'));
        // Alert.alert(Object.values(res).join('\n'));
        formsubmitted();
      })
      .catch(error => {
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      });
  };

  const formsubmitted = () => {
    navigation.navigate(routes.EVENTSSCREEN);
  };

  const getCitiesData = stateId => {
    getCities(token, stateId)
      .then(response => {
        console.log('Cities' + response.data);
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
    console.log('Selected Name:', selectedName);
    console.log('Selected ID:', selectedId);
    setDataLoadedforCity(true);
  };
  const getStateData = () => {
    setApiFailed(false);
    getState(token)
      .then(response => {
        console.log('States' + response.data);
        setStateData(response.data);
      })
      .catch(error => {
        // console.log(error);

        setApiFailed(true);
      });
  };
  const handleStateDropdown = selectedItem => {
    setSelectedStateIdandName(selectedItem);
    handlestatedropdown(selectedItem);
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
  const handlestatedropdown = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = stateData.find(
      country => country.id === selectedId,
    )?.name;
    setSelectedState(selectedName);
    console.log('Selected Name:', selectedName);
    console.log('Selected ID:', selectedId);
    getCitiesData(selectedId);
    setDataLoadedforState(true);
  };
  const statedropdownoptions = stateData
    ? stateData.map(state => ({
        label: state.name,
        value: state.id.toString(),
      }))
    : [];

  useEffect(() => {
    getStateData();
  }, []);

  const EventOptions = [
    {label: 'Only For Community', value: 'Only For Community'},
    {label: 'General (For All)', value: 'General (For All)'},
  ];
  const handleEventTypeDropDown = item => {
    setEvent(item.value);
    console.log(item.value);
    setDataLoadedforEvent(true);
  };
  const handleClearEvent = () => {
    setEvent(null);
    setDataLoadedforEvent(false);
  };

  const formatDateforSending = date => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const [formattedStartDateForSending, setFormattedStartDateForSending] =
    useState(formatDateforSending(startDate));

  const [formattedEndDateForSending, setFormattedEndDateForSending] =
    useState('');

  useEffect(() => {
    setFormattedStartDateForSending(formatDateforSending(startDate));
  }, [startDate]);

  useEffect(() => {
    setFormattedEndDateForSending(formatDateforSending(endDate));
  }, [endDate]);

  const UploadImage = data => {
    console.log('Uploading image with data:', data);

    uploadSingleImage(token, data)
      .then(response => {
        console.log('Image uploaded successfully:', response.data.image);
        setParsedPhotoData(response.data.image);
      })
      .catch(error => {
        // console.error('Error uploading image:', error);
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setApiFailed(true);
      });
  };
  const selectPhoto = () => {
    return new Promise((resolve, reject) => {
      DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      })
        .then(doc => {
          resolve(doc);
          setImageUri(doc.uri);
          UploadImage(doc);
        })
        .catch(err => {
          if (DocumentPicker.isCancel(err)) {
            resolve();
          } else {
            reject(err);
          }
        });
    });
  };

  const handleDeletePhoto = () => {
    setParsedPhotoData('');
  };

  const handleSubmit = () => {
    // Initialize an array to store error messages for each field
    const errors = [];

    // Perform validations for each field
    if (
      !event ||
      !selectedCity ||
      !eventTitle ||
      !selectedState ||
      !address ||
      !formattedStartDateForSending ||
      !formattedEndDateForSending ||
      !description
    ) {
      errors.push('Please Fill out all the Mandatory Details');
    }
    if (errors.length > 0) {
      const errorMessage = errors.join('\n'); // Join error messages with newline character
      Alert.alert(errorMessage);
      return;
    }

    PostNewEvent(
      parsedPhotoData,
      selectedCity,
      description,
      formattedEndDateForSending,
      event,
      formattedStartDateForSending,
      selectedState,
      thumbImg,
      eventTitle,
      address,
    );
    // All fields are filled, proceed with form submission
  };
  return (
    <ScrollView
      style={styles.maincontainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {!apiFailed && stateData ? (
        <>
          <View style={styles.outercontainer}>
            <View style={styles.head_container}>
              <Text style={styles.headtext}>Create New Event</Text>
            </View>
            <View style={styles.innercontainer}>
              <View style={styles.contentcontainer}>
                <Text style={styles.labeltext}>
                  Event Title: <Text style={{color: colors.danger}}>*</Text>
                </Text>
                <TextInput
                  style={styles.inputbox}
                  placeholderTextColor={colors.black}
                  placeholder="Enter Event Title"
                  value={eventTitle}
                  onChangeText={text => {
                    setEventTitle(text);
                  }}></TextInput>
              </View>
              <View style={styles.dropdowncontainer}>
                <Text style={styles.labeltext}>
                  Event Type <Text style={{color: colors.danger}}>*</Text>
                </Text>
                <Dropdown
                  style={styles.dropdown}
                  data={EventOptions}
                  search // Enable search functionality
                  itemTextStyle={styles.itemTextStyle}
                  placeholderStyle={styles.placeholderStyle}
                  inputSearchStyle={styles.searchTextInput}
                  selectedTextStyle={styles.selectedTextStyle}
                  labelField="label"
                  valueField="value"
                  maxHeight={300}
                  placeholder={'--Select Job Type--'}
                  searchPlaceholder="Search..."
                  value={event}
                  onChange={handleEventTypeDropDown}
                  renderRightIcon={() => {
                    if (dataLoadedforEvent && event !== null) {
                      return (
                        <FontAwesome6
                          name="circle-xmark"
                          color={colors.danger}
                          size={22}
                          onPress={handleClearEvent}
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

              <View style={styles.dropdowncontainer}>
                <Text style={styles.labeltext}>
                  State <Text style={{color: colors.danger}}>*</Text>
                </Text>
                {stateData && (
                  <Dropdown
                    style={styles.dropdown}
                    data={statedropdownoptions}
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
                        return (
                          <FontAwesome6
                            name="circle-xmark"
                            color={colors.danger}
                            size={22}
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
              </View>
              <View style={styles.dropdowncontainer}>
                <Text style={styles.labeltext}>
                  City <Text style={{color: colors.danger}}>*</Text>
                </Text>
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
                        <FontAwesome6
                          name="circle-xmark"
                          color={colors.danger}
                          size={22}
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

              <View style={styles.inputcontainerwithlabel}>
                {/* Start Date */}
                <Text style={styles.labeltext}>
                  Start Date <Text style={{color: colors.danger}}>*</Text>
                </Text>
                <View style={styles.calendarBox}>
                  <TextInput
                    style={styles.calendarBoxInput}
                    value={
                      startDate ? formatDateforSending(startDate) : 'yyyy/mm/dd'
                    }
                    editable={false}
                  />

                  <TouchableOpacity onPress={() => setOpenStartPicker(true)}>
                    <View style={styles.iconcontainer}>
                      <FontAwesome5 name="calendar" color={'blue'} size={26} />
                    </View>
                  </TouchableOpacity>

                  <DatePicker
                    modal
                    mode="datetime"
                    open={openStartPicker}
                    date={startDate || today}
                    minimumDate={today}
                    onConfirm={selectedDate => {
                      if (endDate && selectedDate > endDate) {
                        // Handle the error: end date is before start date
                        Alert.alert(
                          'Invalid Date',
                          'Start Date cannot be earlier than End Date',
                        );
                      } else {
                        setStartDate(selectedDate);
                      }
                      setOpenStartPicker(false);
                    }}
                    onCancel={() => {
                      setOpenStartPicker(false);
                    }}
                  />
                </View>
              </View>
              <View style={styles.inputcontainerwithlabel}>
                <Text style={styles.labeltext}>
                  End Date <Text style={{color: colors.danger}}>*</Text>
                </Text>
                <View style={styles.calendarBox}>
                  <TextInput
                    style={styles.calendarBoxInput}
                    placeholderTextColor={colors.black}
                    editable={false}
                    value={
                      endDate ? formatDateforSending(endDate) : 'yyyy/dd/mm'
                    }></TextInput>
                  <TouchableOpacity onPress={() => setOpenEndPicker(true)}>
                    <View style={styles.iconcontainer}>
                      <FontAwesome5 name="calendar" color={'blue'} size={26} />
                    </View>
                  </TouchableOpacity>
                  <DatePicker
                    modal
                    mode="datetime"
                    open={openEndPicker}
                    date={endDate || startDate || today}
                    minimumDate={startDate || today}
                    onConfirm={selectedDate => {
                      if (startDate && selectedDate < startDate) {
                        // Handle the error: end date is before start date
                        Alert.alert(
                          'Invalid Date',
                          'End Date cannot be earlier than Start Date',
                        );
                      } else {
                        setEndDate(selectedDate);
                      }
                      setOpenEndPicker(false);
                    }}
                    onCancel={() => {
                      setOpenEndPicker(false);
                    }}
                  />
                </View>
              </View>
              <View style={styles.contentcontainer}>
                <Text style={styles.labeltext}>Address:</Text>
                <TextInput
                  style={styles.inputbox}
                  placeholderTextColor={colors.black}
                  placeholder="i.e. company name or organization"
                  value={address}
                  onChangeText={text => {
                    setAddress(text);
                  }}></TextInput>
              </View>
              <View style={styles.bottomcontainer}>
                <View>
                  <Text style={styles.uploadcontianerheadtext}>
                    Logo Image(Optional)
                  </Text>
                  <Text style={styles.uploadcontainersubheadtext}>
                    Image should be in png,jpg,jgep format
                  </Text>
                  <TouchableOpacity
                    style={styles.browsebox}
                    onPress={selectPhoto}>
                    <View style={styles.browsebutton}>
                      <Text style={styles.uploadcontainerText}>Browse..</Text>
                    </View>

                    <TextInput style={styles.browseInputBox} editable={false}>
                      {parsedPhotoData}
                    </TextInput>
                  </TouchableOpacity>
                </View>
                <View style={styles.bottomshowcontainer}>
                  {parsedPhotoData && imageUri ? (
                    <View style={styles.showcontainerimage}>
                      <Image
                        source={{uri: imageUri}}
                        style={styles.showcontainerimagestyle}
                      />
                      <View style={styles.deleteButtonImage}>
                        <TouchableOpacity
                          style={styles.crossmark}
                          onPress={handleDeletePhoto}>
                          <Text style={{color: colors.white}}>X</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.showcontainerimage}>
                      <Text>No Image Selected</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.contentcontainer}>
                <Text style={styles.labeltext}>
                  Description <Text style={{color: colors.danger}}>*</Text>
                </Text>
                <TextInput
                  style={styles.inputbox}
                  placeholderTextColor={colors.black}
                  placeholder="i.e. Description"
                  multiline={true}
                  onChangeText={text => {
                    setDescripton(text);
                  }}></TextInput>
              </View>
              <View>
                <TouchableOpacity
                  // onPress={handleSubmit}
                  style={styles.submitbutton}
                  onPress={handleSubmit}>
                  <Text style={styles.submittext}>SUBMIT</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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

export default CreateEvent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
  },
  outercontainer: {
    backgroundColor: '#FFFFFF',
    margin: 5,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: colors.grayLight,
  },
  head_container: {margin: 10},
  headtext: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 18,
  },
  innercontainer: {
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    borderColor: colors.grayLight,
  },
  contentcontainer: {marginTop: 5},
  labeltext: {
    color: colors.black,
    fontSize: 15,
    marginLeft: 5,
  },
  inputbox: {
    borderWidth: 1,
    color: colors.black,
    borderColor: colors.grayLight,
  },
  dropdowncontainer: {
    marginTop: 5,
  },

  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.grayLight,
    padding: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: colors.black,
    margin: 5,
  },
  selectedTextStyle: {
    fontSize: 16,
    marginLeft: 5,
    color: colors.black,
  },
  itemTextStyle: {
    color: colors.black,
  },
  searchTextInput: {
    color: colors.black,
  },
  inputcontainerwithlabel: {
    marginTop: 10,
  },
  labeltext: {
    fontSize: 15,
    color: colors.black,
  },
  calendarBox: {
    borderWidth: 1,
    borderColor: colors.grayLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calendarBoxInput: {
    width: 200,
    fontSize: 15,
    marginLeft: 5,
    color: colors.black,
  },
  iconcontainer: {
    marginRight: 20,
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomcontainer: {},
  bottomshowcontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  uploadcontianerheadtext: {
    color: colors.black,
    fontSize: 18,
    margin: 5,
    textAlign: 'center',
  },
  uploadcontainersubheadtext: {
    color: colors.orange,
    margin: 5,
  },
  browsebox: {
    borderWidth: 1,
    borderColor: colors.grayLight,
    flexDirection: 'row',
  },
  browsebutton: {
    width: 80,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
  },
  browseInputBox: {
    width: 200,
    color: colors.black,
  },
  uploadcontainerText: {
    fontSize: 15,
    color: colors.black,
  },
  showcontainerimage: {
    position: 'relative',
    margin: 10,
  },
  deleteButtonImage: {
    position: 'absolute',
    top: -4,
    right: -6,
  },
  crossmark: {
    backgroundColor: colors.danger,
    width: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  showcontainerpdf: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
    gap: 10,
  },
  showcontainerimagestyle: {
    width: 60,
    height: 60,
  },
  bottomshowcontainerPdf: {},

  deleteButtonPdf: {},
  contentcontainerinfo: {
    marginTop: 5,
  },
  contenthead: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentheadtext: {
    color: colors.black,
    fontSize: 20,
  },
  infocontainer: {
    margin: 3,
  },
  submitbutton: {
    backgroundColor: '#ffc107',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
  },
  submittext: {
    fontSize: 18,
    color: colors.black,
  },
  inputBoxInvalid: {
    borderColor: colors.danger,
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
