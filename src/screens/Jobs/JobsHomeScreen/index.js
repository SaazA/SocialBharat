import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Alert,
  Linking,
  RefreshControl,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import Dividedboxcontainer from '../../../Components/dividedboxcontainer';
import {useSelector} from 'react-redux';
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import colors from '../../../constants/colors';
import {Dropdown} from 'react-native-element-dropdown';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getCities,
  getJobs,
  getState,
  getUserAppliedJobs,
  uploadBiodataPdf,
  uploadResume,
  userAppliedJobDetails,
} from '../../../apis/apicalls';
import routes from '../../../constants/routes';

export default function JobsScreen({navigation}) {
  const [jobsData, setJobsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCityIdandName, setSelectedCityIdandName] = useState(null);
  const [dataLoadedforState, setDataLoadedforState] = useState(false);
  const [selectedStateIdandName, setSelectedStateIdandName] = useState(null);
  const [dataLoadedforCity, setDataLoadedforCity] = useState(false);
  const [stateData, setStateData] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [dataLoadedforJobType, setDataLoadedforJobType] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [jobType, setJobType] = useState(null);
  const [documentData, setDocumentData] = useState('');
  const [parsedDocumentData, setParsedDocumentData] = useState(null);
  const [description, setDescripton] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [viewDetail, setViewDetail] = useState(false);

  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [hasNoData, setHasNoData] = useState(false);

  const [isFetching, setIsFetching] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const token = useSelector(state => state.AuthReducer.authToken);
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);

  // const getJobsData = (page, state, city, search, jobType) => {
  //   console.log(page);
  //   if (isFetching) return; // Prevent multiple fetches
  //   setIsFetching(true); //
  //   setHasNoData(false);
  //   getJobs(token, page, state, city, search, jobType)
  //     .then(response => {

  //       setPageCount(response.data.totalRowsAffected);
  //       console.log(response.data.jobs);

  //       setJobsData(prevData => {

  //         const newJobs = response.data.jobs.filter(
  //           job => !prevData.some(prevJob => prevJob.id === job.id),
  //         );
  //         return [...prevData, ...newJobs];
  //       });
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // };

  const getJobsData = (page, state, city, search, jobType) => {
    console.log('HEYYYYYYY', page);
    console.log(isFetching);
    if (isFetching) return; // Prevent multiple fetches
    setIsFetching(true);
    setHasNoData(false);
    setApiFailed(false);

    getJobs(token, page, state, city, search, jobType)
      .then(response => {
        setPageCount(response.data.totalRowsAffected);
        // console.log(response.data); // Log the entire response to verify its structure
        if (response.data.jobs.length < 1) {
          setHasNoData(true);
          setIsFetching(false);
          return;
        }
        // console.log(response.data.jobs); // Log jobs array to verify its content

        setJobsData(prevData => {
          const newJobs = response.data.jobs.filter(
            job => !prevData.some(prevJob => prevJob.id === job.id),
          );
          return [...prevData, ...newJobs];
        });
      })
      .catch(error => {
        // console.log(error);
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setApiFailed(true);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getStateData();
    setJobsData([]);
    setCurrentPage(1);
    getJobsData(1, selectedState, selectedCity, searchText, jobType);
    setRefreshing(false);
  }, []);

  const JobDetailsModal = ({visible, onClose, jobId}) => {
    const job = jobsData.find(jobsData => jobsData.id === jobId);
    // console.log(job);
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {job ? (
              <>
                <Image
                  style={styles.cardImage}
                  source={
                    job.logo && !job.logo.startsWith('http')
                      ? job.photo && job.photo
                        ? {uri: job.photo}
                        : require('../../../assests/nullphotocover.jpg')
                      : job.logo
                      ? {uri: job.logo}
                      : require('../../../assests/nullphotocover.jpg')
                  }
                />

                <Text style={styles.viewmodaltext}>
                  Location:{job.city}({job.state})
                </Text>

                {[
                  {label: 'Job title', value: job.job_title},
                  {label: 'Company Name:', value: job.job_subheading},
                  {
                    label: 'Application Start:',
                    value: job.job_start_date
                      ? moment(job.job_start_date).format('MMMM Do YYYY')
                      : 'NA',
                  },
                  {
                    label: 'Expire Date:',
                    value: job.job_end_date
                      ? moment(job.job_end_date).format('MMMM Do YYYY')
                      : 'NA',
                  },
                  {label: 'Sector', value: job.job_type ? job.job_type : 'NA'},
                  {
                    label: 'Company Address:',
                    value: job.location ? job.location : 'NA',
                  },
                  {
                    label: 'Location:',
                    value:
                      job.city || job.state
                        ? `${job.city}, ${job.state}`
                        : 'NA',
                  },
                ].map((info, index) => (
                  <Dividedboxcontainer
                    key={index}
                    label={info.label}
                    value={info.value}
                  />
                ))}

                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closetext}>Close</Text>
                </TouchableOpacity>
              </>
            ) : (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
          </View>
        </View>
      </Modal>
    );
  };

  useEffect(() => {
    setJobsData([]);
    getJobsData(1, selectedState, selectedCity, searchText, jobType);
  }, [selectedState, selectedCity, searchText, jobType]);

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
        console.log('Cities' + response);
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
    setDataLoadedforCity(false);
    setCurrentPage(1);
  };
  const handleCityIdAndName = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = cityData.find(city => city.id === selectedId)?.name;
    setSelectedCity(selectedName);
    setJobsData([]);
    getJobsData(1, selectedState, selectedName, searchText, jobType);
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
    setPageCount(0);
    setHasNoData(false);
  };
  const handleSelectedStates = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = stateData.find(state => state.id === selectedId)?.name;
    setSelectedState(selectedName);
    console.log('Selected Name:', selectedName);
    console.log('Selected ID:', selectedId);
    getCitiesData(selectedId);
    setDataLoadedforState(true);
    setJobsData([]);
    setHasNoData(false);
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

  const jobTypeOptions = [
    {label: 'All', value: ''},
    {label: 'Full Time', value: 'Full Time'},
    {label: 'Part Time', value: 'Part Time'},
    {label: 'Freelancing', value: 'Freelance'},
    {label: 'Others', value: 'Others'},
  ];

  const handleJobTypeOptions = item => {
    setJobType(item.value);
    setCurrentPage(1);
    setJobsData([]);
    getJobsData(1, selectedState, selectedCity, searchText, item.value);
    setDataLoadedforJobType(true);
  };
  const handleClearJobType = () => {
    setCurrentPage(1);
    setJobType(null);
    setDataLoadedforJobType(false);
  };

  // const handleScroll = event => {
  //   const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
  //   const paddingToBottom = 20;
  //   if (
  //     layoutMeasurement.height + contentOffset.y >=
  //     contentSize.height - paddingToBottom
  //   ) {
  //     if (!isFetching && currentPage == Math.ceil(pageCount / 5)) {
  //       setHasNoData(true);
  //     } else {
  //       // setIsLoading(true);
  //       const nextPage = currentPage + 1;
  //       setCurrentPage(nextPage);
  //       getJobsData(nextPage, selectedState, selectedCity, searchText, jobType);
  //     }
  //   }
  // };

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
        getJobsData(nextPage, selectedState, selectedCity, searchText, jobType);
      }
    }
  };

  const selectDoc = () => {
    return new Promise((resolve, reject) => {
      DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      })
        .then(doc => {
          resolve(doc);
          setDocumentData(doc.name);
          UploadPDF(doc);
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
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setApiFailed(true);
      });
  };

  const UploadResume = (job_description, resume) => {
    uploadResume(token, job_description, resume)
      .then(response => {
        console.log('Resume Uploaded', response);
        setModalVisible(false);
        Alert.alert('Resume Uploaded');
      })
      .catch(error => {
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setApiFailed(true);
      });
  };

  // Function to handle the redirection
  const handleApplyPress = applyLink => {
    console.log(applyLink);
    if (applyLink) {
      const url =
        applyLink.startsWith('http://') || applyLink.startsWith('https://')
          ? applyLink
          : `http://${applyLink}`;
      Linking.openURL(url).catch(err =>
        // console.error('Failed to open URL:', err),
        ToastAndroid.show('Failed to open URL', ToastAndroid.SHORT),
      );
    } else {
      ToastAndroid.show('No Link available', ToastAndroid.SHORT);
      // console.warn('Apply link is not available');
    }
    // if (applyLink) {
    //   Linking.openURL(applyLink).catch(
    //     err => console.warn('Failed to open URL:', err),
    //     Alert.alert('No Link available'),
    //   );
    // } else {
    //   Alert.alert('No Link available');
    //   // console.warn('Apply link is not available');
    // }
  };

  return (
    <>
      <View style={styles.searchboxinput}>
        <FontAwesome5 name="search" color={'#ffc107'} size={24} />
        {!apiFailed && (
          <TextInput
            style={styles.searchbox}
            placeholder="Search By Name"
            placeholderTextColor={colors.black}
            onChangeText={text => {
              setJobsData([]);
              setCurrentPage(1);
              getJobsData(1, selectedState, selectedCity, text, jobType);
              setSearchText(text);
            }}
            value={searchText}
          />
        )}
      </View>
      <ScrollView
        onScroll={handleScroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {jobsData && jobsData.length >= 0 && !apiFailed ? (
          <View style={styles.innercontainer}>
            <View style={styles.createjobs}>
              <TouchableOpacity
                onPress={() => navigation.navigate(routes.CREATENEWJOB)}>
                <Text style={styles.viewmyjobsbutton}>Create New Job</Text>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity
                onPress={() => navigation.navigate(routes.USERCREATEDJOBS)}
                style={styles.viewmyjobs}>
                <Text style={styles.viewmyjobsbutton}>
                  View My Created Jobs
                </Text>
              </TouchableOpacity>
            </View>

            {stateData && (
              <View style={styles.dropdownoutsidecontainer}>
                <Text style={styles.textdropdown}>Search Jobs Board</Text>
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
                {cityData && (
                  <>
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
                  </>
                )}
                <Text style={styles.textheaddropdown}>Select Job Type</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={jobTypeOptions}
                  search
                  inputSearchStyle={styles.searchTextInput}
                  itemTextStyle={styles.itemTextStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  value={jobType}
                  placeholder="--Select--"
                  labelField="label"
                  valueField="value"
                  onChange={handleJobTypeOptions}
                  renderRightIcon={() => {
                    if (dataLoadedforJobType && jobType !== null) {
                      return (
                        <FontAwesome5
                          name="trash"
                          color={colors.orange}
                          size={20}
                          onPress={handleClearJobType}
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
                <View style={styles.addMatrimonialContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(true), setParsedDocumentData(null);
                    }}>
                    <Text style={styles.addMatrimonialbutton}>
                      Upload Resume
                    </Text>
                  </TouchableOpacity>
                </View>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(false);
                  }}>
                  <View style={styles.ModalContianer}>
                    <View style={styles.innerModal}>
                      <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        style={styles.closeicon}>
                        <FontAwesome6
                          name="circle-xmark"
                          color={colors.black}
                          size={26}
                        />
                      </TouchableOpacity>
                      <Text style={styles.uploadcontianerheadtext}>
                        Upload Resume
                      </Text>
                      <Text style={styles.uploadcontainersubheadtext}>
                        Upload Resume in pdf format only
                      </Text>
                      {/* <View style={styles.browsebox}>
                        <View style={styles.browsebutton}>
                          <TouchableOpacity onPress={selectDoc}>
                            <Text style={styles.uploadcontainerText}>
                    
                              Browse..
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.browsetextcontainer}>
                          <TextInput
                            style={styles.browseInputBox}
                            editable={false}
                            value={parsedDocumentData}></TextInput>
                        </View>
                      </View> */}
                      <TouchableOpacity
                        style={styles.browsebox}
                        onPress={selectDoc}>
                        <View style={styles.browsebutton}>
                          <Text style={styles.uploadcontainerText}>
                            Browse..
                          </Text>
                        </View>

                        <TextInput
                          style={styles.browseInputBox}
                          editable={false}>
                          {documentData}
                        </TextInput>
                      </TouchableOpacity>

                      <View>
                        <Text style={styles.uploadcontainersubheadtext}>
                          Write Description
                        </Text>
                        <TextInput
                          style={styles.descbox}
                          onChangeText={text => {
                            setDescripton(text);
                          }}></TextInput>
                      </View>
                      {parsedDocumentData ? (
                        <TouchableOpacity
                          style={styles.submitcontainer}
                          onPress={() => {
                            UploadResume(description, parsedDocumentData);
                          }}>
                          <Text>SUBMIT</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.submitcontainer}
                          onPress={() => {
                            Alert.alert('Please select a document');
                          }}>
                          <Text>SUBMIT</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </Modal>
              </View>
            )}

            <View style={styles.viewmyjobscontainer}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(routes.USERAPPLIEDJOBS);
                }}>
                <Text style={styles.addMatrimonialbutton}>
                  View My Applied Jobs
                </Text>
              </TouchableOpacity>
            </View>

            {jobsData ? (
              jobsData.map((item, index) => {
                return (
                  <View key={item.id}>
                    <View style={styles.card}>
                      <View style={styles.cardphotocontainer}>
                        <Image
                          style={styles.cardImage}
                          source={
                            !item.logo.startsWith('http')
                              ? require('../../../assests/nullphotocover.jpg')
                              : item.logo
                              ? {uri: item.logo}
                              : require('../../../assests/nullphotocover.jpg')
                          }
                        />
                      </View>
                      <View style={styles.cardcontentcontainer}>
                        <Text style={styles.cardjobcentercontainer}>
                          {item.job_title}
                        </Text>
                        <Text style={styles.cardjobcentercontainer}>
                          {item.city && item.state
                            ? `${item.city} (${item.state})`
                            : 'NA'}
                        </Text>
                        <Text style={styles.cardjobcentercontainer}>
                          {item.job_type}
                        </Text>
                      </View>

                      <View style={styles.cardBottomContainer}>
                        <TouchableOpacity
                          style={styles.iconbottomcontainer}
                          onPress={() => {
                            setSelectedJobId(item.id);
                            setViewModalVisible(true);
                          }}>
                          <Text style={styles.buttoncontainer}>
                            View Details
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.viewbuttoncontainer}
                          onPress={() => {
                            handleApplyPress(item.apply_link);
                          }}>
                          <Text style={styles.buttoncontainer}>Easy Apply</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <View>
                <ActivityIndicator size={150} color="#0000ff" />
              </View>
            )}

            {hasNoData ? (
              <View style={styles.nomoretextcontainer}>
                <Text style={styles.nomoretext}>No More Data</Text>
              </View>
            ) : (
              <ActivityIndicator size={'large'} color={colors.danger} />
            )}
            {jobsData ? (
              <JobDetailsModal
                visible={viewModalVisible}
                onClose={() => setViewModalVisible(false)}
                jobId={selectedJobId}
              />
            ) : (
              <View></View>
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
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  cardcontainer: {},
  cardcontainerupperleft: {
    margin: 10,
  },
  cardcontainerupperright: {
    margin: 10,
  },
  image: {
    margin: 10,
    width: 40,
    height: 40,
  },
  cardtextsmall: {},
  cardtextbig: {
    fontSize: 20,
    textAlign: 'center',
  },
  cardcontainerlowerleft: {
    margin: 10,
  },
  cardcontainerlowerright: {
    margin: 10,
  },
  maincontainer: {
    flex: 1,
  },
  innercontainer: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
  },
  dropdown: {
    margin: 10,
    height: 50,
    borderBottomColor: colors.black,
    borderBottomWidth: 0.5,
  },
  dropdownoutsidecontainer: {
    padding: 10,
    backgroundColor: colors.white,
    elevation: 25,
    borderRadius: 15,
  },
  textheaddropdown: {
    fontSize: 16,
    borderRadius: 120,
    color: colors.black,
    textAlign: 'center',
  },
  textdropdown: {
    fontSize: 16,
    paddingBottom: 5,
    backgroundColor: colors.bgcolorSign_up_in,
    fontWeight: 'bold',
    borderRadius: 3,
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
  searchbox: {
    color: colors.black,
    flex: 1,
  },
  searchboxinput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    margin: 10,
    paddingLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#198754',
    borderRadius: 10,
  },

  addMatrimonialbutton: {
    textAlign: 'center',
    color: colors.black,
    fontWeight: 'bold',
  },
  addMatrimonialContainer: {
    backgroundColor: '#ffc107',
    marginTop: 10,
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    margin: 10,
    elevation: 25,
    marginBottom: 10,
  },
  viewmyjobscontainer: {
    backgroundColor: '#E9B9B4',
    marginTop: 15,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    elevation: 25,
    marginBottom: 15,
  },

  viewmyjobsbutton: {
    textAlign: 'center',
    color: colors.black,
    fontWeight: 'bold',
  },
  viewmyjobs: {
    backgroundColor: '#E9B9B4',
    height: 40,
    justifyContent: 'center',
    borderRadius: 20,
    elevation: 25,
    marginBottom: 10,
  },
  createjobs: {
    backgroundColor: '#99bbff',
    height: 40,
    justifyContent: 'center',
    borderRadius: 20,
    elevation: 25,
    marginBottom: 10,
  },
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
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A9A9B4',
  },
  iconbottomcontainer: {
    width: 100,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffc107',
  },

  chatIcon: {
    width: 30,
    height: 30,
  },
  buttoncontainer: {
    fontWeight: 'bold',
    color: colors.black,
  },
  ModalContianer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.transparent,
  },
  innerModal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
  },
  browsebox: {
    borderWidth: 1,
    flexDirection: 'row',
    borderRadius: 10,
  },
  descbox: {
    borderWidth: 1,
    flexDirection: 'row',
    color: colors.black,
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
  submitcontainer: {
    margin: 10,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffc107',
  },
  closeicon: {
    margin: -10,
    marginBottom: 10,
  },
  viewdetailmodal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.transparent,
  },
  viewdetailmodalinner: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
  },
  closetext: {
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
