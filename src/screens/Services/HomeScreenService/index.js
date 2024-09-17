import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';

import {
  createUserService,
  getCities,
  getState,
  getUserServices,
} from '../../../apis/apicalls';
import {useSelector} from 'react-redux';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Dropdown} from 'react-native-element-dropdown';
import colors from '../../../constants/colors';
import {ToastAndroid} from 'react-native';

export default function Services({navigation}) {
  const token = useSelector(state => state.AuthReducer.authToken);
  const [serviceData, setServiceData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCityIdandName, setSelectedCityIdandName] = useState(null);
  const [dataLoadedforState, setDataLoadedforState] = useState(false);
  const [selectedStateIdandName, setSelectedStateIdandName] = useState(null);
  const [dataLoadedforCity, setDataLoadedforCity] = useState(false);
  const [stateData, setStateData] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [selectedService, setSelectedService] = useState('');
  const [dataLoadedforService, setDataLoadedforService] = useState(null);
  const [selectedServiceIdandName, setSelectedServiceIdandName] =
    useState(null);
  const [status, setStatus] = useState('Active');
  const [mobileOne, setMobileOne] = useState();
  const [mobiletwo, setMobileTwo] = useState('');
  const [experience, setExperience] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategorie, setSelectedCategorie] = useState('');
  const [viewCat, setViewCat] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const getServies = () => {
    setApiFailed(false);
    getUserServices(token)
      .then(response => {
        console.log('User Registered Services' + JSON.stringify(response.data));
        const filteredData = response.data.filter(
          service => service.category !== null,
        );

        // Update the state with filtered data

        setServiceData(filteredData);
      })
      .catch(error => {
        console.log(error.response.data);
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        // setApiFailed(true);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getStateData();
    getServies();
    setRefreshing(false);
  }, []);
  const ServiceDropdownOptions = serviceData
    ? serviceData.map(service => ({
        label: service.title,
        value: service.id, // Assuming `id` is the value you want
      }))
    : [];

  const categoriesDropdownOptions = categories
    ? categories.map(service => ({
        label: service,
        value: service,
      }))
    : [];

  const handleCategoriesDropdown = selectedItem => {
    console.log(selectedItem.label);
    handleCategoriesIdandName(selectedItem);
  };

  const handleClearCategoriesDropdown = () => {
    // console.log('Selected categorie ' + selectedCategorie);
    setSelectedCategorie([]);
    setViewCat(null);
  };

  const handleCategoriesIdandName = selectedItem => {
    const selectedName = selectedItem.label;
    setSelectedCategorie(selectedName);
    setViewCat(selectedName);
  };
  const handleServiceDropDown = selectedItem => {
    setSelectedServiceIdandName(selectedItem);
    handleServiceIdandName(selectedItem);
    console.log(selectedItem);
    setDataLoadedforService(true);
  };

  const handleClearServiceDropDown = () => {
    setSelectedService(null);
    setSelectedServiceIdandName(null);
    setDataLoadedforService(false);
    handleClearCategoriesDropdown();
  };
  const handleServiceIdandName = selectedItem => {
    const selectedName = selectedItem.label;
    setSelectedService(selectedName);
    console.log('title: ' + selectedName);
    const selectedData = serviceData.find(item => item.title === selectedName);
    setCategories(selectedData ? selectedData.category.split(',') : []);
  };

  const searchTextInput = () => {
    if (serviceData && Array.isArray(serviceData)) {
      const filteredData = serviceData.filter(service =>
        service?.title?.toLowerCase().includes(searchText?.toLowerCase() || ''),
      );
      return filteredData;
    }
    return [];
  };

  useEffect(() => {
    getServies();
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

  const handleCityIdAndName = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = cityData.find(city => city.id === selectedId)?.name;
    setSelectedCity(selectedName);
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
    setSelectedState(null);
    setSelectedStateIdandName(null);
    setDataLoadedforState(false);
    setCityData(null);
    handleClearCityDropdown();
  };
  const handleSelectedStates = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = stateData.find(state => state.id === selectedId)?.name;
    setSelectedState(selectedName);
    console.log('Selected Name:', selectedName);
    console.log('Selected ID:', selectedId);
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

  const CreateService = (
    city,
    description,
    experience,
    mobile1,
    mobile2,
    state,
    status,
    title,
    category,
  ) => {
    console.log(
      'EVERYTHING ' + token + ' ' + city,
      +' ' +
        description +
        ' ' +
        experience +
        ' ' +
        mobile1 +
        ' ' +
        mobile2 +
        ' ' +
        state +
        ' ' +
        status +
        ' ' +
        title,
      category,
    );
    createUserService(
      token,
      city,
      description,
      experience,
      mobile1,
      mobile2,
      state,
      status,
      title,
      category,
    )
      .then(response => {
        console.log('Messages' + JSON.stringify(response));
        Alert.alert('Service Created');
        handleClearStateDropdown();
        setMobileOne('');
        setMobileTwo('');
        setDescription('');
        setExperience('');
        handleClearServiceDropDown();
      })
      .catch(error => {
        // const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        // const {errors, message} = error.response.data;
        // console.log(errors.title);
        // ToastAndroid.show(errors.title, ToastAndroid.SHORT);
        // // ToastAndroid.show(errorMessage, ToastAndroid.SHORT);

        let errorMessage;

        if (error.response && error.response.data) {
          // Handle backend errors
          const {errors, message} = error.response.data;
          console.log(errors.title);

          // Prioritize specific backend error if available, else fall back to general message
          errorMessage =
            errors.title ||
            message ||
            'An error occurred while processing your request.';
        } else {
          // Handle network or other errors
          errorMessage =
            error.message ||
            'An unexpected error occurred. Please check your internet connection and try again.';
        }

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      });
  };

  // const clearFields = ()=>{

  // }
  const handleUserBasedOnService = (title, id, category) => {
    navigation.navigate('ViewSpecificService', {
      title: title,
      id: id,
      category: category,
    });
  };
  const handleNavToRegisteredServices = () => {
    navigation.navigate('RegisteredServicesByUser');
  };

  const handleSubmit = () => {
    // Initialize an array to store error messages for each field
    const errors = [];
    // console.log({
    //   selectedCity,
    //   description,
    //   experience,
    //   mobileOne,
    //   mobiletwo,
    //   status,
    //   selectedState,
    //   selectedService,
    //   selectedCategorie,
    // });

    // Perform validations for each field
    const validInput = /^[6789]\d{9}$/;

    if (
      !selectedCity ||
      !description ||
      !experience ||
      !mobileOne ||
      !status ||
      !selectedState ||
      !selectedService
    ) {
      errors.push('Please Fill out all the Mandatory Details');
    }
    if (!validInput.test(mobileOne)) {
      errors.push(
        'Mobile number 1 is invalid. It must start with 6, 7, 8, or 9 and be 10 digits long.',
      );
    }

    if (mobiletwo && !validInput.test(mobiletwo)) {
      errors.push(
        'Mobile number 2 is invalid. It must start with 6, 7, 8, or 9 and be 10 digits long.',
      );
    }

    if (errors.length > 0) {
      const errorMessage = errors.join('\n'); // Join error messages with newline character
      Alert.alert(errorMessage);
      return;
    }

    CreateService(
      selectedCity,
      description,
      experience,
      mobileOne,
      mobiletwo,
      selectedState,
      status,
      selectedService,
      selectedCategorie,
    );
    // CreateService(
    //   selectedCity,
    //   description,
    //   experience,
    //   mobileOne,
    //   mobiletwo,
    //   selectedState,
    //   status,
    //   selectedService,
    // );
    // All fields are filled, proceed with form submission
  };
  return (
    <ScrollView
      style={styles.maincontainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {serviceData && !apiFailed ? (
        <View>
          <TouchableOpacity
            onPress={() => {
              handleNavToRegisteredServices();
            }}
            style={styles.viewRegisteredcontainer}>
            <Text style={styles.viewregistredtext}>Registered Services</Text>
          </TouchableOpacity>
          <View style={styles.headercontianer}>
            <Text style={styles.headertext}>All Services</Text>
          </View>
          <View style={styles.contentcontainer}></View>
          <View style={styles.serviceview}>
            {/* <TextInput
          onChangeText={text => setSearchText(text)}
          value={searchText}></TextInput> */}

            <View style={styles.searchboxinput}>
              <FontAwesome5 name="search" color={'#ffc107'} size={24} />
              <TextInput
                style={styles.searchbox}
                placeholder="Search By Name"
                placeholderTextColor={colors.black}
                onChangeText={text => setSearchText(text)}
                value={searchText}
              />
            </View>

            <ScrollView style={styles.cardoutercontainer}>
              {searchTextInput().map(service => (
                <TouchableOpacity
                  style={styles.card}
                  key={service.id}
                  onPress={() => {
                    handleUserBasedOnService(
                      service.title,
                      service.id,
                      service.category,
                    );
                  }}>
                  <Text style={styles.cardboldtext}>{service.title}</Text>
                  <Text style={styles.cardsmalltext}>{service.category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View>
            <View style={styles.headercontianeradd}>
              <Text style={styles.headertext}>Add Services</Text>
            </View>
            <View style={styles.addoutercontainer}>
              <Text style={styles.hinditext}>
                अगर आपकी सेवा उपलब्ध नहीं है, तो 'अन्य' (Other) विकल्प चुनें।
              </Text>
              <View style={styles.dropdownoutsidecontainer}>
                <Text style={styles.textheaddropdown}>
                  Service Type <Text style={{color: colors.danger}}>*</Text>
                </Text>
                <Dropdown
                  style={styles.dropdownservicecat}
                  data={ServiceDropdownOptions}
                  search
                  inputSearchStyle={{color: colors.black}}
                  itemTextStyle={styles.itemTextStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  value={selectedServiceIdandName}
                  placeholder="--Select Your Service--"
                  labelField="label"
                  valueField="value"
                  onChange={handleServiceDropDown}
                  renderRightIcon={() => {
                    if (dataLoadedforService && selectedService !== null) {
                      return (
                        <FontAwesome5
                          name="trash"
                          color={colors.orange}
                          size={20}
                          onPress={handleClearServiceDropDown}
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

                <Text style={styles.textheaddropdown}>
                  Category Type <Text style={{color: colors.danger}}>*</Text>
                </Text>

                <Dropdown
                  style={styles.dropdownservicecat}
                  data={categoriesDropdownOptions}
                  search
                  inputSearchStyle={{color: colors.black}}
                  itemTextStyle={styles.itemTextStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  value={viewCat}
                  placeholder="--Select Your Service--"
                  labelField="label"
                  valueField="value"
                  onChange={handleCategoriesDropdown}
                  renderRightIcon={() => {
                    if (viewCat !== null) {
                      return (
                        <FontAwesome5
                          name="trash"
                          color={colors.orange}
                          size={20}
                          onPress={handleClearCategoriesDropdown}
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
              <View style={styles.textboxcontainer}>
                <Text style={styles.hinditext}>
                  Enter Your mobile number 1{' '}
                  <Text style={{color: colors.danger}}>*</Text>
                </Text>
                <TextInput
                  style={styles.textbox}
                  onChangeText={text => setMobileOne(text)}
                  value={mobileOne}
                  maxLength={10}
                  keyboardType="decimal-pad"></TextInput>
              </View>
              <View style={styles.textboxcontainer}>
                <Text style={styles.hinditext}>Enter Your mobile number 2</Text>
                <TextInput
                  style={styles.textbox}
                  onChangeText={text => setMobileTwo(text)}
                  value={mobiletwo}
                  maxLength={10}
                  keyboardType="decimal-pad"></TextInput>
              </View>
              <View style={styles.textboxcontainer}>
                <Text style={styles.hinditext}>
                  Enter your Experience{' '}
                  <Text style={{color: colors.danger}}>*</Text>
                </Text>
                <TextInput
                  style={styles.textbox}
                  onChangeText={text => setExperience(text)}
                  value={experience}></TextInput>
              </View>

              <Text style={styles.textheaddropdown}>
                Select State<Text style={{color: colors.danger}}>*</Text>
              </Text>
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
              <Text style={styles.textheaddropdown}>
                Select City<Text style={{color: colors.danger}}>*</Text>
              </Text>
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

              <View style={styles.textboxcontainer}>
                <Text style={styles.hinditext}>
                  Enter details <Text style={{color: colors.danger}}>*</Text>
                </Text>
                <TextInput
                  style={styles.textbox}
                  onChangeText={text => setDescription(text)}
                  value={description}></TextInput>
              </View>

              <TouchableOpacity
                style={styles.submitbutton}
                onPress={handleSubmit}>
                <Text style={styles.submitbuttontext}>SUBMIT</Text>
              </TouchableOpacity>
            </View>
          </View>
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

      {/* ========= */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    margin: 5,
    borderRadius: 20,
    flex: 1,
    backgroundColor: colors.white,
  },
  headercontianer: {
    backgroundColor: '#81B5B5',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  serviceview: {
    margin: 5,
    padding: 5,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderColor: colors.grayLight,
  },
  headertext: {
    fontSize: 18,
    color: colors.black,
  },
  contentcontainer: {
    backgroundColor: colors.orange,
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
  dropdownoutsidecontainer: {marginTop: 10},
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
  },
  searchbox: {
    color: colors.black,
    flex: 1,
  },
  card: {
    padding: 30,
    maxHeight: 'auto',
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#C5E2E6',
  },
  cardboldtext: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardsmalltext: {
    color: colors.black,
    fontSize: 14,
  },
  cardoutercontainer: {
    maxHeight: 400,
    borderRadius: 5,
  },
  addserviceUppercard: {
    backgroundColor: '#008374',
  },
  headercontianeradd: {
    backgroundColor: '#008374',
    height: 50,
    marginTop: 0,
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  addoutercontainer: {
    borderWidth: 1,
    borderColor: colors.grayLight,
    padding: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  hinditext: {
    color: colors.black,
    flexWrap: 'wrap',
  },
  dropdownservicecat: {
    // margin: 10,
    marginBottom: 5,
    marginTop: 5,
    height: 60,
    borderBottomColor: colors.black,
    borderWidth: 0.5,
    paddingLeft: 5,
    paddingRight: 5,
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
  textbox: {
    borderWidth: 1,
    borderColor: colors.grayLight,
    marginBottom: 5,
    marginTop: 5,
    color: colors.black,
  },
  textboxcontainer: {
    marginTop: 3,
  },
  submitbutton: {
    backgroundColor: '#008374',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 10,
  },
  submitbuttontext: {
    color: colors.white,
  },
  viewRegisteredcontainer: {
    backgroundColor: colors.bgColor,
    height: 40,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  viewregistredtext: {
    color: colors.black,
    fontSize: 17,
    fontWeight: '500',
  },

  textheaddropdown: {
    fontSize: 16,
    backgroundColor: colors.bgcolorSign_up_in,
    borderRadius: 120,
    color: colors.black,
    textAlign: 'center',
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
