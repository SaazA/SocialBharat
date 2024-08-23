import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {getUserAppliedJobs} from '../../../apis/apicalls';
import {useSelector} from 'react-redux';
import colors from '../../../constants/colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import NoDataAvailable from '../../../Components/NoDataAvailable';
import {ToastAndroid} from 'react-native';
import {ActivityIndicator} from 'react-native';

const UserAppliedJobs = ({navigation}) => {
  const token = useSelector(state => state.AuthReducer.authToken);
  const [jobsData, setJobsData] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);

  const getAppliedJobsData = () => {
    setApiFailed(false);
    getUserAppliedJobs(token)
      .then(res => {
        console.log('APPLIED JOBS' + JSON.stringify(res.data));
        setJobsData(res.data);
      })
      .catch(error => {
        // console.log(err);
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setApiFailed(true);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAppliedJobsData();

    setRefreshing(false);
  }, []);

  useEffect(() => {
    getAppliedJobsData();
  }, []);

  const filterJobsByCompany = () => {
    if (!jobsData) return []; // Return empty array if jobsData is null
    if (!searchText) return jobsData; // Return all jobs if searchText is empty

    // Filter jobs based on company name containing the searchText
    return jobsData.filter(item =>
      item.company.toLowerCase().includes(searchText.toLowerCase()),
    );
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {jobsData && !apiFailed ? (
        <>
          <View style={styles.uppercontainer}>
            <Text style={styles.uppercontainertext}>Applied Jobs</Text>
          </View>

          <View style={styles.searchboxinput}>
            <FontAwesome5 name="search" color={'#ffc107'} size={24} />
            <TextInput
              style={styles.searchbox}
              placeholder="Search By Name"
              placeholderTextColor={colors.black}
              onChangeText={text => setSearchText(text)}
            />
          </View>
          {jobsData && jobsData.length > 0 ? (
            <ScrollView>
              {filterJobsByCompany().map((item, index) => (
                <View key={item.id} style={styles.jobdisplaycontainer}>
                  <View>
                    <Text style={{color: colors.black}}>S.NO: {index + 1}</Text>
                    <Text style={{color: colors.black}}>
                      Company name: {item.company}
                    </Text>
                    <Text style={{color: colors.black}}>
                      Job title: {item.job_title}
                    </Text>
                    <Text style={{color: colors.black}}>
                      Applied date:{' '}
                      {moment(item.applied_date).format('MMMM Do YYYY, h:mm a')}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View>
              <NoDataAvailable />
            </View>
          )}
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

export default UserAppliedJobs;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
  },
  uppercontainer: {
    backgroundColor: colors.bgcolorSign_up_in,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    margin: 5,
  },
  uppercontainertext: {
    fontSize: 24,
    color: colors.black,
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
  jobdisplaycontainer: {
    margin: 10,
    backgroundColor: colors.white,
    elevation: 10,
    flexDirection: 'row',
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
