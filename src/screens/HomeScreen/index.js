import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {Card, Paragraph, Title} from 'react-native-paper';
import colors from '../../constants/colors';
import {getCommunities, getHomePageData} from '../../apis/apicalls';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const {width} = Dimensions.get('window');
const numColumns = 3; // Number of columns
const itemWidth = (width - 40) / numColumns;
const ImageSlider = ({images}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentIndex, images.length]);

  return (
    <View style={styles.sliderContainer}>
      <Image
        source={{uri: images[currentIndex]}}
        style={styles.sliderImage}
        resizeMode="cover"
      />
    </View>
  );
};

const SliderBanner = ({images}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef();

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const nextIndex = (currentIndex + 1) % images.length;
  //     scrollViewRef.current.scrollTo({
  //       animated: true,
  //       x: nextIndex * width,
  //     });
  //     setCurrentIndex(nextIndex);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [currentIndex, images.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;

      if (scrollViewRef.current) {
        // Check if scrollViewRef.current is not null
        scrollViewRef.current.scrollTo({
          animated: true,
          x: nextIndex * width,
        });
        setCurrentIndex(nextIndex);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, images.length]);

  const width = Dimensions.get('window').width;

  const renderImage = (image, index) => (
    <View key={index} style={styles.imageContainer}>
      <Image source={{uri: image}} style={styles.imageone} />
    </View>
  );

  return (
    <View style={styles.bannerContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event => {
          const contentOffset = event.nativeEvent.contentOffset.x;
          const index = Math.floor(contentOffset / width);
          setCurrentIndex(index);
        }}>
        {images.map((image, index) => renderImage(image, index))}
      </ScrollView>
    </View>
  );
};

