import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import {useSelector} from 'react-redux';
import {PostFeedback} from '../../apis/apicalls';
import routes from '../../constants/routes';

// for rating use Librery = npm i react-native-star-rating

const FeedbackScreen = ({navigation}) => {
  const token = useSelector(state => state.AuthReducer.authToken);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const FeedbackPost = (message, rating) => {
    PostFeedback(token, message, rating)
      .then(response => {
        console.log('Feedback Posted', response.data);
        Alert.alert('Thank-You for your Feedback');
        formsubmitted();
      })
      .catch(error => {
        // const errorMessage = error.message || 'An unexpected error occurred';
        let errorMessage = 'An unexpected error occurred';

        if (error.response) {
          // Check if the response has data
          if (error.response.data) {
            const errorData = error.response.data;

            // Check if there are specific errors or a general message
            if (errorData.errors) {
              // Extract the first error message, you can adjust this logic as needed
              const firstErrorKey = Object.keys(errorData.errors)[0];
              errorMessage = errorData.errors[firstErrorKey];
            } else if (errorData.message) {
              errorMessage = errorData.message;
            }
          }
        } else {
          // If no response, use the error's message
          errorMessage = error.message;
        }

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setFeedback(null);
    setRefreshing(false);
  }, []);

  const formsubmitted = () => {
    navigation.navigate(routes.DASHBOARD);
  };
  const handleSubmit = () => {
    // Initialize an array to store error messages for each field
    const errors = [];

    // Perform validations for each field
    if (!feedback || !feedback.trim()) {
      errors.push('Please Fill out the FeedBack Details');
    }
    if (errors.length > 0) {
      const errorMessage = errors.join('\n'); // Join error messages with newline character
      Alert.alert(errorMessage);
      return;
    }

    FeedbackPost(feedback, rating);
    // All fields are filled, proceed with form submission
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.MainContainer}>
        {/* <View>
                <Text style={styles.HeadingStyles}>FEEDBACK</Text>
            </View> */}
        <View style={styles.headingcontainer}>
          <Text style={styles.headtext}>FeedBack</Text>
        </View>
        <View style={styles.InfoContainer}>
          <FontAwesome5 name="user-circle" size={100} color={'#008374'} />
        </View>

        <View style={{paddingTop: 20}}>
          <Text style={styles.AddCommentTXT}>
            We would love to hear from you
          </Text>
        </View>

        <View style={styles.TxtInputContainer}>
          <TextInput
            placeholder="What is Your View...?"
            placeholderTextColor={colors.black}
            style={styles.TxtInput}
            multiline={true}
            value={feedback}
            onChangeText={text => setFeedback(text)}
          />
        </View>

        <TouchableOpacity style={styles.SendBTN} onPress={handleSubmit}>
          <Text style={styles.SendBTNTXT}>Send</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#ffff',
  },
  InfoContainer: {
    flexDirection: 'row',
    gap: 20,
    // alignItems:'center',
    padding: 10,
  },
  AddCommentTXT: {
    fontSize: 20,
    color: colors.black,
  },
  TxtInput: {
    borderWidth: 1,
    height: 120,
    width: '100%',
    borderRadius: 10,
    textAlignVertical: 'top',
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000000',
    borderColor: '#008374',
    flexWrap: 'wrap',
  },
  TxtInputContainer: {
    paddingTop: 30,
    paddingBottom: 30,
    flexDirection: 'row',
  },
  SendBTN: {
    padding: 10,
    borderRadius: 10,
    // alignItems:'center',
    height: 55,
    width: 80,
    backgroundColor: '#008374',
  },
  SendBTNTXT: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
  },
  HeadingStyles: {
    fontSize: 30,
    color: '#333',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  headingcontainer: {
    height: 50,
    backgroundColor: colors.grayLight,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headtext: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.black,
  },
});
