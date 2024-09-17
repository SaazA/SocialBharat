import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  Image,
  RefreshControl,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import colors from '../../../constants/colors';
import {Dropdown} from 'react-native-element-dropdown';
import {ScrollView} from 'react-native';
import DatePicker from 'react-native-date-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {
  createMatrimonialProfile,
  getCastes,
  getCities,
  getProfile,
  getState,
  uploadBiodataPdf,
  uploadImages,
} from '../../../apis/apicalls';
import {useSelector} from 'react-redux';
import DocumentPicker from 'react-native-document-picker';
import Slider from '@react-native-community/slider';
import routes from '../../../constants/routes';

const AddMatrimonial = ({navigation}) => {
  const token = useSelector(state => state.AuthReducer.authToken);
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);

  const [personalValue, setPersonalValue] = useState(null);
  const [dataLoadedforPersonalValue, setDataLoadedforPersonalValue] =
    useState(false);
  const [gender, setGender] = useState(null);
  const [dataLoadedforgender, setDataLoadedforgender] = useState(false);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [subCastes, setSubCastes] = useState(null);
  const [slectedCasteidAndName, setSlectedCasteidAndName] = useState(null);
  const [subCasteId, setSubCasteId] = useState('');
  const [manglik, setManglik] = useState();
  const [sliderValueForFeet, setSliderValueForFeet] = useState(0);
  const [sliderValueForInches, setSliderValueForInches] = useState(0);
  const [skinTone, setSkinTone] = useState('DARK');
  const [dataLoadedforCaste, setDataLoadedforCaste] = useState(false);
  const [dataLoadedforState, setDataLoadedforState] = useState(false);
  const [dataLoadedforCity, setDataLoadedforCity] = useState(false);
  const [stateData, setStateData] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [selectedStateIdandName, setSelectedStateIdandName] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCityIdandName, setSelectedCityIdandName] = useState(null);
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [MotherName, setMotherName] = useState('');
  const [paternalGotra, setPaternalGotra] = useState('');
  const [maternalGotra, setMaternalGotra] = useState('');
  const [jobPackage, setJobPackage] = useState('');
  const [noOfBrothers, setNumberOfBrothers] = useState(0);
  const [noOfSisters, setNumberOfSisters] = useState(0);
  const [sisterDetails, setSisterDetails] = useState('Hy');
  const [dataLoadedforOccupation, setDataLoadedforOccupation] = useState(false);
  const [occupation, setOccupation] = useState('');
  const [dataLoadedForManglik, setDataLoadedForManglik] = useState(false);
  const [education, setEducation] = useState('');
  const [dataLoadedForEducation, setDataLoadedForEducation] = useState('');
  const [photoData, setPhotoData] = useState('');
  const [parsedPhotoData, setParsedPhotoData] = useState('');
  const [documentData, setDocumentData] = useState('');
  const [parsedDocumentData, setParsedDocumentData] = useState('');
  const [descriptionData, setDescriptionData] = useState('');
  const [imageUri, setImageUri] = useState([]);

  const [MNumber, setMNumber] = useState();
  // const getUserProfile = ()=>{
  //   getProfile(token)
  //       .then(response => {
  //         console.log('UserProfiles' + JSON.stringify(response.data));
  //       })
  //       .catch(error => {
  //         console.log(error);
  //       });
  // }

  // useEffect(()=>{
  //   getUserProfile()
  // },[])

  const createProfile = (
    biodata,
    brother_count,
    city,
    contact_number,
    description,
    education,
    father_name,
    height_in_feet,
    is_manglik,
    maternal_gotra,
    matrimonial_profile_dob,
    matrimonial_profile_gender,
    matrimonial_profile_name,
    matrimonial_profile_occupation,
    mother_name,
    paternal_gotra,
    profile_created_for,
    proposal_photos,
    salary_package,
    sister_count,
    sisters_details,
    skin_tone,
    state,
    subcast_id,
  ) => {
    createMatrimonialProfile(
      token,
      biodata,
      brother_count,
      city,
      contact_number,
      description,
      education,
      father_name,
      height_in_feet,
      is_manglik,
      maternal_gotra,
      matrimonial_profile_dob,
      matrimonial_profile_gender,
      matrimonial_profile_name,
      matrimonial_profile_occupation,
      mother_name,
      paternal_gotra,
      profile_created_for,
      proposal_photos,
      salary_package,
      sister_count,
      sisters_details,
      skin_tone,
      state,
      subcast_id,
    )
      .then(response => {
        console.log('Created profile' + JSON.stringify(response.data));
        Alert.alert('Profile Created');
        navigation.navigate(routes.MATRIMONIALSCREEN);
      })
      .catch(error => {
        let errorMessage = 'An unexpected error occurred';

        if (error.response) {
          // Check if the response has data
          if (error.response.data) {
            const errorData = error.response.data;

            // Check if there are specific errors or a general message
            if (errorData.errors) {
              // Extract the first error message, you can adjust this logic as needed
              const firstErrorKey = Object.keys(errorData.errors)[0];
              errorMessage = errorData.errors[firstErrorKey];
            } else if (errorData.message) {
              errorMessage = errorData.message;
            }
          }
        } else {
          // If no response, use the error's message
          errorMessage = error.message;
        }
        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getStateData();
    setRefreshing(false);
  }, []);

  const getCitiesData = stateId => {
    getCities(token, stateId)
      .then(response => {
        console.log('Cities' + response.data);
        setCityData(response.data);
      })
      .catch(error => {
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
        const errorMessage = error.message || 'An unexpected error occurred';
        // Show the error message in a toast
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

  const ProfileCreatingOptions = [
    {label: 'Self', value: 'Self'},
    {label: 'Brother', value: 'Brother'},
    {label: 'Sister', value: 'Sister'},
    {label: 'Son', value: 'Son'},
    {label: 'Daughter', value: 'Daughter'},
  ];
  const handlePersonalValue = selectedItem => {
    handlePersonalValueDropdown(selectedItem);
    setDataLoadedforPersonalValue(true);
  };
  const handlePersonalValueDropdown = selectedItem => {
    setPersonalValue(selectedItem.value);
    console.log(selectedItem.value);
  };

  const handleClearPersonalValues = () => {
    setPersonalValue(null);
    setDataLoadedforPersonalValue(false);
  };

  const EducationOptions = [
    {label: '10th', value: '10th'},
    {label: '12th', value: '12th'},
    {label: 'Graduate', value: 'Graduate'},
    {label: 'UnderGraduate', value: 'UnderGraduate'},
    {label: 'Diploma', value: 'Diploma'},
    {label: 'UnderDiploma', value: 'UnderDiploma'},
  ];
  const handleEducationOptionsDropdown = selectedItem => {
    handleEducationDropdown(selectedItem);
    setDataLoadedForEducation(true);
  };
  const handleEducationDropdown = selectedItem => {
    setEducation(selectedItem.value);
    console.log(selectedItem.value);
  };

  const handleClearEducationDropdown = () => {
    setEducation(null);
    setDataLoadedForEducation(false);
  };

  const genderoptions = [
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
    {label: 'other', value: ''},
  ];
  const handleGenderDropDown = item => {
    setGender(item.value);
    console.log(item.value);
    setDataLoadedforgender(true);
  };
  const handleClearClickGender = () => {
    setGender(null);
    setDataLoadedforgender(false);
  };
  const formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  const validateDate = selectedDate => {
    const currentDate = new Date();
    const age18 = new Date(
      currentDate.getFullYear() - 18,
      currentDate.getMonth(),
      currentDate.getDate(),
    );
    return selectedDate <= age18;
  };
  const formatDateforSending = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const dateFormatted = formatDateforSending(date);
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
    handleSubcastes(selectedItem);
  };
  const handleSubcastes = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = subCastes.find(
      subCastes => subCastes.subcast_id === selectedId,
    )?.subcast;
    setSubCasteId(selectedId);
    console.log('Selected Name:', selectedName);
    console.log('Selected ID:', selectedId);
    setDataLoadedforCaste(true);
  };
  const handleClearCasteDropdown = () => {
    setDataLoadedforCaste(false);
    setSubCasteId(null);
    setSlectedCasteidAndName(null);
  };
  useEffect(() => {
    getSubCastesData();
  }, []);

  const manglikOptions = [
    {label: 'Yes', value: 'YES'},
    {label: 'No', value: 'NO'},
  ];
  const handleManglikValue = selectedItem => {
    setManglik(selectedItem.value);
    console.log(selectedItem);
    setDataLoadedForManglik(true);
  };
  const handleClearManglikDropdown = () => {
    setManglik(null);
    setDataLoadedForManglik(false);
  };

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
    console.log(item.value);
    setDataLoadedforOccupation(true);
  };
  const handleClearOccupation = () => {
    setOccupation(null);
    setDataLoadedforOccupation(false);
  };

  const handleSliderChangeforFeet = value => {
    const roundedValue = Math.round(value);
    setSliderValueForFeet(roundedValue);
  };
  const handleSliderChangeforInches = value => {
    const roundedValue = Math.round(value);
    setSliderValueForInches(roundedValue);
  };

  const mainHeight = `${sliderValueForFeet}.${sliderValueForInches} `;

  // const selectDoc = () => {
  //   return new Promise((resolve, reject) => {
  //     DocumentPicker.pickSingle({
  //       type: [DocumentPicker.types.pdf],
  //     })
  //       .then(doc => {
  //         resolve(doc);
  //         setDocumentData(doc.name);
  //         UploadPDF(doc);
  //       })
  //       .catch(err => {
  //         if (DocumentPicker.isCancel(err)) {
  //           resolve();
  //         } else {
  //           reject(err);
  //         }
  //       });
  //   });
  // };

  // const UploadPDF = data => {
  //   console.log('Heyee', data);
  //   uploadBiodataPdf(token, data)
  //     .then(response => {
  //       setParsedDocumentData(response.data.file);
  //       console.log('parsedPDFData', response.data);
  //     })
  //     .catch(error => {
  //       const errorMessage = error.message || 'An unexpected error occurred';

  //       // Show the error message in a toast
  //       ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
  //       setApiFailed(true);
  //     });
  // };

  const selectDoc = () => {
    return new Promise((resolve, reject) => {
      DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      })
        .then(doc => {
          const fileSizeInMB = doc.size / (1024 * 1024); // Convert size to MB
          if (fileSizeInMB > 5) {
            // If file size exceeds 5 MB
            const errorMessage = 'File size should not exceed 5 MB';
            ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
            // reject(new Error(errorMessage));
          } else {
            resolve(doc);
            setDocumentData(doc.name);
            UploadPDF(doc);
          }
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

  const UploadPDF = data => {
    console.log('Heyee', data);
    uploadBiodataPdf(token, data)
      .then(response => {
        setParsedDocumentData(response.data.file);
        console.log('parsedPDFData', response.data);
      })
      .catch(error => {
        console.log('Error uploading pdf:', error);
      });
  };
  const UploadImage = data => {
    // console.log('Heyee', imageUri);
    uploadImages(token, data)
      .then(response => {
        setParsedPhotoData(response.data.files);
        console.log('parsedphotoData', response.data);
      })
      .catch(error => {
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setApiFailed(true);
      });
  };

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
    setImageUri(updatedImageUri);

    if (updatedImageUri.length === 0) {
      setParsedPhotoData('');
    }
  };

  const handleDeletePDF = () => {
    setDocumentData(null);
  };

  const handleSubmit = () => {
    // Initialize an array to store error messages for each field
    const errors = [];

    // Perform validations for each field
    if (
      !name ||
      !fatherName ||
      !MotherName ||
      !slectedCasteidAndName ||
      !dateFormatted ||
      !selectedState ||
      !selectedCity
    ) {
      errors.push('Please Fill out all the Mandatory Details');
    }
    // if (!validateDate(new Date(dateFormatted))) {
    //   errors.push('You must be at least 18 years old.');
    //   console.log('hh');
    // }

    console.log('Formatted Date:', dateFormatted);

    // Validate the selected date
    const isValidDate = validateDate(new Date(dateFormatted));
    console.log('Is Valid Date:', isValidDate);

    if (!isValidDate) {
      errors.push('Age must be at least 18 years old.');
      console.log('Date validation failed - User is under 18.');
    }
    if (errors.length > 0) {
      const errorMessage = errors.join('\n'); // Join error messages with newline character
      Alert.alert(errorMessage);
      return;
    }

    // All fields are filled, proceed with form submission
    createProfile(
      parsedDocumentData,
      noOfBrothers,
      selectedCity,
      MNumber,
      descriptionData,
      education,
      fatherName,
      mainHeight,
      manglik,
      maternalGotra,
      dateFormatted,
      gender,
      name,
      occupation,
      MotherName,
      paternalGotra,
      personalValue,
      parsedPhotoData,
      jobPackage,
      noOfSisters,
      sisterDetails,
      skinTone,
      selectedState,
      subCasteId,
    );
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {!apiFailed && stateData ? (
          <>
            <View style={styles.headingcontainer}>
              <Text style={styles.mainheading}>Matrimonial Info</Text>
            </View>
            <View style={styles.formcontainer}>
              <View style={styles.dropdowncontainer}>
                <Text style={styles.dropdowntextLabel}>
                  For Whom, You are creating profile{' '}
                  <Text style={{color: colors.danger}}>*</Text>
                </Text>
                <Dropdown
                  style={styles.dropdown}
                  data={ProfileCreatingOptions}
                  itemTextStyle={styles.itemTextStyle}
                  inputSearchStyle={{color: colors.black}}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  value={personalValue}
                  placeholder="Select item"
                  labelField="label"
                  valueField="value"
                  onChange={handlePersonalValue}
                  renderRightIcon={() => {
                    if (dataLoadedforPersonalValue && personalValue !== null) {
                      return (
                        <FontAwesome6
                          name="circle-xmark"
                          color={colors.danger}
                          size={22}
                          onPress={handleClearPersonalValues}
                        />
                      );
                    } else {
                      return (
                        <FontAwesome5
                          name="caret-down"
                          color={'blue'}
                          size={28}
                        />
                      ); // Hide the broom icon initially
                    }
                  }}
                />
              </View>
              <View style={styles.inputcontainerwithlabel}>
                <Text style={styles.labeltext}>
                  Name <Text style={{color: colors.danger}}>*</Text>
                </Text>
                <TextInput
                  style={styles.inputBox}
                  onChangeText={text => setName(text)}
                  maxLength={30}
                />
              </View>
              <View style={styles.inputcontainerwithlabel}>
                <Text style={styles.labeltext}>
                  Father's Name <Text style={{color: colors.danger}}>*</Text>
                </Text>
                <TextInput
                  style={styles.inputBox}
                  onChangeText={text => setFatherName(text)}
                />
              </View>
              <View style={styles.inputcontainerwithlabel}>
                <Text style={styles.labeltext}>
                  Mother's Name <Text style={{color: colors.danger}}>*</Text>
                </Text>
                <TextInput
                  style={styles.inputBox}
                  onChangeText={text => setMotherName(text)}
                />
              </View>
              <View style={styles.dropdowncontainer}>
                <Text style={styles.dropdowntextLabel}>
                  Gender <Text style={{color: colors.danger}}>*</Text>
                </Text>
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
                        <FontAwesome6
                          name="circle-xmark"
                          color={colors.orange}
                          size={22}
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
              </View>

              <View style={styles.inputcontainerwithlabel}>
                <Text style={styles.labeltext}>
                  Date of Birth <Text style={{color: colors.danger}}>*</Text>
                </Text>
                <View style={styles.calendarBox}>
                  <TextInput
                    style={styles.calendarBoxInput}
                    value={formatDate(date)}
                    editable={false}
                  />
                  <TouchableOpacity onPress={() => setOpen(true)}>
                    <View style={styles.iconcontainer}>
                      <FontAwesome5 name="calendar" color={'blue'} size={26} />
                    </View>
                  </TouchableOpacity>
                  <DatePicker
                    modal
                    mode="date"
                    open={open}
                    date={date}
                    onConfirm={selectedDate => {
                      if (validateDate(selectedDate)) {
                        setDate(selectedDate);
                        console.log('Selected Date: ' + selectedDate);
                      } else {
                        Alert.alert(
                          'Invalid Date',
                          'You must be at least 18 years old.',
                        );
                      }
                      setOpen(false);
                    }}
                    onCancel={() => {
                      setOpen(false);
                    }}
                  />
                </View>
              </View>
              <View style={styles.dropdowncontainer}>
                <Text style={styles.dropdowntextLabel}>
                  State <Text style={{color: colors.danger}}>*</Text>{' '}
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
              <View style={styles.dropdowncontainer}>
                <Text style={styles.dropdowntextLabel}>
                  Subcast <Text style={{color: colors.danger}}>*</Text>
                </Text>
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
                    if (dataLoadedforCaste && subCasteId !== null) {
                      return (
                        <FontAwesome6
                          name="circle-xmark"
                          color={colors.danger}
                          size={22}
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
              </View>
              <View style={styles.inputcontainerwithlabel}>
                <Text style={styles.labeltext}>Paternal Gotra</Text>
                <TextInput
                  style={styles.inputBox}
                  onChangeText={text => setPaternalGotra(text)}
                />
              </View>
              <View style={styles.inputcontainerwithlabel}>
                <Text style={styles.labeltext}>Maternal Gotra</Text>
                <TextInput
                  style={styles.inputBox}
                  onChangeText={text => setMaternalGotra(text)}
                />
              </View>
              <View style={styles.dropdowncontainer}>
                <Text style={styles.dropdowntextLabel}>Manglik</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={manglikOptions}
                  inputSearchStyle={{color: colors.black}}
                  itemTextStyle={styles.itemTextStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  value={manglik}
                  placeholder="Select item"
                  labelField="label"
                  valueField="value"
                  onChange={handleManglikValue}
                  renderRightIcon={() => {
                    if (dataLoadedForManglik && manglik !== null) {
                      return (
                        <FontAwesome6
                          name="circle-xmark"
                          color={colors.danger}
                          size={22}
                          onPress={handleClearManglikDropdown}
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
                <Text style={styles.dropdowntextLabel}>Select Education</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={EducationOptions}
                  search // Enable search functionality
                  itemTextStyle={styles.itemTextStyle}
                  placeholderStyle={styles.placeholderStyle}
                  inputSearchStyle={styles.searchTextInput}
                  selectedTextStyle={styles.selectedTextStyle}
                  labelField="label"
                  valueField="value"
                  maxHeight={300}
                  placeholder={'--Select-Education--'}
                  searchPlaceholder="Search..."
                  value={education}
                  onChange={handleEducationOptionsDropdown}
                  renderRightIcon={() => {
                    if (dataLoadedForEducation && education !== null) {
                      return (
                        <FontAwesome6
                          name="circle-xmark"
                          color={colors.danger}
                          size={22}
                          onPress={handleClearEducationDropdown}
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
                <Text style={styles.dropdowntextLabel}>Select Job Profile</Text>
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
                  placeholder={'--Select-Occupation--'}
                  searchPlaceholder="Search..."
                  value={occupation}
                  onChange={handleOccupationDropDown}
                  renderRightIcon={() => {
                    if (dataLoadedforOccupation && occupation !== null) {
                      return (
                        <FontAwesome6
                          name="circle-xmark"
                          color={colors.danger}
                          size={22}
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
              </View>
              <View style={styles.inputcontainerwithlabel}>
                <Text style={styles.labeltext}>Package / Salary</Text>
                <TextInput
                  style={styles.inputBox}
                  onChangeText={text => setJobPackage(text)}
                  keyboardType="numeric"
                  maxLength={7}
                />
              </View>
              <View style={styles.inputcontainerwithlabel}>
                <Text style={styles.labeltext}>Number of Brothers</Text>
                <TextInput
                  style={styles.inputBox}
                  onChangeText={text => setNumberOfBrothers(text)}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              <View style={styles.inputcontainerwithlabel}>
                <Text style={styles.labeltext}>Number of Sister's</Text>
                <TextInput
                  style={styles.inputBox}
                  onChangeText={text => setNumberOfSisters(text)}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              <View style={styles.inputcontainerwithlabel}>
                <Text style={styles.labeltext}>Other Details</Text>
                <TextInput
                  style={styles.inputBox}
                  onChangeText={text => setDescriptionData(text)}
                />
              </View>
              <View style={styles.inputcontainerwithlabel}>
                <Text style={styles.labeltext}>
                  Mobile Number <Text style={{color: colors.danger}}>*</Text>
                </Text>
                <TextInput
                  style={styles.inputBox}
                  onChangeText={text => setMNumber(text)}
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
              <View style={styles.slidercontainer}>
                <Text style={styles.labeltextforSlider}>
                  Height Measurement
                </Text>
                <View style={styles.mainslidercontainer}>
                  <Text style={styles.slidercontainerheadtext}>Feet:</Text>
                  <Slider
                    minimumValue={0}
                    maximumValue={15}
                    value={sliderValueForFeet}
                    onValueChange={handleSliderChangeforFeet}
                    trackStyle={styles.track}
                    thumbStyle={styles.thumb}
                    minimumTrackTintColor={colors.orange}
                    maximumTrackTintColor={colors.black}
                  />
                  <Text style={styles.sliderValuetext}>
                    {sliderValueForFeet} Feet
                  </Text>
                  <Text style={styles.slidercontainerheadtext}>Inches:</Text>
                  <Slider
                    minimumValue={0}
                    maximumValue={12}
                    value={sliderValueForInches}
                    onValueChange={handleSliderChangeforInches}
                    trackStyle={styles.track}
                    thumbStyle={styles.thumb}
                    minimumTrackTintColor={colors.orange}
                    maximumTrackTintColor={colors.black}
                  />
                  <Text style={styles.sliderValuetext}>
                    {sliderValueForInches} Inches
                  </Text>
                </View>
                <Text style={styles.givenslidervalue}>
                  Height is : {mainHeight}Feet
                </Text>
              </View>
              <View style={styles.bottomcontainer}>
                <View>
                  <Text style={styles.uploadcontianerheadtext}>
                    Proposal Photos
                  </Text>
                  <Text style={styles.uploadcontainersubheadtext}>
                    Add atleast 2 and maximum 5 photos (should be in
                    png,jpg,jgep format)
                  </Text>
                  {/* <View style={styles.browsebox}>
                    <View style={styles.browsebutton}>
                      <TouchableOpacity onPress={selectPhoto}>
                        <Text style={styles.uploadcontainerText}>
                          {' '}
                          Browse..
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.browsetextcontainer}>
                      <TextInput style={styles.browseInputBox} editable={false}>
                        {imageUri}
                      </TextInput>
                    </View>
                  </View> */}
                  <TouchableOpacity
                    style={styles.browsebox}
                    onPress={selectPhoto}>
                    <View style={styles.browsebutton}>
                      <Text style={styles.uploadcontainerText}> Browse..</Text>
                    </View>

                    <TextInput style={styles.browseInputBox} editable={false}>
                      {parsedPhotoData}
                    </TextInput>
                  </TouchableOpacity>
                </View>
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
                <View>
                  <Text style={styles.uploadcontianerheadtext}>BioData</Text>
                  <Text style={styles.uploadcontainersubheadtext}>
                    Upload biodata in pdf format only
                  </Text>
                  <TouchableOpacity
                    style={styles.browsebox}
                    onPress={selectDoc}>
                    <View style={styles.browsebutton}>
                      <Text style={styles.uploadcontainerText}> Browse..</Text>
                    </View>

                    <TextInput style={styles.browseInputBox} editable={false}>
                      {parsedDocumentData ? documentData : ''}
                    </TextInput>
                  </TouchableOpacity>
                </View>
                <View style={styles.bottomshowcontainerPdf}>
                  {documentData && parsedDocumentData && (
                    <View style={styles.showcontainerpdf}>
                      <FontAwesome6
                        name="file"
                        size={18}
                        color={colors.danger}
                      />
                      <Text style={{color: colors.black}}>{documentData}</Text>
                      <TouchableOpacity
                        onPress={handleDeletePDF}
                        style={styles.deleteButtonPdf}>
                        <FontAwesome6
                          name="circle-xmark"
                          size={22}
                          color={colors.danger}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
              <View>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.submitbutton}>
                  <Text style={styles.submittext}>SUBMIT</Text>
                </TouchableOpacity>
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
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    margin: 15,
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 15,
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
  formcontainer: {
    marginTop: 20,
    flex: 1,
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
  searchTextInput: {
    color: colors.black,
  },
  inputBox: {
    height: 50,
    borderWidth: 2,
    color: colors.black,
    padding: 10,
    borderRadius: 15,
  },
  labeltext: {
    marginLeft: 10,
    fontSize: 15,
    color: colors.black,
  },
  inputcontainerwithlabel: {
    marginTop: 10,
    margin: 5,
  },
  calendarBox: {
    borderWidth: 2,
    borderRadius: 20,
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
  track: {
    height: 4,
    borderRadius: 2,
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: colors.blue,
    borderColor: '#30a935',
    borderWidth: 2,
  },
  mainslidercontainer: {
    marginTop: 20,
  },
  slidercontainer: {
    margin: 10,
  },
  labeltextforSlider: {
    marginLeft: 10,
    fontSize: 20,
    color: colors.black,
    textAlign: 'center',
  },
  slidercontainerheadtext: {
    color: colors.gray,
    fontSize: 18,
  },
  sliderValuetext: {
    color: colors.black,
    fontSize: 20,
    textAlign: 'center',
  },
  givenslidervalue: {
    color: colors.black,
    textAlign: 'center',
    marginTop: 15,
    fontSize: 18,
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
    flexDirection: 'row',
    borderRadius: 10,
  },
  browsebutton: {
    width: 80,
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
  bottomcontainer: {
    margin: 8,
  },
  bottomshowcontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bottomshowcontainerPdf: {},
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
  deleteButtonPdf: {},
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

export default AddMatrimonial;