export default function Home({navigation}) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bannerphotos, setbannerphotos] = useState([]);
  const [aboutData, setAboutData] = useState({});
  const [serviceData, setServicesData] = useState({});
  const [aboutDataPhotos, setAboutDataPhotos] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);

  const getHomeData = () => {
    setApiFailed(false);
    getHomePageData()
      .then(response => {
        setAboutData(response.about);
        setServicesData(response.services);
        setAboutDataPhotos(response.about.images);
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
    getCommuntybanners();
    getHomeData();
    setRefreshing(false);
  }, []);

  const getCommuntybanners = () => {
    getCommunities()
      .then(response => {
        const res = JSON.parse(JSON.stringify(response));
        console.log(response, 'comm');
        if (res && res.data) {
          const images = res.data.map(item => item.banner_image);
          setbannerphotos(images);
        }
      })
      .catch(error => {
        // console.log('Community DATA ERROR1' + error);
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setApiFailed(true);
      });
  };
  useEffect(() => {
    getCommuntybanners();
    getHomeData();
  }, []);

  const contentDataforabout = aboutData.content;
  const strippedContentforabout = contentDataforabout
    ? contentDataforabout.replace(/<[^>]*>/g, '')
    : '';

  const DataHomePage = [
    {
      text: 'Growth Community',
      image: require('../../assests/mainScreenbg.jpg'),
    },
    {
      text: 'Business Partner',
      image: require('../../assests/WelcomeScreen.png'),
    },
    {
      text: 'Partner Search',
      image: require('../../assests/mainScreenbg.jpg'),
    },
    {
      text: 'Growth Community',
      image: require('../../assests/activities.png'),
    },
    {
      text: 'Business Partner',
      image: require('../../assests/WelcomeScreen.png'),
    },
    {
      text: 'Partner Search',
      image: require('../../assests/activities.png'),
    },
    {
      text: 'Growth Community',
      image: require('../../assests/mainScreenbg.jpg'),
    },
    {
      text: 'Business Partner',
      image: require('../../assests/WelcomeScreen.png'),
    },
    {
      text: 'Partner Search',
      image: require('../../assests/activities.png'),
    },
    {
      text: 'Growth Community',
      image: require('../../assests/mainScreenbg.jpg'),
    },
    {
      text: 'Partner Search',
      image: require('../../assests/activities.png'),
    },
  ];

  useEffect(() => {
    let currentText = '';

    const intervalId = setInterval(() => {
      if (currentText.length < DataHomePage[currentIndex].text.length) {
        currentText += DataHomePage[currentIndex].text[currentText.length];
        setDisplayText(currentText);
      } else {
        currentText = '';
        setCurrentIndex(prevIndex => (prevIndex + 1) % DataHomePage.length);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentIndex]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {!apiFailed ? (
        <View style={{flex: 1}}>
          <View style={styles.mainimagecontainer}>
            <ImageBackground
              source={require('../../assests/WelcomeScreen.png')}
              resizeMode="cover"
              style={styles.image}>
              <View style={styles.fadingtextbox}>
                <Text style={styles.imageconstanttext}>
                  Social Bharat Helps
                </Text>
                <Text style={styles.fadingtext}>{displayText} </Text>
              </View>
            </ImageBackground>
          </View>
          <View>
            <SliderBanner images={bannerphotos} />
          </View>
          <Text style={styles.cardcontentheading}>
            {serviceData.section_title}
          </Text>
          {/* <View style={styles.navcontainer}>
   <TouchableOpacity
     style={styles.innernav}
     onPress={() => navigation.navigate('DashboardScreen')}>
     <Image
       style={styles.navImage}
       source={require('../../assests/navuse.png')}
       resizeMode="cover"
     />
     <Text style={styles.navtext}>Dashboard</Text>
   </TouchableOpacity>
   <TouchableOpacity
     style={styles.innernav}
     onPress={() => navigation.navigate('MembersScreen')}>
     <Image
       style={styles.navImage}
       source={require('../../assests/navMembers.png')}
       resizeMode="cover"
     />
     <Text style={styles.navtext}>Members</Text>
   </TouchableOpacity>
   <TouchableOpacity
     style={styles.innernav}
     onPress={() => navigation.navigate('JobsScreen')}>
     <Image
       style={styles.navImage}
       source={require('../../assests/navemployment.jpg')}
       resizeMode="cover"
     />
     <Text style={styles.navtext}>Jobs</Text>
   </TouchableOpacity>
   <TouchableOpacity
     style={styles.innernav}
     onPress={() => navigation.navigate('BusinessScreen')}>
     <Image
       style={styles.navImage}
       source={require('../../assests/navBusiness.png')}
       resizeMode="cover"
     />
     <Text style={styles.navtext}>Business</Text>
   </TouchableOpacity>
   <TouchableOpacity
     style={styles.innernav}
     onPress={() => navigation.navigate('MatrimonialScreen')}>
     <Image
       style={styles.navImage}
       source={require('../../assests/navMatrimonial.jpg')}
       resizeMode="cover"
     />
     <Text style={styles.navtext}>Matrimonial</Text>
   </TouchableOpacity>
   <TouchableOpacity
     style={styles.innernav}
     onPress={() => navigation.navigate('ServiceScreen')}>
     <Image
       style={styles.navImage}
       source={require('../../assests/navservices.png')}
       resizeMode="cover"
     />
     <Text style={styles.navtext}>Services</Text>
   </TouchableOpacity>
 </View> */}
          <View style={styles.navcontainer}>
            <TouchableOpacity
              style={styles.innernav}
              onPress={() => navigation.navigate('DashboardScreen')}>
              <Image
                style={styles.navImage}
                source={require('../../assests/navuse.png')}
                resizeMode="cover"
              />
              <Text style={styles.navtext}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.innernav}
              onPress={() => navigation.navigate('MembersScreen')}>
              <Image
                style={styles.navImage}
                source={require('../../assests/navMembers.png')}
                resizeMode="cover"
              />
              <Text style={styles.navtext}>Members</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.innernav}
              onPress={() => navigation.navigate('JobsScreen')}>
              <Image
                style={styles.navImage}
                source={require('../../assests/navemployment.jpg')}
                resizeMode="cover"
              />
              <Text style={styles.navtext}>Jobs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.innernav}
              onPress={() => navigation.navigate('BusinessScreen')}>
              <Image
                style={styles.navImage}
                source={require('../../assests/navBusiness.png')}
                resizeMode="cover"
              />
              <Text style={styles.navtext}>Business</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.innernav}
              onPress={() => navigation.navigate('MatrimonialScreen')}>
              <Image
                style={styles.navImage}
                source={require('../../assests/navMatrimonial.jpg')}
                resizeMode="cover"
              />
              <Text style={styles.navtext}>Matrimonial</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.innernav}
              onPress={() => navigation.navigate('ServiceScreen')}>
              <Image
                style={styles.navImage}
                source={require('../../assests/navservices.png')}
                resizeMode="cover"
              />
              <Text style={styles.navtext}>Services</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sliderBoxContainer}>
            <View style={styles.contectboxslider}>
              <View>
                <Text style={styles.sliderContainertextmain}>
                  {aboutData.title}
                </Text>
                <Text style={styles.sliderContainertext}>
                  {aboutData.subtitle}
                </Text>
              </View>
              <View>
                <Text style={styles.answertext}>{strippedContentforabout}</Text>
              </View>
            </View>
            {aboutDataPhotos && <ImageSlider images={aboutDataPhotos} />}
          </View>

          <View>
            <Text style={styles.cardcontentheading}>
              {serviceData.section_title}
            </Text>
            {serviceData && serviceData.items ? (
              serviceData.items.map((item, index) => (
                <Card key={index} style={{margin: 20, elevation: 5}}>
                  <Card.Content style={styles.cardContent}>
                    <View style={styles.cardRow}>
                      <View>
                        {index % 4 === 0 ? (
                          <FontAwesome5
                            name="handshake"
                            size={24}
                            style={styles.icon}
                          />
                        ) : index % 4 === 1 ? (
                          <FontAwesome5
                            name="ring"
                            size={24}
                            style={styles.icon}
                          />
                        ) : index % 4 === 2 ? (
                          <FontAwesome5
                            name="briefcase"
                            size={24}
                            style={styles.icon}
                          />
                        ) : (
                          <FontAwesome5
                            name="list"
                            size={24}
                            style={styles.icon}
                          />
                        )}
                      </View>
                      <View style={styles.cardContent}>
                        <Title style={styles.cardTitle}>{item.title}</Title>
                        <Paragraph style={styles.para}>
                          {item.content.replace(/<\/?p>/g, '')}
                        </Paragraph>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              ))
            ) : (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
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
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: 'row',
  },
  cardContent: {
    flex: 1,
    marginLeft: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  para: {
    color: 'black',
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 16,
    marginRight: 5,
  },
  icon: {
    marginRight: 5,
    marginTop: 5,
    color: '#0066CC',
  },
  image: {
    justifyContent: 'center',
    height: '100%',
  },
  contectboxslider: {
    margin: 10,
  },
  imageconstanttext: {
    color: colors.white,
    marginTop: 180,
    fontSize: 25,
    fontWeight: 'bold',
  },
  sliderContainertextmain: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.RegisterandLoginButton,
  },
  sliderContainertext: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.RegisterandLoginButton,
  },
  fadingtext: {
    color: 'yellow',
    fontSize: 25,
    fontWeight: 'bold',
  },
  fadingtextbox: {
    marginTop: 30,
    marginLeft: 20,
  },
  bannerContainer: {
    height: 100,
    marginBottom: 10,
    backgroundColor: colors.bgColor,
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
  },

  imageone: {
    width: 90,
    height: 80,
    margin: 10,
    resizeMode: 'cover',
  },
  sliderBoxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    margin: 10,
  },
  sliderContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  sliderImage: {
    width: 300,
    height: 250,
  },
  answertext: {
    color: colors.black,
    fontSize: 20,
    margin: 5,
  },
  cardcontentheading: {
    color: colors.black,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  mainimagecontainer: {
    flex: 1,
    height: 350,
    marginBottom: 10,
  },
  navcontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Space between items to fit 3 items perfectly
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  innernav: {
    width: itemWidth, // Dynamically set width based on screen size
    alignItems: 'center',
    marginBottom: 15, // Add margin between rows
  },
  navImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  navtext: {
    color: 'black',
    textAlign: 'center',
    fontSize: 15,
    marginTop: 5,
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
