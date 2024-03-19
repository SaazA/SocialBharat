import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import colors from '../../constants/colors';
import { getCommunities, getHomePageData } from '../../apis/apicalls';

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
      <Image source={images[currentIndex]} style={styles.sliderImage} resizeMode="cover"/>
    </View>
  );
};

const SliderBanner = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      scrollViewRef.current.scrollTo({
        animated: true,
        x: nextIndex * width,
      });
      setCurrentIndex(nextIndex);
    }, 1000);
  
    return () => clearInterval(interval);
  }, [currentIndex, images.length]);
  

  const width = Dimensions.get('window').width;

  const renderImage = (image, index) => (
    <View key={index} style={styles.imageContainer}>
      <Image source={{ uri: image }} style={styles.imageone} />
    </View>
  );

  return (
    <View style={styles.bannerContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const contentOffset = event.nativeEvent.contentOffset.x;
          const index = Math.floor(contentOffset / width);
          setCurrentIndex(index);
        }}
      >
        {images.map((image, index) => renderImage(image, index))}
      </ScrollView>
    </View>
  );
};


export default function Home({navigation}) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bannerphotos , setbannerphotos] = useState([]);
  const [bannerData , setBannerData] = useState([]);
  

  const getHomeData = () => {
    try {
      getHomePageData() 
        .then(response => {
           const res = response;
          // console.log("HEELELLEEEOEE"+JSON.stringify(res.data));
           setBannerData(JSON.stringify(res.data.data.about.title) );
           console.log("Banner"+bannerData);
        }) 
        .catch(error => { 
          console.log(error); 
        });
    } catch (error) {
      console.log(error);
    }
  };
  
  
  
  
  const getCommuntybanners = () => {
    try {
      getCommunities() 
        .then(response => {
          const res = JSON.parse(JSON.stringify(response));
          if (res && res.data) {
            const images = res.data.map(item => item.banner_image);
            setbannerphotos(images);
        }
        }) 
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect (()=>{
    // getCommuntybanners()
    getHomeData()
  },[])
  
  
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

  const CardData = [
    {
      Heading:'Community Connect',
      MainText:"Social Bharat's Community Connection feature facilitates interaction and engagement among individuals from various backgrounds, promoting a sense of unity and mutual understanding between different communities."
    },
    {
      Heading:'Matrimonial',
      MainText:"Social Bharat's matrimonial feature simplifies the search for a life partner by allowing users to create detailed profiles, express their preferences, and find compatible matches within a secure and private environment, making the journey to finding a life partner efficient and personalized."
    },
    {
      Heading:'Business Promotion',
      MainText:"Social Bharat provides a powerful platform for businesses to connect with their target audience, enhance their online presence, and effectively promote their products and services, ensuring increased visibility and growth opportunities in the digital landscape."
    },
    {
      Heading:'Job Posting',
      MainText:"Social Bharat's job posting feature enables employers to effortlessly connect with potential candidates, facilitating seamless recruitment. It streamlines the hiring process, making it efficient for businesses to find the right talent and for job seekers to discover promising opportunities within our platform."
    }
  ]
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
  const imagePaths = DataHomePage.map(item => item.image);
  return (
    <ScrollView>
      <View style={{flex: 1}}>
        <View style={styles.mainimagecontainer}>
        <ImageBackground
          source={require('../../assests/WelcomeScreen.png')}
          resizeMode="cover"
          style={styles.image}>
          <View style={styles.fadingtextbox}>
            <Text style={styles.imageconstanttext}>Social Bharat Helps</Text>
            <Text style={styles.fadingtext}>{displayText} </Text>
          </View>
        </ImageBackground>
        </View>
        <View>
          <SliderBanner images={bannerphotos} />
        </View>
        <View style={styles.sliderBoxContainer}> 
          <View style={styles.contectboxslider}>
            <View>
              <Text style={styles.sliderContainertextmain}>{bannerData.about}</Text>
              <Text style={styles.sliderContainertext}>Connecting Communities with Privacy & Matrimonial Excellence.</Text>
            </View>
            <View>
              <Text style={styles.answertext}><Text>#</Text>Discover and participate in communities you love.</Text>
              <Text style={styles.answertext}><Text>#</Text>Trustworthy profiles for a secure matrimonial experience.</Text>
              <Text style={styles.answertext}><Text>#</Text>Private Sharing in Chosen Communities.Find Life Partners with Privacy.</Text>
              <Text style={styles.answertext}><Text>#</Text>Elevate your business to new heights</Text>
              <Text style={styles.answertext}><Text>#</Text>Plan and attend events with friends and 
              like-minded individuals.</Text>
            </View>
          </View>
          {/* <ImageSlider images={imagePaths}/> */}
        </View>

      <View style={styles.cardcontentbox}>
        <Text style={styles.cardcontentheading}>Social Bharat Provides</Text>
        <View>
  {CardData.map((item, index) => (
    <View key={index} style={styles.cardbox}>
      <Text style={styles.cardboxheading}>{item.Heading}</Text>
      <Text style={styles.cardboxtext}>{item.MainText}</Text>
    </View>
  ))}
</View>
      </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  marque_text: {},
  image: {
    justifyContent: 'center',
    height:'100%'
  },
  contectboxslider:{
    margin:10
  },
  imageconstanttext: {
    color: colors.white,
    marginTop: 180,
    fontSize: 25,
    fontWeight: 'bold',
  },
  sliderContainertextmain:{
    fontSize: 25,
    fontWeight: 'bold',
    color:colors.RegisterandLoginButton
  },
  sliderContainertext:{
    fontSize: 18,
    fontWeight: 'bold',
    color:colors.RegisterandLoginButton
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
    margin: 10,
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
    backgroundColor:colors.grayLight,
    margin:10
  },
  sliderContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    margin:10
  },
  sliderImage: {
    width: 300,
    height: 250,
    resizeMode: 'contain',
  },
  answertext:{
    color:colors.black,
    fontSize:15,
    margin:5,
  },
  cardcontentbox:{
    margin:5,
  },
  cardcontentheading:{
    color:colors.black,
    textAlign:'center',
    fontSize:30,
    fontWeight:'bold'
  },
  cardboxheading:{
    color:colors.black,
    fontSize:20
  },
  cardboxtext:{
    color:colors.black,
    fontSize:15
  },
  cardbox:{
    margin:10
  },
  mainimagecontainer:{
    flex:1,
    height:350,
    margin:10
  }

});
