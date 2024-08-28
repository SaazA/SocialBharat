import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {getProfile, getSelfMatrimonialProfile} from '../../../apis/apicalls';
import colors from '../../../constants/colors';
import {useSelector} from 'react-redux';
import {ScrollView} from 'react-native';
import {Image} from 'react-native';
import moment from 'moment';
import Dividedboxcontainer from '../../../Components/dividedboxcontainer';

const ViewMembers = ({route}) => {
  const token = useSelector(state => state.AuthReducer.authToken);
  const [profileData, setProfileData] = useState(null);
  const [personalProfileData, setPersonalProfileData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const {memberId} = route.params;
  const {memberName} = route.params;
  const id = memberId;
  const getPartnerProfile = () => {
    setApiFailed(false);
    getProfile(token, id)
      .then(response => {
        console.log('PartnerData' + JSON.stringify(response.data));
        setProfileData(response.data.data);
      })
      .catch(error => {
        // console.log(error);
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setApiFailed(true);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getPartnerProfile();
    getUserMatrimonialProfile();

    setRefreshing(false);
  }, []);

  const getUserMatrimonialProfile = () => {
    getSelfMatrimonialProfile(token, id)
      .then(response => {
        console.log('PartnerSelfData' + JSON.stringify(response.data.data));
        setPersonalProfileData(response.data.data);
      })
      .catch(error => {
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      });
  };

  const handleBioDataPress = () => {
    const bioDataUrl = personalProfileData.biodata;
    console.log(bioDataUrl);
    if (bioDataUrl) {
      Linking.openURL(bioDataUrl);
    } else {
      errorMessage = 'No Bio Data Available';
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    }
  };
  useEffect(() => {
    getPartnerProfile();
    getUserMatrimonialProfile();
  }, []);
  // console.log(profileData.jobs);

  return (
    <View style={styles.MainContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.UserProfileNameContainer}>
          <Text style={styles.UserProfileName}>User Profile</Text>
        </View>
        {profileData && !apiFailed ? (
          <>
            <View style={styles.ImageContainer}>
              {profileData && (
                <Image
                  style={styles.ProfileImage}
                  source={
                    profileData.photo !== null
                      ? {uri: profileData.photo}
                      : require('../../../assests/nullphotocover.jpg')
                  }
                />
              )}
              {profileData && (
                <Image
                  source={{
                    uri: profileData.community.banner_image,
                  }}
                  style={styles.bannerImage}
                />
              )}
            </View>
            <View style={styles.UserNameContainer}>
              <Text style={styles.UserName}>{memberName}</Text>
            </View>
            <View>
              {profileData && (
                <View style={styles.UserDetailContainer}>
                  <View style={styles.container}>
                    <View style={styles.pairContainer}>
                      <View style={styles.NameLabel}>
                        <Text style={styles.Labels}>Email :</Text>
                      </View>
                      <View style={styles.infobox_contact}>
                        <Text style={styles.LabelsValues}>
                          {profileData.email ? profileData.email : 'NA'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.pairContainer}>
                      <View style={styles.NameLabel}>
                        <Text style={styles.Labels}>DOB :</Text>
                      </View>
                      <View style={styles.infobox_contact}>
                        <Text style={styles.LabelsValues}>
                          {profileData.dob
                            ? moment(profileData.dob).format('MMMM Do YYYY')
                            : 'NA'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.pairContainer}>
                      <View style={styles.NameLabel}>
                        <Text style={styles.Labels}>Marital Status :</Text>
                      </View>
                      <View style={styles.infobox_contact}>
                        <Text style={styles.LabelsValues}>
                          {profileData.marital_status
                            ? profileData.marital_status
                            : 'NA'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.pairContainer}>
                      <View style={styles.NameLabel}>
                        <Text style={styles.Labels}>Gender :</Text>
                      </View>
                      <View style={styles.infobox_contact}>
                        <Text style={styles.LabelsValues}>
                          {profileData.gender ? profileData.gender : 'NA'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.pairContainer}>
                      <View style={styles.NameLabel}>
                        <Text style={styles.Labels}>Community :</Text>
                      </View>
                      <View style={styles.infobox_contact}>
                        {profileData.community && (
                          <Text style={styles.LabelsValues}>
                            {profileData.community.name}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.pairContainer}>
                      <View style={styles.NameLabel}>
                        <Text style={styles.Labels}>City :</Text>
                      </View>
                      <View style={styles.infobox_contact}>
                        <Text style={styles.LabelsValues}>
                          {profileData.native_place_city
                            ? profileData.native_place_city
                            : 'NA'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.pairContainer}>
                      <View style={styles.NameLabel}>
                        <Text style={styles.Labels}>State :</Text>
                      </View>
                      <View style={styles.infobox_contact}>
                        <Text style={styles.LabelsValues}>
                          {profileData.native_place_state
                            ? profileData.native_place_state
                            : 'NA'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.pairContainer}>
                      <View style={styles.NameLabel}>
                        <Text style={styles.Labels}>Occupation :</Text>
                      </View>
                      <View style={styles.infobox_contact}>
                        <Text style={styles.LabelsValues}>
                          {profileData.Occupation
                            ? profileData.Occupation
                            : 'NA'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
            {profileData && (
              <View style={styles.InformationContainers}>
                <View style={styles.InformationContainerHeading}>
                  <Text style={styles.HeadingStyles}>Matrimonial info</Text>
                </View>
                <ScrollView nestedScrollEnabled={true}>
                  {personalProfileData ? (
                    <View style={styles.cardpadding}>
                      {/* Mapping through profile information */}
                      {[
                        {
                          label: 'Father Name',
                          value: personalProfileData.father_name,
                        },
                        {
                          label: 'Mother Name',
                          value: personalProfileData.mother_name,
                        },
                        {
                          label: 'Height',
                          value: personalProfileData.height_in_feet,
                        },
                        {
                          label: 'Manglik',
                          value: personalProfileData.is_manglik,
                        },
                        {
                          label: 'Paternal Gotra',
                          value: personalProfileData.paternal_gotra,
                        },
                        {
                          label: 'Maternal Gotra',
                          value: personalProfileData.maternal_gotra,
                        },
                      ].map((info, index) => (
                        <Dividedboxcontainer
                          key={index}
                          label={info.label}
                          value={info.value}
                        />
                      ))}

                      {/* TouchableOpacity for additional functionality */}
                      <View style={styles.content}>
                        <View style={styles.textbox}>
                          <Text style={styles.contenttextstatic}>BioData</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.infobox}
                          onPress={handleBioDataPress}>
                          <Text style={styles.contenttextDynamic}>
                            Download Biodata
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.cardpadding}>
                      <Text style={styles.cardText}>
                        No Matrimonial Information Available
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}

            {profileData && (
              <View style={styles.InformationContainers}>
                <View style={styles.InformationContainerHeading}>
                  <Text style={styles.HeadingStyles}>Address Info</Text>
                </View>
                <View style={styles.cardpadding}>
                  {profileData &&
                  Array.isArray(profileData.contacts) &&
                  profileData.contacts.length > 0 ? (
                    <View>
                      {profileData.contacts.map((item, index) => (
                        <View key={index} style={styles.viewadd}>
                          <View style={styles.viewaddtype}>
                            <Text
                              style={[
                                styles.addressViewvalue,
                                styles.addressHeadtextView,
                              ]}>
                              {item.address_type}
                            </Text>
                          </View>
                          <View>
                            <Text style={styles.addressViewvalue}>
                              {item.address_line},{item.city},{item.state}{' '}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.cardText}>
                      No Address Information Available
                    </Text>
                  )}
                </View>
              </View>
            )}

            {profileData && (
              <View style={styles.InformationContainers}>
                <View style={styles.InformationContainerHeading}>
                  <Text style={styles.HeadingStyles}>Jobs Info</Text>
                </View>
                <View style={styles.cardpadding}>
                  {profileData &&
                  Array.isArray(profileData.jobs) &&
                  profileData.jobs.length > 0 ? (
                    <View>
                      {profileData.jobs.map((item, index) => (
                        <View key={index}>
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
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.cardText}>
                      No Jobs Information Available
                    </Text>
                  )}
                </View>
              </View>
            )}

            {profileData && (
              <View style={styles.InformationContainers}>
                <View style={styles.InformationContainerHeading}>
                  <Text style={styles.HeadingStyles}>Education Info</Text>
                </View>
                <ScrollView nestedScrollEnabled={true}>
                  {profileData &&
                  Array.isArray(profileData.education) &&
                  profileData.education.length > 0 ? (
                    <View style={styles.cardpadding}>
                      {profileData.education.map((item, index) => (
                        <View key={index} style={styles.cardedu}>
                          {[
                            {
                              label: 'Degree',
                              value: item.degree_title,
                            },
                            {
                              label: 'Study Field',
                              value: item.field_of_study,
                            },
                            {
                              label: 'University',
                              value: item.institution_name,
                            },
                            {
                              label: 'Score',
                              value: item.score,
                            },
                            {
                              label: 'Score_type',
                              value: item.score_type,
                            },
                            {
                              label: 'Passing Year',
                              value: item.passing_year,
                            },
                          ].map((info, index) => (
                            <Dividedboxcontainer
                              key={index}
                              label={info.label}
                              value={info.value}
                            />
                          ))}
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.cardpadding}>
                      <Text style={styles.cardText}>
                        No Jobs Information Available
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}
            {profileData && (
              <View style={styles.InformationContainers}>
                <View style={styles.InformationContainerHeading}>
                  <Text style={styles.HeadingStyles}>Business Info</Text>
                </View>
                <ScrollView nestedScrollEnabled={true}>
                  {profileData &&
                  Array.isArray(profileData.businesses) &&
                  profileData.businesses.length > 0 ? (
                    <View style={styles.cardpadding}>
                      {profileData.businesses.map((item, index) => (
                        <View key={index} style={styles.cardedu}>
                          <View style={styles.headcardcont}>
                            <Text style={styles.cardText}>
                              Business No:{index + 1}
                            </Text>
                          </View>
                          {[
                            {
                              label: 'City',
                              value: item.city,
                            },
                            {
                              label: 'State',
                              value: item.state,
                            },
                            {
                              label: 'Country',
                              value: item.country,
                            },
                            {
                              label: 'Contact 1',
                              value: item.contact1,
                            },
                            {
                              label: 'Contact 2',
                              value: item.contact2 ? item.contact2 : 'NA',
                            },
                            {
                              label: 'Contact 3',
                              value: item.contact3,
                            },
                            {
                              label: 'Website Email',
                              value: item.business_email,
                            },
                            {
                              label: 'Website Link',
                              value: item.business_website,
                            },
                            {
                              label: 'Status',
                              value: item.passing_year,
                            },
                          ].map((info, index) => (
                            <Dividedboxcontainer
                              key={index}
                              label={info.label}
                              value={info.value}
                            />
                          ))}
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.cardpadding}>
                      <Text style={styles.cardText}>
                        No Jobs Information Available
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}

            <View style={styles.InformationContainers}>
              <View style={styles.InformationContainerHeading}>
                <Text style={styles.HeadingStyles}>Contacts Info</Text>
              </View>
              <View style={styles.cardpadding}>
                {profileData && (
                  <View style={styles.container}>
                    <View style={styles.pairContainer}>
                      <View style={styles.NameLabel}>
                        <Text style={styles.Labels}>Email :</Text>
                      </View>
                      <View style={styles.infobox_contact}>
                        <Text style={styles.LabelsValues}>
                          {profileData.email ? profileData.email : 'NA'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.pairContainer}>
                      <View style={styles.NameLabel}>
                        <Text style={styles.Labels}>Phone No :</Text>
                      </View>
                      <View style={styles.infobox_contact}>
                        <Text style={styles.LabelsValues}>
                          {profileData.mobile ? profileData.mobile : 'NA'}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
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

export default ViewMembers;

const styles = StyleSheet.create({
  UserProfileName: {
    fontSize: 25,
    padding: 10,
    top: 10,
    color: '#212529',
  },
  cardpadding: {
    padding: 20,
    marginBottom: 10,
  },
  cardText: {
    color: colors.black,
  },
  ImageContainer: {
    padding: 10,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 40,
  },
  ProfileImage: {
    height: 130,
    width: 130,
    borderRadius: 100,
    resizeMode: 'cover',
  },
  bannerImage: {
    height: 130,
    width: 130,
    resizeMode: 'contain',
  },
  UserNameContainer: {
    padding: 10,
  },
  UserName: {
    fontSize: 20,
    color: '#212529',
    left: 9,
    top: 18,
  },
  LabelsValues: {
    fontSize: 14,
    color: '#212529',
  },
  UserDetailContainer: {
    borderWidth: 0.2,
    padding: 5,
    margin: 15,
    width: 'auto',
    height: 'auto',
    width: 'auto',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 2,
  },
  container: {
    padding: 5,
    marginTop: 16,
  },
  pairContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  NameLabel: {
    flex: 0.4,
  },
  infobox_contact: {
    flex: 0.6,
  },
  Labels: {
    marginRight: 8,
    fontWeight: 'bold',
    color: '#212529',
  },
  InformationContainerHeading: {
    backgroundColor: 'green',
    padding: 9,
  },
  InformationContainers: {
    margin: 10,
    borderWidth: 1,
    borderColor: colors.grayLight,
    maxHeight: 400,
    minHeight: 100,
    height: 'auto',
    width: 'auto',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 2,
    // bottom:10,
  },
  HeadingStyles: {
    fontSize: 17,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  textbox: {
    flex: 0.4,
    justifyContent: 'center',
    padding: 5,
  },
  contenttextstatic: {
    color: '#000000',
    fontSize: 18,
  },
  contenttextDynamic: {
    color: colors.blue,
    fontSize: 18,
    fontWeight: '500',
  },
  infobox: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewadd: {
    borderWidth: 2,
    borderColor: colors.grayLight,
    borderRadius: 5,
    marginTop: 10,
  },
  addressHeadtextView: {
    fontWeight: '700',
  },
  addressViewvalue: {
    color: colors.black,
    fontSize: 16,
  },
  cardedu: {
    borderWidth: 2,
    borderColor: colors.grayLight,
    marginBottom: 5,
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
  headcardcont: {
    marginBottom: 5,
    alignItems: 'center',
  },
});
