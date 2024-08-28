import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  RefreshControl,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  DeleteMatrimonialProfile,
  getCommunitybyid,
  getProfile,
} from '../../../apis/apicalls';
import {useSelector} from 'react-redux';
import colors from '../../../constants/colors';
import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Dividedboxcontainer from '../../../Components/dividedboxcontainer';
import {Alert} from 'react-native';
import routes from '../../../constants/routes';
import {useFocusEffect} from '@react-navigation/native';

const ProfileScreen = ({navigation}) => {
  const [userData, setUserData] = useState();
  const [communityname, setcommunityName] = useState();
  const [searchBoxVisibility, setSearchBoxVisibility] = useState({});
  const [searchQueries, setSearchQueries] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const token = useSelector(state => state.AuthReducer.authToken);
  const id = useSelector(state => state.UserReducer.userData.data.id);
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const communityid = useSelector(
    state => state.UserReducer.userData.data.community_id,
  );
  console.log(communityid);
  const getusercommunity = () => {
    getCommunitybyid(id, token)
      .then(response => {
        const res = JSON.parse(JSON.stringify(response));
        setcommunityName(res.data.name);
      })
      .catch(error => {
        // console.log(error);
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setApiFailed(true);
      });
  };

  const getUserProfile = () => {
    setApiFailed(false);
    getProfile(token, id)
      .then(response => {
        console.log('UserProfiles' + JSON.stringify(response.data));
        setUserData(response.data.data);
      })
      .catch(error => {
        // console.log(error);
        // console.log(error);
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setApiFailed(true);
      });
  };

  const deleteMatrimonialProfile = id => {
    DeleteMatrimonialProfile(token, id)
      .then(response => {
        onRefresh();
        console.log(response.data);
        const message = response.data.message;
        if (message) {
          ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
        }
      })
      .catch(error => {
        // console.log(error);
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      });
  };

  console.log('==================');
  // console.log(userData.matrimonial);
  console.log('==================');

  // useEffect(() => {
  //   getUserProfile();
  //   getusercommunity();
  // }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setUserData();
    getUserProfile();
    getusercommunity();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setUserData();
      getUserProfile();
      getusercommunity();
    }, []),
  );

  const headerInfo = [
    {name: 'Matrimonial Info'},
    {name: 'Educational Info'},
    {name: 'Address Info'},
    {name: 'Business Info'},
    {name: 'Job Info'},
  ];

  const toggleSearchBox = section => {
    setSearchBoxVisibility(prevState => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  // Handle search input changes for a section
  const handleSearchInputChange = (text, section) => {
    setSearchQueries(prevState => ({
      ...prevState,
      [section]: text,
    }));
  };

  // Filter data based on search queries
  const filterData = (data, query, fields) => {
    if (!query) return data;
    return data.filter(item =>
      fields.some(field =>
        item[field]?.toLowerCase().includes(query.toLowerCase()),
      ),
    );
  };

  // Define what fields to search for each section
  const searchFields = {
    'Matrimonial Info': ['matrimonial_profile_name'],
    'Educational Info': ['degree_title', 'field_of_study', 'institution_name'],
    'Address Info': [
      'address_type',
      'address_line',
      'city',
      'state',
      'country',
    ],
    'Business Info': [
      'business_name',
      'business_category',
      'street_address',
      'city',
      'state',
      'country',
    ],
    'Job Info': ['company_name', 'designation', 'job_type', 'experience'],
  };
  const handleNavigation = headingName => {
    switch (headingName) {
      case 'Matrimonial Info':
        navigation.navigate(routes.ADDMATRIMONIAL);
        break;
      case 'Educational Info':
        navigation.navigate('EducationUpdate');
        break;
      case 'Address Info':
        navigation.navigate(routes.ADDADDRESS);
        break;
      case 'Business Info':
        navigation.navigate(routes.BUSINESSPROMOTE);
        break;
      case 'Job Info':
        navigation.navigate(routes.CREATENEWJOB);
        break;
      default:
        console.log(`No screen mapped for ${headingName}`);
    }
  };

  // const toggleModal = user_id => {
  //   console.log(user_id);
  //   setModalVisible(prev => ({
  //     ...prev,
  //     [user_id]: !prev[user_id],
  //   }));
  // };
  const toggleModal = userId => {
    console.log(userId);
    const profile = userData.matrimonial.find(item => item.id === userId);
    setSelectedProfile(profile);
    setModalVisible(true);
  };

  return (
    <ScrollView
      style={styles.maincontainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {userData && communityname ? (
        <View>
          <View style={styles.headercontainer}>
            <View style={styles.headerImagecontainer}>
              <Image
                source={
                  userData.photo
                    ? {uri: userData.photo}
                    : require('../../../assests/nullphotocover.jpg')
                }
                style={styles.image}
              />
            </View>
            <View>
              <Text style={styles.nametext}>{userData.name}</Text>
              <Text style={styles.communitytext}>{communityname}</Text>
            </View>
          </View>
          {/*=====*/}
          <View style={styles.personalinfocontainer}>
            <TouchableOpacity
              style={styles.editcontainer}
              onPress={() => navigation.navigate(routes.EDITPROFILE)}>
              <FontAwesome5 size={24} name="edit" color={colors.black} />
            </TouchableOpacity>

            {[
              {label: 'Name', value: userData.name ? userData.name : 'NA'},
              {label: 'Email', value: userData.email ? userData.email : 'NA'},
              {
                label: 'Date of Birth',
                value: userData.dob
                  ? moment(userData.dob).format('DD/MM/YYYY')
                  : 'NA',
              },
              {
                label: 'Highest Qualification',
                value: userData.highest_qualification
                  ? userData.highest_qualification
                  : 'NA',
              },
              {
                label: 'Occupation',
                value: userData.occupation ? userData.occupation : 'NA',
              },
              {
                label: 'Marital Status',
                value: userData.marital_status ? userData.marital_status : 'NA',
              },
              {
                label: 'Gender',
                value: userData.gender ? userData.gender : 'NA',
              },
              {label: 'Community', value: communityname},
              {
                label: 'Mobile No',
                value: userData.mobile ? userData.mobile : 'NA',
              },
            ].map((info, index) => (
              <Dividedboxcontainer
                key={index}
                label={info.label}
                value={info.value}
              />
            ))}
          </View>
          <View style={styles.matrimonialinfo}>
            {headerInfo.map((heading, index) => (
              <View key={index}>
                <View style={styles.innerfirst}>
                  <View style={styles.headingcont}>
                    <Text style={styles.innerfirstheadingtext}>
                      {heading.name}
                    </Text>
                  </View>
                  <View style={styles.innerhead}>
                    <TouchableOpacity
                      onPress={() => toggleSearchBox(heading.name)}
                      style={styles.searchcont}>
                      <FontAwesome5
                        size={24}
                        name="search"
                        color={colors.black}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleNavigation(heading.name)}
                      style={styles.addcont}>
                      <MaterialIcons
                        size={24}
                        name="add-box"
                        color={colors.black}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {heading.name === 'Matrimonial Info' ? (
                  <View style={styles.innermatrimonialsecond}>
                    {searchBoxVisibility[heading.name] && (
                      <TextInput
                        style={styles.searchInput}
                        placeholder={`Search ${heading.name}`}
                        placeholderTextColor={colors.black}
                        onChangeText={text =>
                          handleSearchInputChange(text, heading.name)
                        }
                      />
                    )}
                    <ScrollView
                      nestedScrollEnabled={true}
                      style={styles.outercont}>
                      {userData.matrimonial &&
                      Array.isArray(userData.matrimonial) &&
                      userData.matrimonial.length > 0 ? (
                        filterData(
                          userData.matrimonial,
                          searchQueries['Matrimonial Info'],
                          searchFields['Matrimonial Info'],
                        ).map((item, index) => (
                          <View style={styles.cardcontainer} key={index}>
                            <View style={styles.uppercard}>
                              <Text style={{color: 'black'}}>
                                {item.matrimonial_profile_name}
                              </Text>
                              <View style={styles.imagecontainer}>
                                <Image
                                  style={{width: '100%', height: '100%'}}
                                  source={
                                    item.proposal_photos &&
                                    item.proposal_photos.length > 0
                                      ? Array.isArray(item.proposal_photos)
                                        ? {uri: item.proposal_photos[0]}
                                        : {uri: item.proposal_photos}
                                      : require('../../../assests/nullphotocover.jpg')
                                  }
                                />
                              </View>
                            </View>
                            <View style={styles.lowercard}>
                              <TouchableOpacity
                                style={styles.buttoncontainer}
                                onPress={() => toggleModal(item.id)}>
                                <Text style={styles.basictext}>View</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  deleteMatrimonialProfile(item.id)
                                }>
                                <FontAwesome5
                                  name="trash"
                                  color={colors.danger}
                                  size={20}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))
                      ) : (
                        <View style={{margin: 10}}>
                          <Text style={{color: colors.black}}>
                            No Data Available
                          </Text>
                        </View>
                      )}
                    </ScrollView>

                    <View>
                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}>
                        <View style={styles.modalView}>
                          <View style={styles.modalContent}>
                            <TouchableOpacity
                              onPress={() => setModalVisible(false)}
                              style={styles.closeButton}>
                              <FontAwesome6
                                name="circle-xmark"
                                color={colors.danger}
                                size={26}
                              />
                            </TouchableOpacity>

                            {selectedProfile && (
                              <View style={styles.profileDetails}>
                                {selectedProfile.proposal_photos &&
                                  selectedProfile.proposal_photos.length >
                                    0 && (
                                    <Image
                                      style={{width: '100%', height: 200}}
                                      source={{
                                        uri: selectedProfile.proposal_photos[0],
                                      }}
                                    />
                                  )}
                                <View style={styles.rowcontainer}>
                                  <View style={styles.rowlabelcontainer}>
                                    <Text style={styles.modallabeltext}>
                                      Name
                                    </Text>
                                  </View>
                                  <View style={styles.rowvaluecontainer}>
                                    <Text style={styles.modallabeltext}>
                                      {selectedProfile.matrimonial_profile_name}
                                    </Text>
                                  </View>
                                </View>

                                <View style={styles.rowcontainer}>
                                  <View style={styles.rowlabelcontainer}>
                                    <Text style={styles.modallabeltext}>
                                      DOB
                                    </Text>
                                  </View>
                                  <View style={styles.rowvaluecontainer}>
                                    <Text style={styles.modallabeltext}>
                                      {new Date(
                                        selectedProfile.matrimonial_profile_dob,
                                      ).toLocaleDateString()}
                                    </Text>
                                  </View>
                                </View>

                                <View style={styles.rowcontainer}>
                                  <View style={styles.rowlabelcontainer}>
                                    <Text style={styles.modallabeltext}>
                                      Gender
                                    </Text>
                                  </View>
                                  <View style={styles.rowvaluecontainer}>
                                    <Text style={styles.modallabeltext}>
                                      {
                                        selectedProfile.matrimonial_profile_gender
                                      }
                                    </Text>
                                  </View>
                                </View>

                                <View style={styles.rowcontainer}>
                                  <View style={styles.rowlabelcontainer}>
                                    <Text style={styles.modallabeltext}>
                                      Father's Name
                                    </Text>
                                  </View>
                                  <View style={styles.rowvaluecontainer}>
                                    <Text style={styles.modallabeltext}>
                                      {selectedProfile.father_name}
                                    </Text>
                                  </View>
                                </View>

                                <View style={styles.rowcontainer}>
                                  <View style={styles.rowlabelcontainer}>
                                    <Text style={styles.modallabeltext}>
                                      Mother's Name
                                    </Text>
                                  </View>
                                  <View style={styles.rowvaluecontainer}>
                                    <Text style={styles.modallabeltext}>
                                      {selectedProfile.mother_name}
                                    </Text>
                                  </View>
                                </View>

                                <View style={styles.rowcontainer}>
                                  <View style={styles.rowlabelcontainer}>
                                    <Text style={styles.modallabeltext}>
                                      Skin Tone
                                    </Text>
                                  </View>
                                  <View style={styles.rowvaluecontainer}>
                                    <Text style={styles.modallabeltext}>
                                      {selectedProfile.skin_tone}
                                    </Text>
                                  </View>
                                </View>

                                <View style={styles.rowcontainer}>
                                  <View style={styles.rowlabelcontainer}>
                                    <Text style={styles.modallabeltext}>
                                      Height
                                    </Text>
                                  </View>
                                  <View style={styles.rowvaluecontainer}>
                                    <Text style={styles.modallabeltext}>
                                      {selectedProfile.height_in_feet} feet
                                    </Text>
                                  </View>
                                </View>

                                <View style={styles.rowcontainer}>
                                  <View style={styles.rowlabelcontainer}>
                                    <Text style={styles.modallabeltext}>
                                      Subcast
                                    </Text>
                                  </View>
                                  <View style={styles.rowvaluecontainer}>
                                    <Text style={styles.modallabeltext}>
                                      {selectedProfile.subcast}
                                    </Text>
                                  </View>
                                </View>

                                <View style={styles.rowcontainer}>
                                  <View style={styles.rowlabelcontainer}>
                                    <Text style={styles.modallabeltext}>
                                      Salary Package
                                    </Text>
                                  </View>
                                  <View style={styles.rowvaluecontainer}>
                                    <Text style={styles.modallabeltext}>
                                      {selectedProfile.salary_package}
                                    </Text>
                                  </View>
                                </View>

                                {/* Add more fields as needed */}
                              </View>
                            )}
                          </View>
                        </View>
                      </Modal>
                    </View>
                  </View>
                ) : heading.name === 'Educational Info' ? (
                  <View style={styles.innerEducationalInfo}>
                    {searchBoxVisibility[heading.name] && (
                      <TextInput
                        style={styles.searchInput}
                        placeholder={`Search ${heading.name}`}
                        placeholderTextColor={colors.black}
                        onChangeText={text =>
                          handleSearchInputChange(text, heading.name)
                        }
                      />
                    )}

                    <ScrollView
                      nestedScrollEnabled={true}
                      style={styles.outercont}>
                      {userData.education &&
                      Array.isArray(userData.education) &&
                      userData.education.length > 0 ? (
                        filterData(
                          userData.education,
                          searchQueries['Educational Info'],
                          searchFields['Educational Info'],
                        ).map((item, index) => (
                          <View
                            style={styles.cardcontainereducation}
                            key={index}>
                            {/* <View style={styles.editcontainer}>
                              <FontAwesome5
                                size={24}
                                name="edit"
                                color={colors.black}
                              />
                            </View> */}
                            {[
                              {label: 'Degree', value: item.degree_title},
                              {
                                label: 'Study Field',
                                value: item.field_of_study,
                              },

                              {
                                label: 'University',
                                value: item.institution_name,
                              },
                              {
                                label: 'Passing Year',
                                value: item.passing_year,
                              },
                              {
                                label: 'Score Type',
                                value: item.score_type,
                              },
                              {label: 'Score', value: item.score},
                            ].map((info, index) => (
                              <Dividedboxcontainer
                                key={index}
                                label={info.label}
                                value={info.value}
                              />
                            ))}
                          </View>
                        ))
                      ) : (
                        <View style={{margin: 10}}>
                          <Text style={{color: colors.black}}>
                            No Data Available
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                ) : heading.name === 'Address Info' ? (
                  <View style={styles.innerJobInfo}>
                    {searchBoxVisibility[heading.name] && (
                      <TextInput
                        style={styles.searchInput}
                        placeholder={`Search ${heading.name}`}
                        placeholderTextColor={colors.black}
                        onChangeText={text =>
                          handleSearchInputChange(text, heading.name)
                        }
                      />
                    )}
                    <ScrollView
                      nestedScrollEnabled={true}
                      style={styles.outercont}>
                      {userData.contacts &&
                      Array.isArray(userData.contacts) &&
                      userData.contacts.length > 0 ? (
                        filterData(
                          userData.contacts,
                          searchQueries['Address Info'],
                          searchFields['Address Info'],
                        ).map((item, index) => (
                          <View
                            key={index}
                            style={styles.addressInfooutercontainer}>
                            {/* <View style={styles.editcontainer}>
                              <FontAwesome5
                                size={24}
                                name="edit"
                                color={colors.black}
                              />
                            </View> */}
                            <Text style={styles.adresstexthead}>
                              {item.address_type}
                            </Text>
                            <Text style={styles.adresstext}>
                              {item.address_line},{item.city},{item.state},
                              {item.country}
                            </Text>
                            <View></View>
                          </View>
                        ))
                      ) : (
                        <View style={{margin: 10}}>
                          <Text style={{color: colors.black}}>
                            No Data Available
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                ) : heading.name === 'Business Info' ? (
                  <View style={styles.innerJobInfo}>
                    {searchBoxVisibility[heading.name] && (
                      <TextInput
                        style={styles.searchInput}
                        placeholder={`Search ${heading.name}`}
                        placeholderTextColor={colors.black}
                        onChangeText={text =>
                          handleSearchInputChange(text, heading.name)
                        }
                      />
                    )}
                    <ScrollView
                      nestedScrollEnabled={true}
                      style={styles.outercont}>
                      {userData.businesses &&
                      Array.isArray(userData.businesses) &&
                      userData.businesses.length > 0 ? (
                        filterData(
                          userData.businesses,
                          searchQueries['Business Info'],
                          searchFields['Business Info'],
                        ).map((item, index) => (
                          <View
                            style={styles.cardcontainereducation}
                            key={index}>
                            {/* <View style={styles.editcontainer}>
                              <FontAwesome5
                                size={24}
                                name="edit"
                                color={colors.black}
                              />
                            </View> */}
                            {[
                              {
                                label: 'Business Name',
                                value: item.business_name,
                              },
                              {
                                label: 'Business Category',
                                value: item.business_category,
                              },

                              {
                                label: 'Street Address',
                                value: item.street_address,
                              },
                              {
                                label: 'City',
                                value: item.city,
                              },
                              {
                                label: 'State',
                                value: item.state,
                              },
                              {label: 'Country', value: item.country},
                              {label: 'Contact', value: item.contact1},
                              {label: 'Email', value: item.business_email},
                              {
                                label: 'Business Website',
                                value: item.business_website,
                              },
                              {label: 'Status', value: item.status},
                            ].map((info, index) => (
                              <Dividedboxcontainer
                                key={index}
                                label={info.label}
                                value={info.value}
                              />
                            ))}
                          </View>
                        ))
                      ) : (
                        <View style={{margin: 10}}>
                          <Text style={{color: colors.black}}>
                            No Data Available
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                ) : heading.name === 'Job Info' ? (
                  <View style={styles.innerJobInfo}>
                    {searchBoxVisibility[heading.name] && (
                      <TextInput
                        style={styles.searchInput}
                        placeholder={`Search ${heading.name}`}
                        placeholderTextColor={colors.black}
                        onChangeText={text =>
                          handleSearchInputChange(text, heading.name)
                        }
                      />
                    )}
                    <ScrollView
                      nestedScrollEnabled={true}
                      style={styles.outercont}>
                      {userData.jobs &&
                      userData.jobs.length > 0 &&
                      Array.isArray(userData.jobs) ? (
                        filterData(
                          userData.jobs,
                          searchQueries['Job Info'],
                          searchFields['Job Info'],
                        ).map((item, index) => (
                          <View style={styles.cardcontainerjobs} key={index}>
                            {/* <View style={styles.editcontainer}>
                              <FontAwesome5
                                size={24}
                                name="edit"
                                color={colors.black}
                              />
                            </View> */}
                            {[
                              {
                                label: 'Company Name',
                                value: item.company_name,
                              },
                              {
                                label: 'Designation',
                                value: item.designation,
                              },

                              {
                                label: 'Job Type',
                                value: item.job_type,
                              },
                              {
                                label: 'Experience',
                                value: item.experience,
                              },
                            ].map((info, index) => (
                              <Dividedboxcontainer
                                key={index}
                                label={info.label}
                                value={info.value}
                              />
                            ))}
                          </View>
                        ))
                      ) : (
                        <View style={{margin: 10}}>
                          <Text style={{color: colors.black}}>
                            No Data Available
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                ) : null}
              </View>
            ))}
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

export default ProfileScreen;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    margin: 10,
  },
  basictext: {
    color: colors.black,
  },
  headercontainer: {
    borderWidth: 2,
    borderColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  headerImagecontainer: {
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 50,
    overflow: 'hidden',
    height: 100,
    width: 100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  nametext: {
    color: '#000000',

    fontWeight: 'bold',
    fontSize: 18,
  },
  communitytext: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  personalinfocontainer: {
    borderWidth: 2,
    backgroundColor: colors.white,
    borderColor: colors.grayLight,
    marginTop: 2,
    borderRadius: 10,
  },
  content: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  contenttextstatic: {
    color: '#000000',
    fontSize: 18,
  },
  contenttextDynamic: {
    color: colors.gray,
    fontSize: 18,
  },
  textbox: {
    flex: 0.4,
    justifyContent: 'center',
    padding: 5,
  },
  infobox: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobilenobox: {
    borderTopWidth: 2,
    borderColor: colors.grayLight,
  },
  editcontainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    margin: 5,
    marginRight: 10,
  },
  matrimonialinfo: {
    marginTop: 10,
    borderRadius: 10,
  },
  innerhead: {
    flexDirection: 'row',
    gap: 30,
  },
  innerfirst: {
    padding: 10,
    borderWidth: 2,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: colors.grayLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  innerfirstheading: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-around',
  },
  matrimonialtextblock: {
    backgroundColor: colors.grayLight,
    marginTop: 5,
    padding: 5,
    borderRadius: 10,
  },
  innerfirstheadingtext: {
    color: '#008596',
    fontSize: 20,
    fontWeight: '500',
  },
  matrimonialblocktext: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  innermatrimonialsecond: {
    borderWidth: 1,
    borderColor: colors.grayLight,
    maxHeight: 300,
    backgroundColor: '#FFFFFF',
  },
  cardcontainer: {
    borderWidth: 1,
    margin: 10,
    borderRadius: 10,
  },
  uppercard: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  lowercard: {
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 50,
    alignItems: 'center',
  },
  buttoncontainer: {
    backgroundColor: colors.Profilematrimonialbutton,
    padding: 5,
    borderRadius: 10,
    height: 30,
  },
  imagecontainer: {
    height: 60,
    width: 60,
  },
  cardcontainereducation: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderRadius: 5,
    margin: 5,
  },
  innerEducationalInfo: {
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    borderColor: colors.grayLight,
    maxHeight: 300,
  },
  addressInfooutercontainer: {
    borderWidth: 1,
    margin: 5,
    backgroundColor: '#FFFFFF',
  },
  innerJobInfo: {
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    maxHeight: 300,
    borderColor: colors.grayLight,
  },
  adresstexthead: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 18,
    padding: 5,
  },
  adresstext: {
    color: colors.grayLight,
    fontWeight: 'bold',
    fontSize: 18,
    padding: 5,
  },
  cardcontainerjobs: {
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    margin: 10,
  },
  searchInput: {
    borderWidth: 1,
    margin: 5,
    color: colors.black,
    borderRadius: 5,
  },
  outercont: {
    minHeight: 50,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.transparent,
  },
  modalContent: {
    width: '80%',
    padding: 5,
    // borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  closeButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  closeButtonText: {
    color: 'red',
  },
  profileDetails: {
    backgroundColor: colors.bgColor,
    borderRadius: 10,
    overflow: 'hidden',
  },

  modallabeltext: {
    fontSize: 17,
    color: colors.black,
  },
  rowcontainer: {
    flexDirection: 'row',
    margin: 5,
  },
  rowlabelcontainer: {
    flex: 0.4,
  },
  rowvaluecontainer: {
    flex: 0.6,
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
