import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
  RefreshControl,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {getServicesRegisteredByUser} from '../../../apis/apicalls';
import {useSelector} from 'react-redux';
import colors from '../../../constants/colors';
import Dividedboxcontainer from '../../../Components/dividedboxcontainer';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useFocusEffect} from '@react-navigation/native';

export default function RegisteredServicesUser() {
  const [data, setData] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);

  const token = useSelector(state => state.AuthReducer.authToken);
  const getUserRegisteredServices = () => {
    setApiFailed(false);
    getServicesRegisteredByUser(token)
      .then(response => {
        console.log('User Registered Services are', response);
        setData(response.data);
      })
      .catch(error => {
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setApiFailed(true);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getUserRegisteredServices();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getUserRegisteredServices();
    }, []),
  );

  // useEffect(() => {
  //   getUserRegisteredServices();
  // }, []);

  const handleApplyPress = () => {
    const applyLink =
      'https://www.socialbharat.org/user/user-registered-services';
    Linking.openURL(applyLink);
  };
  return (
    <ScrollView
      style={styles.maincontainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {!apiFailed && data ? (
        <>
          <View style={styles.headercontianer}>
            <Text style={styles.headertext}>Registered Services</Text>
          </View>
          <ScrollView style={styles.outercontainer} nestedScrollEnabled={true}>
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <View key={index} style={styles.innercontainer}>
                  <View style={styles.flexcontcard}>
                    <View>
                      <Text style={{color: colors.black}}>
                        S.No: {index + 1}
                      </Text>
                    </View>
                    <View style={styles.flexcontcardinner}>
                      <TouchableOpacity onPress={handleApplyPress}>
                        <FontAwesome5
                          name="edit"
                          color={colors.black}
                          size={24}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleApplyPress}>
                        <FontAwesome5
                          name="trash"
                          color={colors.black}
                          size={24}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {[
                    {
                      label: 'Title',
                      value: item.title,
                    },
                    {
                      label: 'Mobile 1',
                      value: item.mobile1,
                    },
                    {
                      label: 'Mobile 2 ',
                      value: item.mobile2,
                    },
                    {label: 'Experience', value: item.experience},
                    {
                      label: 'State',
                      value: item.state,
                    },
                    {
                      label: 'City',
                      value: item.city,
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
              <View style={styles.nodatacont}>
                <Text style={{color: colors.black}}>No Data Available</Text>
              </View>
            )}
          </ScrollView>
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
}

const styles = StyleSheet.create({
  maincontainer: {
    margin: 10,
  },
  outercontainer: {
    maxHeight: 600,
    borderWidth: 1,
    backgroundColor: colors.white,
    borderColor: colors.grayLight,
  },
  innercontainer: {
    borderWidth: 1,
    margin: 5,
    padding: 5,
    borderColor: colors.grayLight,
    borderRadius: 10,
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
  headertext: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '500',
  },
  flexcontcard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  flexcontcardinner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 100,
  },
  nodatacont: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
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
