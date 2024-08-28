import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {
  CreatenewJob,
  getCities,
  getState,
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

const CreateJobScreen = ({navigation}) => {
  const [dataLoadedforState, setDataLoadedforState] = useState(false);
  const [dataLoadedforCity, setDataLoadedforCity] = useState(false);
  const [stateData, setStateData] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [selectedStateIdandName, setSelectedStateIdandName] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCityIdandName, setSelectedCityIdandName] = useState(null);
  const [dataLoadedforOccupation, setDataLoadedforOccupation] = useState(false);
  const [occupation, setOccupation] = useState('');
  const [dataLoadedforOccupationtype, setDataLoadedforOccupationtype] =
    useState(false);
  const [occupationtype, setOccupationtype] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openStartPicker, setOpenStartPicker] = useState(false);
  const [openEndPicker, setOpenEndPicker] = useState(false);
  const [imageUri, setImageUri] = useState([]);
  const [parsedPhotoData, setParsedPhotoData] = useState('');
  const [documentData, setDocumentData] = useState('');
  const [parsedDocumentData, setParsedDocumentData] = useState('');
  const [decisionResume, setDecisionResume] = useState();
  const [decisionUrl, setDecisionUrl] = useState();
  const [dataLoadedForResume, setDataLoadedforResume] = useState('');
  const [dataLoadedForUrl, setDataLoadedforUrl] = useState('');
  const [decisionForResume, setDecisionForResume] = useState(0);
  const [decisionForUrl, setDecisionForUrl] = useState();
  const [jobtitle, setjobtitle] = useState('');
  const [subHeading, setSubHeading] = useState('');
  const [fee, setfee] = useState('');
  const [address, setAddress] = useState('');
  const [applyLinkUrl, setApplyLinkUrl] = useState('');
  const [description, setDescripton] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const [activeForUrlApply, setActiveForUrlApply] = useState(false);
  const token = useSelector(state => state.AuthReducer.authToken);

  const today = new Date();

  const createNewJob = (
    job_title,
    job_sector,
    job_type,
    job_subheading,
    location,
    attachment,
    logo,
    description,
    apply_link,
    job_apply_form,
    job_start_date,
    job_end_date,
    fee_details,
    state,
    city,
    resume_apply,
  ) => {
    CreatenewJob(
      token,
      job_title,
      job_sector,
      job_type,
      job_subheading,
      location,
      attachment,
      logo,
      description,
      apply_link,
      job_apply_form,
      job_start_date,
      job_end_date,
      fee_details,
      state,
      city,
      resume_apply,
    )
      .then(res => {
        console.log('asssssssss' + JSON.stringify(res.data));
        Alert.alert('Job Created');
        formsubmitted();
      })
      .catch(error => {
        console.log(error.response.data);
        // const errorMessage = error.message || 'An unexpected error occurred';

        // // Show the error message in a toast
        // ToastAndroid.show(errorMessage, ToastAndroid.SHORT);

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

        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      });
  };

  const addOneDay = date => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getStateData();
    setRefreshing(false);
    setjobtitle(),
      setOccupation(null),
      setOccupationtype(null),
      setSubHeading(),
      setAddress(),
      setParsedDocumentData(),
      setParsedPhotoData(),
      setDescripton(),
      setApplyLinkUrl(),
      setDecisionForUrl(),
      setFormattedStartDateForSending(),
      setFormattedEndDateForSending(),
      setfee(),
      setStartDate(null);
    setEndDate(null);
    setSelectedState(null), setSelectedCity(null), setDecisionForResume();
  }, []);

  const formsubmitted = () => {
    navigation.navigate(routes.JOBSSCREEN);
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

  const occupationtypeOptions = [
    {label: 'Part Time', value: 'Part Time'},
    {label: 'Full Time', value: 'Full Time'},
    {label: 'Freelance', value: 'Freelance'},
    {label: 'Other', value: 'Other'},
  ];
  const handleOccupationtypeDropDown = item => {
    setOccupationtype(item.value);
    console.log(item.value);
    setDataLoadedforOccupationtype(true);
  };
  const handleClearOccupationtype = () => {
    setOccupationtype(null);
    setDataLoadedforOccupationtype(false);
  };
  const occupationOptions = [
    {label: 'Government Jobs', value: 'Government Jobs'},
    {label: 'Private Jobs', value: 'Private Jobs'},
    {label: 'Other', value: 'Other'},
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

  const formatDateforSending = date => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

  // const selectDoc = () => {
  //   console.log(formattedEndDateForSending + 'DATEE');
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
  //       console.log('Error uploading pdf:', error);
  //     });
  // };

  const selectDoc = () => {
    console.log(formattedEndDateForSending + 'DATEE');
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

  const selectPhoto = () => {
    return new Promise((resolve, reject) => {
      DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
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
            setImageUri(doc.uri);
            UploadImage(doc);
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

  const UploadImage = data => {
    console.log('Heyee', data);
    uploadSingleImage(token, data)
      .then(response => {
        setParsedPhotoData(response.data.image);
        console.log('parsedphotoData', response.data.image);
      })
      .catch(error => {
        console.log('Error uploading images:', error);
      });

    console.log('asss' + parsedPhotoData);
  };

  // const UploadImage = data => {
  //   console.log('Heyee', data);
  //   uploadSingleImage(token, data)
  //     .then(response => {
  //       setParsedPhotoData(response.data.image);
  //       console.log('parsedphotoData', response.data.image);
  //     })
  //     .catch(error => {
  //       console.log('Error uploading images:', error);
  //     });

  //   console.log('asss' + parsedPhotoData);
  // };

  // const selectPhoto = () => {
  //   return new Promise((resolve, reject) => {
  //     DocumentPicker.pickSingle({
  //       type: [DocumentPicker.types.images],
  //     })
  //       .then(doc => {
  //         resolve(doc);
  //         setImageUri(doc.uri);
  //         UploadImage(doc);
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
  // const selectPhoto = () => {
  //   return new Promise((resolve, reject) => {
  //     DocumentPicker.pick({
  //       type: [DocumentPicker.types.images],
  //     })
  //       .then(doc => {
  //         let tr = doc.map(el => {
  //           return el.uri;
  //         });
  //         console.log(doc);
  //         UploadImage(doc);
  //         // const name = doc.map(doc => doc.name);
  //         // setImageName(name);
  //         // console.log(name);
  //         console.log(tr);
  //         setImageUri(tr);
  //         resolve();
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

  const handleDeletePhoto = () => {
    setParsedPhotoData(null);
  };

  const handleDeletePDF = () => {
    setDocumentData(null);
    setParsedDocumentData('');
  };

  const Info = [
    {
      Hindidata:
        'एक ही समुदाय के लोगों को आपस में जोड़कर उन्हें सामाजिक रूप से जोड़ता है, जिससे समृद्धि और समर्थन में वृद्धि होती है।',
      Englishdata:
        'Brings together people of the same community, fostering social connectivity, leading to growth and support.',
    },
    {
      Hindidata:
        'समुदाय के लोगों को समृद्धि के साथ ही अपने समुदाय से ही जीवनसाथी ढूंढने की सुविधा प्रदान करता है।',
      Englishdata:
        'Provides the community members with the convenience of finding life partners within their community, along with prosperity.',
    },
    {
      Hindidata:
        'सदस्यों को रोजगार और व्यापार की खोज के लिए एक सामाजिक मंच प्रदान करने से उन्हें अधिक अवसर मिलते हैं।',
      Englishdata:
        'By offering a social platform for job and business search, it provides community members with more opportunities.',
    },
    {
      Hindidata:
        'समुदाय के सदस्यों के बीच सामूहिक समर्थन बढ़ता है, जिससे आपसी सहारा मिलता है और समस्याओं का समाधान होता है।',
      Englishdata:
        'Enhances mutual support among community members, providing a collective solution to problems.',
    },
    {
      Hindidata:
        'समुदाय के सदस्यों को जागरूकता और शिक्षा के साधन के रूप में जोड़कर, उन्हें सामाजिक मुद्दों के प्रति जागरूक बनाए रखता है।',
      Englishdata:
        'By connecting community members through awareness and education, it keeps them informed about social issues.',
    },
  ];

  const decision = [
    {label: 'Yes', value: 'Yes'},
    {label: 'No', value: 'No'},
  ];

  const handleApplyUrl = item => {
    if (item.value === 'Yes') {
      setDecisionForUrl('Active');
      setActiveForUrlApply(true);
    } else {
      setDecisionForUrl('Inactive');
      setActiveForUrlApply(false);
    }
    setDecisionUrl(item.value);
    console.log(item.value);
    setDataLoadedforUrl(true);
  };
  const handleClearApplyUrl = () => {
    setDecisionUrl(null);
    setDataLoadedforUrl(false);
  };

  const handleApplyResume = item => {
    if (item.value === 'Yes') {
      setDecisionForResume(1);
    } else {
      setDecisionForResume(0);
    }

    console.log(item.value);
    setDecisionResume(item.value);
    setDataLoadedforResume(true);
  };
  const handleClearApplyResume = () => {
    setDecisionResume(null);
    setDataLoadedforResume(false);
  };

  const [ifvalid, setifvalid] = useState(true);

  const setjob = () => {
    if (jobtitle !== '') {
      setifvalid(true);
    } else {
      setifvalid(false);
    }
  };

  useEffect(() => {
    // Assume setActiveForUrlApply() is a function that returns true or false based on some logic
    const isActive = setActiveForUrlApply();
    setActiveForUrlApply(isActive);
  }, []);

  const handleSubmit = () => {
    // Initialize an array to store error messages for each field
    const errors = [];

    if (!jobtitle || !jobtitle.trim()) {
      Alert.alert('Validation Error', 'Please select Enter Job Title');
      return;
    }
    if (!occupation) {
      Alert.alert('Validation Error', 'Please select a Job Sector.');
      return;
    }
    if (!occupationtype) {
      Alert.alert('Validation Error', 'Please select a Job Profile.');
      return;
    }
    if (!selectedCity) {
      Alert.alert('Validation Error', 'Please select a City.');
      return;
    }

    if (!selectedState) {
      Alert.alert('Validation Error', 'Please select a State.');
      return;
    }
    if (!formattedStartDateForSending) {
      Alert.alert('Validation Error', 'Please select a Start Date.');
      return;
    }
    if (!formattedEndDateForSending) {
      Alert.alert('Validation Error', 'Please select the end Date.');
      return;
    }
    if (!fee || !fee.trim()) {
      Alert.alert('Validation Error', 'Please enter a fee.');
      return;
    }
    if (!decisionForUrl) {
      Alert.alert('Validation Error', 'Please select the decision for Url.');
      return;
    }
    if (!description || !fee.trim()) {
      Alert.alert('Validation Error', 'Please select a description.');
      return;
    }

    // Perform validations for each field
    // if (
    //   !jobtitle ||
    //   !occupation ||
    //   !selectedCity ||
    //   !occupationtype ||
    //   !selectedState ||
    //   !formattedStartDateForSending ||
    //   !formattedEndDateForSending ||
    //   !fee ||
    //   !description
    // ) {
    //   errors.push('Please Fill out all the Mandatory Details');
    // }
    // if (errors.length > 0) {
    //   const errorMessage = errors.join('\n'); // Join error messages with newline character
    //   Alert.alert(errorMessage);
    //   return;
    // }

    createNewJob(
      jobtitle,
      occupation,
      occupationtype,
      subHeading,
      address,
      parsedDocumentData,
      parsedPhotoData,
      description,
      applyLinkUrl,
      decisionForUrl,
      formattedStartDateForSending,
      formattedEndDateForSending,
      fee,
      selectedState,
      selectedCity,
      decisionForResume,
    );
    // All fields are filled, proceed with form submission
  };
  return (
    <ScrollView
      style={styles.maincontainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {stateData && !apiFailed ? (
        <View style={styles.outercontainer}>
          <View style={styles.head_container}>
            <Text style={styles.headtext}>Create New Job</Text>
          </View>
          <View style={styles.innercontainer}>
            <View style={styles.contentcontainer}>
              <Text style={styles.labeltext}>
                Job Title: <Text style={{color: colors.danger}}>*</Text>
              </Text>
              <TextInput
                style={[styles.inputbox, !ifvalid && styles.inputBoxInvalid]}
                placeholderTextColor={colors.black}
                placeholder="Enter Job Title"
                value={jobtitle}
                onChangeText={text => {
                  setjob();
                  setjobtitle(text);
                }}></TextInput>
            </View>
            <View style={styles.dropdowncontainer}>
              <Text style={styles.labeltext}>
                Job Sector <Text style={{color: colors.danger}}>*</Text>
              </Text>
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
                placeholder={'--Select Job Type--'}
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
            <View style={styles.dropdowncontainer}>
              <Text style={styles.labeltext}>
                Job Profile <Text style={{color: colors.danger}}>*</Text>
              </Text>
              <Dropdown
                style={styles.dropdown}
                data={occupationtypeOptions}
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
                value={occupationtype}
                onChange={handleOccupationtypeDropDown}
                renderRightIcon={() => {
                  if (dataLoadedforOccupationtype && occupationtype !== null) {
                    return (
                      <FontAwesome6
                        name="circle-xmark"
                        color={colors.danger}
                        size={22}
                        onPress={handleClearOccupationtype}
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
            <View style={styles.contentcontainer}>
              <Text style={styles.labeltext}>Other SubHeading:</Text>
              <TextInput
                style={styles.inputbox}
                placeholderTextColor={colors.black}
                placeholder="i.e. company name or organization"
                value={subHeading}
                onChangeText={text => {
                  setSubHeading(text);
                }}></TextInput>
            </View>
            <View style={styles.dropdowncontainer}>
              <Text style={styles.labeltext}>
                State <Text style={{color: colors.danger}}>*</Text>
              </Text>

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
            <View style={styles.contentcontainer}>
              <Text style={styles.labeltext}>
                Short Information about Application Fee
                <Text style={{color: colors.danger}}> *</Text>
              </Text>
              <TextInput
                style={styles.inputbox}
                placeholderTextColor={colors.black}
                placeholder="i.e. company name or organization"
                value={fee}
                onChangeText={text => {
                  setfee(text);
                }}></TextInput>
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
                  mode="date"
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
                      if (!endDate || selectedDate >= endDate) {
                        setEndDate(addOneDay(selectedDate));
                      }
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
                  mode="date"
                  open={openEndPicker}
                  date={endDate || addOneDay(startDate) || addOneDay(today)}
                  minimumDate={addOneDay(startDate) || addOneDay(today)}
                  onConfirm={selectedDate => {
                    if (startDate && selectedDate < addOneDay(startDate)) {
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

            <View style={styles.bottomcontainer}>
              <View>
                <Text style={styles.uploadcontianerheadtext}>Attachment</Text>
                <Text style={styles.uploadcontainersubheadtext}>
                  Upload Attachment in pdf format only
                </Text>
                <TouchableOpacity style={styles.browsebox} onPress={selectDoc}>
                  <View style={styles.browsebutton}>
                    <Text style={styles.uploadcontainerText}> Browse..</Text>
                  </View>

                  <TextInput style={styles.browseInputBox} editable={false}>
                    {documentData}
                  </TextInput>
                </TouchableOpacity>
              </View>
              <View style={styles.bottomshowcontainerPdf}>
                {documentData && parsedDocumentData && (
                  <View style={styles.showcontainerpdf}>
                    <FontAwesome6 name="file" size={18} color={colors.danger} />
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
              <View>
                <Text style={styles.uploadcontianerheadtext}>
                  Logo Image(Optional)
                </Text>
                <Text style={styles.uploadcontainersubheadtext}>
                  Image should be in png,jpg,jgep format
                </Text>
                {/* <View style={styles.browsebox}>
                  <View style={styles.browsebutton}>
                    <TouchableOpacity onPress={selectPhoto}>
                      <Text style={styles.uploadcontainerText}> Browse..</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.browsetextcontainer}>
                    <TextInput style={styles.browseInputBox} editable={false}>
                      {parsedPhotoData}
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

            <View style={styles.dropdowncontainer}>
              <Text style={styles.labeltext}>
                Apply From URL? <Text style={{color: colors.danger}}>*</Text>
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
                value={decisionUrl}
                onChange={handleApplyUrl}
                renderRightIcon={() => {
                  if (dataLoadedForUrl && decisionUrl !== null) {
                    return (
                      <FontAwesome6
                        name="circle-xmark"
                        color={colors.danger}
                        size={22}
                        onPress={handleClearApplyUrl}
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
            <View style={styles.contentcontainer}>
              <Text style={styles.labeltext}>Apply Link</Text>
              <TextInput
                style={styles.inputbox}
                placeholderTextColor={colors.black}
                placeholder="Enter the Link"
                value={applyLinkUrl}
                onChangeText={text => {
                  setApplyLinkUrl(text);
                }}
                editable={activeForUrlApply}></TextInput>
            </View>
            <View style={styles.dropdowncontainer}>
              <Text style={styles.labeltext}>Apply With Resume?</Text>
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
                // placeholder={decisionResume}
                value={decisionResume}
                onChange={handleApplyResume}
                renderRightIcon={() => {
                  if (dataLoadedForResume && decisionResume !== null) {
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

            <View style={styles.contentcontainer}>
              <Text style={styles.labeltext}>
                Description <Text style={{color: colors.danger}}>*</Text>
              </Text>
              <TextInput
                style={styles.inputbox}
                placeholderTextColor={colors.black}
                placeholder="i.e. Description"
                onChangeText={text => {
                  setDescripton(text);
                }}></TextInput>
            </View>

            <View style={styles.contentcontainerinfo}>
              <View style={styles.contenthead}>
                <Text style={styles.contentheadtext}>सामाजिक भारत</Text>
              </View>
              {Info.map((item, index) => (
                <View key={index} style={styles.infocontainer}>
                  <Text style={styles.labeltext}>• {item.Hindidata}</Text>
                </View>
              ))}
            </View>
            <View style={styles.contentcontainerinfo}>
              <View style={styles.contenthead}>
                <Text style={styles.contentheadtext}>Social Bharat</Text>
              </View>
              {Info.map((item, index) => (
                <View key={index} style={styles.infocontainer}>
                  <Text style={styles.labeltext}>• {item.Englishdata}</Text>
                </View>
              ))}
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

export default CreateJobScreen;

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
  searchTextInput: {
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
