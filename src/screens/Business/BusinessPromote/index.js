import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {TextInput} from 'react-native';
import colors from '../../../constants/colors';
import {Dropdown} from 'react-native-element-dropdown';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {
  CreateNewBusiness,
  getCities,
  getState,
  uploadImages,
} from '../../../apis/apicalls';
import {useSelector} from 'react-redux';
import {TouchableOpacity} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {Image} from 'react-native';
import routes from '../../../constants/routes';
const BusinessPromotion = ({navigation}) => {
  const token = useSelector(state => state.AuthReducer.authToken);
  const [dataLoadedforState, setDataLoadedforState] = useState(false);
  const [dataLoadedforCity, setDataLoadedforCity] = useState(false);
  const [stateData, setStateData] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [selectedStateIdandName, setSelectedStateIdandName] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCityIdandName, setSelectedCityIdandName] = useState(null);
  const [parsedPhotoData, setParsedPhotoData] = useState([]);
  const [imageUri, setImageUri] = useState([]);
  const [dataloadedforStatus, setDataloadedforStatus] = useState(false);
  const [status, setStatus] = useState('');
  const [businessName, setBusinessName] = useState('');

  const [streetAddress, setStreetAddress] = useState('');
  const [contact, setContact] = useState();
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessWebsite, setBusinessWebsite] = useState('');
  const [googleMapLocation, setGoogleMapLocation] = useState('');
  const [description, setDescripton] = useState('');
  const [dataloadedforCategory, setDataloadedforCategory] = useState(false);
  const [category, setCategory] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const [isNumberValid, setisNumberValid] = useState(false);

  const CreateBusiness = (
    business_category,
    business_email,
    business_name,
    business_photos,
    business_website,
    city,
    contact1,
    description,
    google_map_link,
    state,
    status,
    street_address,
  ) => {
    // console.log(
    //   'BC =====' + business_category,
    //   'BE =====' + business_email,
    //   'BN =====' + business_name,
    //   business_photos,
    //   'BW =====' + business_website,
    //   'city =====' + city,
    //   'contact =====' + contact1,
    //   'desc =====' + description,
    //   'googlelink =====' + google_map_link,
    //   'state =====' + state,
    //   'status =====' + status,
    //   'street =====' + street_address,
    // );
    // console.log('Heyee', imageUri);
    if (isPosting) return;
    setIsPosting(true);
    // setApiFailed(false);
    CreateNewBusiness(
      token,
      business_category,
      business_email,
      business_name,
      business_photos,
      business_website,
      city,
      contact1,
      description,
      google_map_link,
      state,
      status,
      street_address,
    )
      .then(response => {
        console.log('businessData', response.data);
        setIsPosting(false);
        Alert.alert(
          'Business Posted Successfully', // Title
          '', // Message
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate(routes.BUSISNESSSCREEN),
            },
          ],
          {cancelable: false},
        );
      })
      .catch(error => {
        // console.log('Error posting businessData:', error);
        // Alert.alert(
        const errorMessage = error.message || 'An unexpected error occurred';
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setIsPosting(false);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getStateData();
    setRefreshing(false);
  }, []);

  const handleSubmit = () => {
    // Initialize an array to store error messages for each field
    const errors = [];

    const validNumber = /^[6789]\d{9}$/;
    if (!validNumber.test(contact)) {
      Alert.alert(
        'Please enter a valid 10-digit mobile number',
        'starting with 6, 7, 8, or 9',
      );
      return;
    }

    // Perform validations for each field
    if (
      !category ||
      !businessName ||
      !selectedCity ||
      // !parsedPhotoData ||
      // !imageUri ||
      !contact ||
      !selectedState ||
      !status ||
      !streetAddress
    ) {
      errors.push('Please Fill out all the Mandatory Details');
    }
    if (errors.length > 0) {
      const errorMessage = errors.join('\n'); // Join error messages with newline character
      Alert.alert(errorMessage);
      return;
    }

    CreateBusiness(
      category,
      businessEmail,
      businessName,
      parsedPhotoData,
      businessWebsite,
      selectedCity,
      contact,
      description,
      googleMapLocation,
      selectedState,
      status,
      streetAddress,
    );
    // All fields are filled, proceed with form submission
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
      // console.log(error);
      const errorMessage = error.message || 'An unexpected error occurred';
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      setApiFailed(true);
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
        const errorMessage = error.message || 'An unexpected error occurred';
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
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

  const selectPhoto = () => {
    return new Promise((resolve, reject) => {
      DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        allowMultiSelection: true,
      })
        .then(doc => {
          if (doc.length > 5 || doc.length < 2) {
            Alert.alert('You can only select up to 2 photos or less than 5 .');
            resolve(); // Resolve to exit early
            return;
          }
          let tr = doc.map(el => {
            return el.uri;
          });
          console.log(tr);
          UploadImage(doc);
          // const name = doc.map(doc => doc.name);
          // setImageName(name);
          // console.log(name);
          setImageUri(tr);
          resolve();
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

  const handleDeletePhoto = index => {
    const updatedImageUri = [...imageUri];
    updatedImageUri.splice(index, 1);
    setParsedPhotoData(updatedImageUri);
    setImageUri(updatedImageUri);
  };

  const UploadImage = data => {
    // console.log('Heyee', imageUri);
    uploadImages(token, data)
      .then(response => {
        setParsedPhotoData(response.data.files);
        console.log('parsedphotoData', response.data);
      })
      .catch(error => {
        // console.log('Error uploading images:', error);
        const errorMessage = error.message || 'An unexpected error occurred';
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setApiFailed(true);
      });
  };

  const decision = [
    {label: 'Active', value: 'Active'},
    {label: 'Inactive', value: 'Inactive'},
  ];

  const handleStatus = item => {
    console.log(item.value);
    setStatus(item.value);
    setDataloadedforStatus(true);
  };
  const handleClearApplyResume = () => {
    setStatus(null);
    setDataloadedforStatus(false);
  };

  const businessCat = [
    {
      label: 'Information Technology (IT)',
      value: 'Information Technology (IT)',
    },
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
    {label: 'Nonprofit Organizations', value: 'Nonprofit Organizations'},
  ];

  const handleCategory = item => {
    console.log(item.value);
    setCategory(item.value);
    setDataloadedforCategory(true);
  };
  const handleClearCategory = () => {
    setCategory(null);
    setDataloadedforCategory(false);
  };

  const handleInputChange = text => {
    // Regular expression to validate the input
    const validInput = /^[6789]\d{0,9}$/;

    // Check if the input matches the regular expression
    if (validInput.test(text)) {
      setContact(text);
      setisNumberValid(true);
    } else {
      console.log('number is invalid');
      setisNumberValid(false);
    }
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {stateData && !apiFailed ? (
        <View style={styles.outercontainer}>
          <View style={styles.headingcontainer}>
            <Text style={styles.mainheading}>Business Info</Text>
          </View>
          <View style={styles.inputcontainerwithlabel}>
            <Text style={styles.labeltext}>
              Business Name <Text style={{color: colors.danger}}>*</Text>
            </Text>
            <TextInput
              style={styles.inputBox}
              onChangeText={text => setBusinessName(text)}
            />
          </View>
          <View style={styles.dropdowncontainer}>
            <Text style={styles.labeltext}>
              Business Category <Text style={{color: colors.danger}}>*</Text>
            </Text>
            <Dropdown
              style={styles.dropdown}
              data={businessCat}
              itemTextStyle={styles.itemTextStyle}
              placeholderStyle={styles.placeholderStyle}
              inputSearchStyle={styles.searchTextInput}
              selectedTextStyle={styles.selectedTextStyle}
              labelField="label"
              valueField="value"
              maxHeight={300}
              placeholder={'--Select--'}
              value={category}
              onChange={handleCategory}
              renderRightIcon={() => {
                if (dataloadedforCategory && category !== null) {
                  return (
                    <FontAwesome6
                      name="circle-xmark"
                      color={colors.danger}
                      size={22}
                      onPress={handleClearCategory}
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
            <Text style={styles.labeltext}>
              Street Address <Text style={{color: colors.danger}}>*</Text>
            </Text>
            <TextInput
              style={styles.inputBox}
              onChangeText={text => setStreetAddress(text)}
            />
          </View>
          <View style={styles.dropdowncontainer}>
            <Text style={styles.dropdowntextLabel}>
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
            <Text style={styles.dropdowntextLabel}>
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
            <Text style={styles.labeltext}>
              Contact <Text style={{color: colors.danger}}>*</Text>
            </Text>
            <TextInput
              style={styles.inputBox}
              keyboardType="numeric"
              placeholder="Enter your number"
              // value={contact}
              placeholderTextColor={colors.black}
              onChangeText={text => handleInputChange(text)}
              maxLength={10}
            />
            {isNumberValid ? (
              <View></View>
            ) : (
              <Text style={[styles.labeltext, styles.dangertext]}>
                Number should start from 6,7,8,9
              </Text>
            )}
          </View>
          <View style={{margin: 5}}>
            <Text style={styles.uploadcontianerheadtext}>Proposal Photos</Text>
            <Text style={styles.uploadcontainersubheadtext}>
              Add atleast 2 and maximum 5 photos (should be in png,jpg,jgep
              format)
            </Text>
            <TouchableOpacity style={styles.browsebox} onPress={selectPhoto}>
              <View style={styles.browsebutton}>
                <Text style={styles.uploadcontainerText}> Browse..</Text>
              </View>

              <TextInput style={styles.browseInputBox} editable={false}>
                {imageUri}
              </TextInput>
            </TouchableOpacity>

            <View style={styles.bottomshowcontainer}>
              {parsedPhotoData &&
                imageUri.map((photo, index) => (
                  <View key={index} style={styles.showcontainerimage}>
                    <Image
                      source={{uri: photo}}
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
                ))}
            </View>
          </View>

          <View style={styles.inputcontainerwithlabel}>
            <Text style={styles.labeltext}>Business Email</Text>
            <TextInput
              style={styles.inputBox}
              onChangeText={text => setBusinessEmail(text)}
            />
          </View>
          <View style={styles.dropdowncontainer}>
            <Text style={styles.labeltext}>
              Status <Text style={{color: colors.danger}}>*</Text>
            </Text>
            <Dropdown
              style={styles.dropdown}
              data={decision}
              itemTextStyle={styles.itemTextStyle}
              placeholderStyle={styles.placeholderStyle}
              inputSearchStyle={styles.searchTextInput}
              selectedTextStyle={styles.selectedTextStyle}
              labelField="label"
              valueField="value"
              maxHeight={300}
              placeholder={'--Select--'}
              value={status}
              onChange={handleStatus}
              renderRightIcon={() => {
                if (dataloadedforStatus && status !== null) {
                  return (
                    <FontAwesome6
                      name="circle-xmark"
                      color={colors.danger}
                      size={22}
                      onPress={handleClearApplyResume}
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
            <Text style={styles.labeltext}>Business Website</Text>
            <TextInput
              style={styles.inputBox}
              onChangeText={text => setBusinessWebsite(text)}
            />
          </View>
          <View style={styles.inputcontainerwithlabel}>
            <Text style={styles.labeltext}>Set Google Map</Text>
            <TextInput
              style={styles.inputBox}
              onChangeText={text => setGoogleMapLocation(text)}
            />
          </View>

          {/* <TouchableOpacity
          style={styles.addbusinessContainer}
          onPress={() => {
            if (!isPosting) handleSubmit();
          }}>
          <Text style={styles.addbusinessbutton} disabled>
            Submit
          </Text>
        </TouchableOpacity> */}
          <TouchableOpacity
            style={[
              styles.addbusinessContainer,
              isPosting && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={isPosting}>
            <Text style={styles.addbusinessbutton}>Submit</Text>
          </TouchableOpacity>
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

export default BusinessPromotion;

const styles = StyleSheet.create({
  inputcontainerwithlabel: {
    marginTop: 10,
    margin: 5,
  },
  labeltext: {
    marginLeft: 10,
    fontSize: 15,
    color: colors.black,
  },
  inputBox: {
    height: 50,
    borderWidth: 2,
    color: colors.black,
    padding: 10,
    borderRadius: 15,
  },
  mainheading: {
    textAlign: 'center',
    color: colors.black,
    fontSize: 20,
  },
  headingcontainer: {
    margin: 10,
    backgroundColor: colors.grayLight,
    borderRadius: 50,
  },
  outercontainer: {
    backgroundColor: colors.white,
    margin: 10,
    elevation: 10,
  },
  dropdowncontainer: {
    margin: 5,
  },
  dropdowntextLabel: {
    color: colors.black,
    marginLeft: 10,
    fontSize: 15,
  },
  dropdown: {
    borderRadius: 15,
    height: 50,
    borderWidth: 2,
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
  showcontainerimage: {
    position: 'relative',
    margin: 10,
  },
  bottomshowcontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  browsebox: {
    borderWidth: 2,
    flexDirection: 'row',
    borderRadius: 10,
  },
  browsebutton: {
    width: 80,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: colors.grayLight,
  },
  browseInputBox: {
    width: 200,
    color: colors.black,
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
  showcontainerimagestyle: {
    width: 60,
    height: 60,
  },
  uploadcontainerText: {
    fontSize: 15,
    color: colors.black,
  },
  addbusinessbutton: {
    textAlign: 'center',
    color: colors.black,
    fontSize: 16,
  },
  addbusinessContainer: {
    backgroundColor: '#ffc107',
    height: 40,
    justifyContent: 'center',
    margin: 10,
    elevation: 25,
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: colors.grayLight, // Example disabled style, adjust as needed
  },
  dangertext: {
    color: colors.danger,
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
