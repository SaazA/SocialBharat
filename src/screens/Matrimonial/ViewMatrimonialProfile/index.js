import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getProfile} from '../../../apis/apicalls';
import {useSelector} from 'react-redux';
import moment from 'moment';
import colors from '../../../constants/colors';

export default function ViewMatrimonialProfile({route}) {
  const token = useSelector(state => state.AuthReducer.authToken);
  const [profileData, setProfileData] = useState(null);

  const {partnerId} = route.params;
  const {partnerName} = route.params;
  const id = partnerId;
  const getPartnerProfile = () => {
    getProfile(token, id)
      .then(response => {
        console.log('PartnerData' + JSON.stringify(response.data));
        setProfileData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    console.log('PROFILE' + JSON.stringify(profileData));
  };

  useEffect(() => {
    getPartnerProfile();
  }, []);
 

  const ProfileInfo = () => {};
  return (
    <View style={styles.MainContainer}>
      <ScrollView>
        <View style={styles.UserProfileNameContainer}>
          <Text style={styles.UserProfileName}>User Profile</Text>
        </View>
        <View style={styles.ImageContainer}>
        {profileData && 
        <Image
                      style={styles.ProfileImage}
                      source={
                        profileData.community.banner_image !== null
                          ? require('../../../assests/nullphotocover.jpg')
                          : require('../../../assests/nullphotocover.jpg')
                      }
                    />

        }
          {profileData &&
          <Image
            source={{
              uri: profileData.community.banner_image,
            }}
            style={styles.ProfileImage}
          />
          
          
          
          }
        </View>
        <View style={styles.UserNameContainer}>
          <Text style={styles.UserName}>{partnerName}</Text>
        </View>
        <View>
          {profileData && (
            <View style={styles.UserDetailContainer}>
              <View style={styles.container}>
                <View style={styles.pairContainer}>
                  <View style={styles.NameLabel}>
                    <Text style={styles.Labels}>Email :</Text>
                  </View>
                  <View>
                    <Text style={styles.LabelsValues}>{profileData.email}</Text>
                  </View>
                </View>
                <View style={styles.pairContainer}>
                  <View style={styles.NameLabel}>
                    <Text style={styles.Labels}>DOB :</Text>
                  </View>
                  <View>
                    <Text style={styles.LabelsValues}>
                      {moment(profileData.dob).format('MMMM Do YYYY')}
                    </Text>
                  </View>
                </View>
                <View style={styles.pairContainer}>
                  <View style={styles.NameLabel}>
                    <Text style={styles.Labels}>Marital Status :</Text>
                  </View>
                  <View>
                    <Text style={styles.LabelsValues}>
                      {profileData.marital_status}
                    </Text>
                  </View>
                </View>
                <View style={styles.pairContainer}>
                  <View style={styles.NameLabel}>
                    <Text style={styles.Labels}>Gender :</Text>
                  </View>
                  <View>
                    <Text style={styles.LabelsValues}>
                      {profileData.gender}
                    </Text>
                  </View>
                </View>
                <View style={styles.pairContainer}>
                  <View style={styles.NameLabel}>
                    <Text style={styles.Labels}>Community :</Text>
                  </View>
                  <View>
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
                  <View>
                    <Text style={styles.LabelsValues}>
                      {profileData.native_place_city}
                    </Text>
                  </View>
                </View>
                <View style={styles.pairContainer}>
                  <View style={styles.NameLabel}>
                    <Text style={styles.Labels}>State :</Text>
                  </View>
                  <View>
                    <Text style={styles.LabelsValues}>
                      {profileData.native_place_state}
                    </Text>
                  </View>
                </View>
                <View style={styles.pairContainer}>
                  <View style={styles.NameLabel}>
                    <Text style={styles.Labels}>Occupation :</Text>
                  </View>
                  <View>
                    {/* <Text style={styles.LabelsValues}>{profileData.Occupation}</Text> */}
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
        {profileData && 
        <View style={styles.InformationContainers}>
        <View style={styles.InformationContainerHeading}>
          <Text style={styles.HeadingStyles}>Matrimonial info</Text>
        </View>
        <View style={styles.cardpadding}>
         
          {profileData.matrimonial.length > 0 ? (
          
            <Text>{/* Render matrimonial data */}</Text>
          ) : (
            
            <Text style={styles.cardText}>No Matrimonial Information Available</Text>
          )}
        </View>
      </View>
        }
        
{profileData &&
<View style={styles.InformationContainers}>
  <View style={styles.InformationContainerHeading}>
    <Text style={styles.HeadingStyles}>Address Info</Text>
  </View>
  <View style={styles.cardpadding}>
    
    {profileData.native_place_city && profileData.native_place_state ? (
    
      <Text style={styles.cardText}>{profileData.native_place_city}, {profileData.native_place_state}</Text>
    ) : (
     
      <Text style={styles.cardText}>No Address Information Available</Text>
    )}
  </View>
</View>
}

{profileData && 
<View style={styles.InformationContainers}>
  <View style={styles.InformationContainerHeading}>
    <Text style={styles.HeadingStyles}>Jobs Info</Text>
  </View>
  <View style={styles.cardpadding}>
    {profileData.jobs.length>0 ? (
      <Text style={styles.cardText}></Text>
    ) : (
      <Text style={styles.cardText}>No Jobs Information Available</Text>
    )}
  </View>
</View>
}

{profileData && 
<View style={styles.InformationContainers}>
  <View style={styles.InformationContainerHeading}>
    <Text style={styles.HeadingStyles}>Education Info</Text>
  </View>
  <View style={styles.cardpadding}>
    {profileData.education.length>0 ? (
      <Text style={styles.cardText}></Text>
    ) : (
      <Text style={styles.cardText}>No Jobs Information Available</Text>
    )}
  </View>
</View>
}
{profileData &&  
<View style={styles.InformationContainers}>
  <View style={styles.InformationContainerHeading}>
    <Text style={styles.HeadingStyles}>Business Info</Text>
  </View>
  <View style={styles.cardpadding}>
    {profileData.businesses.length>0 ? (
      <Text style={styles.cardText}></Text>
    ) : (
      <Text style={styles.cardText}>No Jobs Information Available</Text>
    )}
  </View>
</View>
}
       
        <View style={styles.InformationContainers}>
          <View style={styles.InformationContainerHeading}>
            <Text style={styles.HeadingStyles}>Contacts Info</Text>
          </View>
          <View style={styles.cardpadding}>
          {profileData &&

              <View style={styles.container}>
                <View style={styles.pairContainer}>
                  <View style={styles.NameLabel}>
                    <Text style={styles.Labels}>Email :</Text>
                  </View>
                  <View>
                    <Text style={styles.LabelsValues}>{profileData.email}</Text>
                  </View>
                </View>
                <View style={styles.pairContainer}>
                  <View style={styles.NameLabel}>
                    <Text style={styles.Labels}>Phone No :</Text>
                  </View>
                  <View>
                    <Text style={styles.LabelsValues}>{profileData.mobile}</Text>
                  </View>
                </View>
                <View style={styles.pairContainer}>
                  <View style={styles.NameLabel}>
                    <Text style={styles.Labels}>Website :</Text>
                  </View>
                  <View>
                    <Text style={styles.LabelsValues}>{profileData.community_id}</Text>
                  </View>
                </View>
              </View>
          }
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {},
  UserProfileNameContainer: {},
  UserProfileName: {
    fontSize: 25,
    padding: 10,
    top: 10,
    color: '#212529',
  },
  cardpadding:{
  padding:20
  },
  cardText:{
    color:colors.black
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
    resizeMode:'contain'
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
    padding: 8,
    marginTop: 16,
  },
  pairContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  NameLabel: {
    width: 120,
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
    margin: 13,
    borderBottomEndRadius: 19,
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
});
