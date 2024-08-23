import {
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {getJobs} from '../../../apis/apicalls';
import {useSelector} from 'react-redux';
import colors from '../../../constants/colors';
import {ActivityIndicator} from 'react-native';
import {Image} from 'react-native';
import {TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {TextInput} from 'react-native';
const UserCreatedJobs = () => {
  const [hasNoData, setHasNoData] = useState(false);
  const [jobsData, setJobsData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [searchText, setSearchText] = useState('');
  const [jobType, setJobType] = useState('myJobs');
  const token = useSelector(state => state.AuthReducer.authToken);
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);

  const getJobsData = (page, state, city, search, jobType) => {
    // console.log('HEYYYYYYY', page, state, city, search, jobType);
    // console.log(isFetching);
    if (isFetching) return; // Prevent multiple fetches
    setIsFetching(true);
    setHasNoData(false);
    setApiFailed(false);

    getJobs(token, page, state, city, search, jobType)
      .then(response => {
        // console.log(response.data); // Log the entire response to verify its structure
        if (response.data.jobs.length < 1) {
          setHasNoData(true);
        }
        setPageCount(response.data.totalRowsAffected);
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
    setJobsData([]);
    getJobsData(1, selectedState, selectedCity, searchText, jobType);

    setRefreshing(false);
  }, []);
  const handleScroll = event => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const paddingToBottom = 20;
    if (
      !isFetching &&
      layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
    ) {
      if (!isFetching && currentPage == Math.ceil(pageCount / 5)) {
        setHasNoData(true);
      } else {
        // setIsLoading(true);
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        getJobsData(nextPage, selectedState, selectedCity, searchText, jobType);
      }
    }
  };
  // setTimeout(() => {
  //   setHasNoData(true);
  // }, 9000);
  useEffect(() => {
    setJobsData([]);
    getJobsData(1, selectedState, selectedCity, searchText, jobType);
  }, [selectedState, selectedCity, searchText, jobType]);
  return (
    <>
      {!apiFailed ? (
        <View style={styles.searchboxinput}>
          <FontAwesome5 name="search" color={'#ffc107'} size={24} />
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
        </View>
      ) : (
        <></>
      )}

      <ScrollView
        style={styles.innercontainer}
        onScroll={handleScroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* {jobsData.length >= 0 && !apiFailed ? (
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
                </View>
              </View>
            );
          })
        ) : (
          <>
            {apiFailed ? (
              <View style={styles.nomoretextcontainer}>
                <Text style={styles.nomoretext}>
                  Check your Internet, pull to refresh
                </Text>
              </View>
            ) : jobsData.length === 0 ? (
              <View style={styles.nomoretextcontainer}>
                <Text style={styles.nomoretext}>No data available</Text>
              </View>
            ) : (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
          </>
        )} */}
        {jobsData.length > 0 && !apiFailed ? (
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
                </View>
              </View>
            );
          })
        ) : (
          <>
            {apiFailed ? (
              <View style={styles.nomoretextcontainer}>
                <Text style={styles.nomoretext}>
                  Check your Internet, pull to refresh
                </Text>
              </View>
            ) : jobsData.length === 0 ? (
              <View style={styles.nomoretextcontainer}>
                <Text style={styles.nomoretext}>No data available</Text>
              </View>
            ) : (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
          </>
        )}
      </ScrollView>
    </>
  );
};

export default UserCreatedJobs;

const styles = StyleSheet.create({
  card: {
    marginTop: 15,
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
    margin: 10,
    padding: 10,
  },
  cardBottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 20,
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
  buttoncontainer: {
    fontWeight: 'bold',
    color: colors.black,
  },
  innercontainer: {
    margin: 10,
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
