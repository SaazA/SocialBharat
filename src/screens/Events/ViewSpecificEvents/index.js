import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getSpecificEvent} from '../../../apis/apicalls';
import {useSelector} from 'react-redux';
import colors from '../../../constants/colors';
import moment from 'moment';

const ViewSpecificEvent = ({navigation, route}) => {
  const {id} = route.params;
  const token = useSelector(state => state.AuthReducer.authToken);
  const [data, setData] = useState();
  useEffect(() => {
    getEvent(id);
  }, []);
  const getEvent = id => {
    getSpecificEvent(token, id)
      .then(response => {
        console.log('Events', response.data.banner_image);
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <ScrollView style={styles.maincontainer}>
      {data ? (
        <>
          <View style={styles.headercontainer}>
            <View style={styles.imagecontainer}>
              <Image
                source={
                  data.photo
                    ? {uri: data.photo} // Use the URL if available
                    : require('../../../assests/nullphotocover.jpg') // Use local asset if not
                }
                style={styles.image}
              />
            </View>
            <View style={styles.headtextcontainer}>
              <Text style={styles.headtext}>Posted By:{data.name}</Text>
            </View>
          </View>
          <View style={styles.contentcontainer}>
            <View style={styles.contentspecific}>
              <Text style={styles.labeltext}>Event Info:</Text>
              <Text style={styles.valuetext}>{data.title}</Text>
            </View>
            <View style={styles.contentspecific}>
              <Text style={styles.labeltext}>Venue:</Text>
              <Text style={styles.valuetext}>{data.venue}</Text>
            </View>
            <View style={styles.contentspecific}>
              <Text style={styles.labeltext}>Start Date/Time:</Text>
              <Text style={styles.valuetext}>
                {' '}
                {moment(data.start_datetime).format('MMMM Do YYYY, h:mm:ss a')}
              </Text>
            </View>
            <View style={styles.contentspecific}>
              <Text style={styles.labeltext}>End Date/Time:</Text>
              <Text style={styles.valuetext}>
                {moment(data.end_datetime).format('MMMM Do YYYY, h:mm:ss a')}
              </Text>
            </View>
            <View style={styles.outerimage}>
              <Text style={styles.labeltext}>Banner Image</Text>
              <View style={styles.bannerimagecontainer}>
                <Image
                  source={
                    data.banner_image
                      ? {uri: data.banner_image} // Use the URL if available
                      : require('../../../assests/nullphotocover.jpg') // Use local asset if not
                  }
                  resizeMode="contain"
                  style={styles.bannerimage}
                />
              </View>
            </View>
            <View style={styles.contentspecific}>
              <Text style={styles.labeltext}>Description:</Text>
              <Text style={styles.valuetext}>{data.DESCRIPTION}</Text>
            </View>
          </View>
        </>
      ) : (
        <></>
      )}
    </ScrollView>
  );
};

export default ViewSpecificEvent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    margin: 10,
  },
  headercontainer: {
    height: 300,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 10,
  },
  contentcontainer: {
    backgroundColor: colors.bgColor,
    borderRadius: 20,
    padding: 10,
  },
  imagecontainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {width: 150, height: 150},
  headtextcontainer: {
    margin: 10,
  },
  headtext: {
    color: colors.black,
    fontSize: 20,
    fontWeight: '500',
  },
  labeltext: {
    color: colors.black,
    fontSize: 20,
    fontWeight: '500',
  },
  valuetext: {
    color: colors.black,
    fontSize: 18,
  },
  contentspecific: {
    marginLeft: 10,
  },
  outerimage: {alignItems: 'center'},
  bannerimagecontainer: {width: '100%'},
  bannerimage: {
    width: '100%',
    height: 200,
  },
});
