import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ToastAndroid,
} from 'react-native';
import React, {useEffect} from 'react';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import colors from '../../constants/colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import routes from '../../constants/routes';
import {useSelector} from 'react-redux';
import {getCommunitybyid} from '../../apis/apicalls';

const cardcontainerupper = colorcode => ({
  backgroundColor: colorcode,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  margin: 10,
  height: 80,
  marginBottom: 0,
  borderTopRightRadius: 50,
});

const cardcontainerlower = colorcode => ({
  backgroundColor: colorcode,
  margin: 10,
  height: 50,
  display: 'flex',
  borderTopColor: 'black',
  borderTopWidth: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 0,
  borderBottomLeftRadius: 30,
});

const Dashboard = ({navigation}) => {
  const card_data = [
    {
      color: '#025E73',
      card_title: 'Profile',
      card_title_nav: routes.PROFILESCREEN,
      card_title_main: 'Manage Profile',
      cart_view_action: 'View',
      cart_edit_action: 'Edit',
      card_icon_file: require('../../assests/activities.png'),
      card_nav: routes.PROFILESCREEN,
      card_post_nav: routes.EDITPROFILE,
    },
    {
      color: '#6C757D',
      card_title: 'Jobs',
      card_title_nav: routes.JOBSSCREEN,
      card_title_main: 'Jobs',
      cart_view_action: 'Search',
      cart_edit_action: 'Post Job',
      card_icon_file: require('../../assests/jobs.webp'),
      card_nav: routes.JOBSSCREEN,
      card_post_nav: routes.CREATENEWJOB,
    },
    {
      color: '#8C654F',
      card_title: 'Business',
      card_title_nav: routes.BUSISNESSSCREEN,
      card_title_main: 'Business Promotion',
      cart_view_action: 'Search',
      cart_edit_action: 'Post Your Ad',
      card_icon_file: require('../../assests/financial.webp'),
      card_nav: routes.BUSISNESSSCREEN,
      card_post_nav: routes.BUSINESSPROMOTE,
    },
    {
      color: '#BF7E6F',
      card_title: 'Services',
      card_title_nav: routes.SERVICESCREEN,
      card_title_main: 'Services',
      cart_view_action: 'Search',
      cart_edit_action: 'View',
      card_icon_file: require('../../assests/service3.webp'),
      card_nav: routes.SERVICESCREEN,
      card_post_nav: routes.SERVICESCREEN,
    },
    {
      color: '#F28157',
      card_title: 'Matrimonial',
      card_title_nav: routes.MATRIMONIALSCREEN,
      card_title_main: 'Matrimonial',
      cart_view_action: 'Search',
      cart_edit_action: 'View',
      card_icon_file: require('../../assests/wedding.webp'),
      card_nav: routes.MATRIMONIALSCREEN,
      card_post_nav: routes.MATRIMONIALSCREEN,
    },
    {
      color: '#6AA668',
      card_title: 'Become Social',
      card_title_nav: routes.MEMBERSSCREEN,
      card_title_main: 'Search Members',
      cart_view_action: 'Search',

      cart_edit_action: 'View',
      card_icon_file: require('../../assests/searchpeople.webp'),
      card_nav: routes.MEMBERSSCREEN,
      card_post_nav: routes.MEMBERSSCREEN,
    },
    {
      color: '#634A00',
      card_title: 'Event',
      card_title_nav: routes.EVENTSSCREEN,
      card_title_main: 'Events',
      cart_view_action: 'Search',
      cart_edit_action: 'Post Event',
      card_icon_file: require('../../assests/placard.webp'),
      card_nav: routes.EVENTSSCREEN,
      card_post_nav: routes.CREATEEVENTS,
    },
    {
      color: '#8C654F',
      card_title: 'Activities',
      card_title_nav: routes.ACTIVITESSCREEN,
      card_title_main: 'Social Activities',
      cart_view_action: 'Search',
      cart_edit_action: 'Post Activity',
      card_icon_file: require('../../assests/activity.webp'),
      card_nav: routes.ACTIVITESSCREEN,
      card_post_nav: routes.POSTACTIVITIES,
    },
    {
      color: '#009BCE',
      card_title: 'Share Your Feedback',
      card_title_nav: routes.FEEDBACKSCREEN,
      card_title_main: 'Feedback',
      cart_view_action: 'Give Feedback',
      cart_edit_action: 'View',
      card_icon_file: require('../../assests/fe.webp'),
      card_nav: routes.FEEDBACKSCREEN,
      card_post_nav: routes.FEEDBACKSCREEN,
    },
  ];

  // const smallText = [
  //   Profile,
  //   BecomeSocial,
  //   Matrimonial,
  //   Business,

  // ]

  return (
    <ScrollView>
      {card_data.map((el, index) => (
        <View key={index}>
          <View style={cardcontainerupper(el.color)}>
            <View style={styles.cardcontainerupperleft}>
              <Text>{el.card_title}</Text>
              <Pressable onPress={() => navigation.navigate(el.card_title_nav)}>
                <Text style={styles.cardtextbig}>{el.card_title_main}</Text>
              </Pressable>
            </View>
            <View style={styles.cardcontainerupperright}>
              <Image
                source={el.card_icon_file}
                resizeMode="cover"
                style={styles.image}></Image>
            </View>
          </View>
          <View style={cardcontainerlower(el.color)}>
            <View style={styles.cardcontainerlowerleft}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(el.card_nav);
                }}>
                <Text style={styles.cardtextsmall}>{el.cart_view_action}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cardcontainerlowerright}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(el.card_post_nav);
                }}>
                <Text style={styles.cardtextsmall}>{el.cart_edit_action}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
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
  cardtextsmall: {
    color: '#FFFFFF',
  },
  cardtextbig: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  cardcontainerlowerleft: {
    margin: 10,
  },
  cardcontainerlowerright: {
    margin: 10,
  },
});
