import {Alert, StyleSheet, Text, ToastAndroid, View} from 'react-native';
import React, {useState, useCallback} from 'react';

import {
  TouchableOpacity,
  TextInput,
  ScrollView,
  Button,
  RefreshControl,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import colors from '../../../constants/colors';

import DocumentPicker from 'react-native-document-picker';
import {ActivityPost, uploadImages} from '../../../apis/apicalls';
import {useSelector} from 'react-redux';
import {Image} from 'react-native';
import routes from '../../../constants/routes';
// import { launchImageLibrary } from 'react-native-image-picker';
//import Icon from 'react-native-vector-icons/FontAwesome';

const PostActivities = ({navigation}) => {
  const token = useSelector(state => state.AuthReducer.authToken);
  const [category, setCategory] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [title, setTitle] = useState('');
  const [selectedBannerImageName, setSelectedBannerImageName] = useState();
  const [description, setDescription] = useState('');
  const [parsedPhotoData, setParsedPhotoData] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setCategory(null),
      setDescription(),
      setParsedPhotoData(),
      setTitle(),
      setRefreshing(false);
  }, []);

  const [imageUri, setImageUri] = useState([]);

  const categoryData = [
    {label: 'Information Technology (IT)', value: '1'},
    {label: 'Sales', value: '2'},
    {label: 'Marketing', value: '3'},
    {label: 'Manufacturing', value: '4'},
    {label: 'Service', value: '5'},
    {label: 'Finance', value: '6'},
    {label: 'Real Estate', value: '7'},
    {label: 'Healthcare', value: '8'},
    {label: 'Transportation and Logistics', value: '8'},
    {label: 'Hospitality', value: '9'},
    {label: 'Education', value: '10'},
    {label: 'Nonprofit Organizations', value: '11'},
    {label: 'Polity', value: '12'},
    {label: 'Other', value: '13'},
  ];

  const postActivity = (category, description, photo, title) => {
    // console.log('Heyee', imageUri);
    ActivityPost(token, category, description, photo, title)
      .then(response => {
        // setParsedPhotoData(response.data.files);
        console.log('Activity', response.data.message);
        navigation.navigate(routes.ACTIVITESSCREEN);
      })
      .catch(error => {
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      });
  };

  const UploadImage = data => {
    // console.log('Heyee', imageUri);

    uploadImages(token, data)
      .then(response => {
        setParsedPhotoData(response.data.files);
        console.log('parsedphotoData', response.data);
      })
      .catch(error => {
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      });
  };

  const handleSubmit = () => {
    // Initialize an array to store error messages for each field
    const errors = [];

    // Perform validations for each field
    if (!category || !description || !parsedPhotoData || !title) {
      errors.push('Please Fill out all the Mandatory Details');
    }
    if (errors.length > 0) {
      const errorMessage = errors.join('\n'); // Join error messages with newline character
      Alert.alert(errorMessage);
      return;
    }

    // All fields are filled, proceed with form submission

    postActivity(categoryName, description, parsedPhotoData, title);
  };

  const selectPhoto = () => {
    return new Promise((resolve, reject) => {
      DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        allowMultiSelection: true,
      })
        .then(doc => {
          if (doc.length > 5 || doc.length < 2) {
            Alert.alert(
              'You can only select minimum to 2 photos or less than 5 .',
            );
            resolve(); // Resolve to exit early
            return;
          }
          let tr = doc.map(el => {
            return el.uri;
          });
          console.log(tr);
          UploadImage(doc);
          // const name = doc.map(doc => doc.name);
          // setImageName(name);
          console.log('trrr', tr);
          setImageUri(tr);
          resolve();
        })
        .catch(err => {
          if (DocumentPicker.isCancel(err)) {
            resolve();
          } else {
            reject(err);
          }
        });
    });
  };

  const handleDeletePhoto = index => {
    const updatedImageUri = [...imageUri];
    updatedImageUri.splice(index, 1);
    setImageUri(updatedImageUri);
  };

  // const postPhotoBanner = formData => {
  //   PostImage(token, formData)
  //     .then(response => {
  //       console.log('some Photo', response.data);
  //       setBannerImage(response.data.image);
  //     })
  //     .catch(error => {
  //       console.error('Error posting photo:', error);
  //       //Alert.alert('Error posting photo!');
  //     });
  // };

  return (
    <ScrollView
      contentContainerStyle={{backgroundColor: '#ffffff'}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.container}>
        <View style={styles.headingContainer}>
          <Text style={styles.headingContainerText}>Activity</Text>
        </View>

        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(routes.ACTIVITESSCREEN)}>
            <Text style={styles.buttonText}>View All Activities</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.textInputHeading}>Category</Text>
        </View>

        <View style={styles.textInputContainer}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            TextInputSearchStyle={styles.TextInputSearchStyle}
            inputSearchStyle={{color: colors.black}}
            itemTextStyle={styles.itemTextStyle}
            iconStyle={styles.iconStyle}
            data={categoryData}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Category....."
            searchPlaceholder="Search..."
            value={category}
            onChange={item => {
              setCategory(item.value);
              setCategoryName(item.label);
            }}
          />
        </View>

        <View>
          <Text style={styles.textInputHeading}>Title</Text>
        </View>

        <View style={styles.textInputContainer}>
          <TextInput
            placeholder="Enter Title"
            value={title}
            placeholderTextColor={colors.black}
            onChangeText={text => setTitle(text)}
            style={styles.inputText}></TextInput>
        </View>

        <View>
          <Text style={styles.textInputHeading}>Select Image</Text>
        </View>

        {/* <View style={styles.textInputContainer}>
          {/* <View style={{ flexDirection: 'row', alignItems: 'center',padding: 10, backgroundColor:'white',borderColor:'#000', borderRadius:10}}>
        <Button title="Choose File" onPress={handleLaunchImageLibraryBanner} color=""/>
        {/* <Icon name="twitter" size={30} color="#0077B5" style={{marginHorizontal:10}} /> */}
        {/* <Text style={{flex: 1, marginLeft: 10, color: 'black', fontSize: 15}}>
          {selectedBannerImageName
            ? selectedBannerImageName
            : 'No file choosen'}
        </Text> */}
        {/* </View> */}
        {/* </View> */}

        <View>
          <Text style={styles.uploadcontianerheadtext}>Proposal Photos</Text>
          <Text style={styles.uploadcontainersubheadtext}>
            Add atleast 2 and maximum 5 photos (should be in png,jpg,jgep
            format)
          </Text>
          <TouchableOpacity style={styles.browsebox} onPress={selectPhoto}>
            <View style={styles.browsebutton}>
              <Text style={styles.uploadcontainerText}> Browse..</Text>
            </View>

            <TextInput style={styles.browseInputBox} editable={false}>
              {parsedPhotoData}
            </TextInput>
          </TouchableOpacity>
          <View></View>
        </View>
        <View style={styles.bottomshowcontainer}>
          {parsedPhotoData &&
            imageUri.map((photo, index) => (
              <View key={index} style={styles.showcontainerimage}>
                <Image
                  source={{uri: photo}}
                  style={styles.showcontainerimagestyle}
                />
                <View style={styles.deleteButtonImage}>
                  <TouchableOpacity
                    style={styles.crossmark}
                    onPress={handleDeletePhoto}>
                    <Text style={{color: colors.white}}>X</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
        </View>
        <View>
          <Text style={styles.textInputHeading}>Description</Text>
        </View>

        <View style={styles.textInputContainer}>
          <TextInput
            placeholder="Enter description"
            value={description}
            placeholderTextColor={colors.black}
            onChangeText={text => setDescription(text)}
            style={styles.inputText}></TextInput>
        </View>

        <View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default PostActivities;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },

  headingContainer: {
    backgroundColor: '#008374',
    borderRadius: 5,
    marginBottom: 20,
  },
  headingContainerText: {
    fontSize: 25,
    fontWeight: '900',
    padding: 5,
    color: '#ffffff',
    paddingLeft: 10,
  },
  textInputHeading: {
    fontSize: 20,
    fontWeight: '800',
    paddingBottom: 10,
    marginLeft: 5,
    color: '#000',
  },
  textInputContainer: {
    borderColor: '#008374',
    borderWidth: 0.5,
    borderRadius: 5,
    marginBottom: 20,
  },

  inputText: {
    paddingHorizontal: 10,
    fontSize: 20,
    color: '#000',
  },
  dropdown: {
    height: 50,
    paddingLeft: 10,
    color: '#000',
    padding: 5,
  },

  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#000',
  },
  searchTextInput: {
    color: colors.black,
  },

  textItem: {
    flex: 1,
    fontSize: 20,
    color: '#000',
  },

  placeholderStyle: {
    fontSize: 20,
    color: colors.black,
  },

  selectedTextStyle: {
    fontSize: 20,
    color: '#000',
  },

  TextInputSearchStyle: {
    height: 40,
    fontSize: 20,
    color: '#000',
  },

  button: {
    backgroundColor: '#F28154',
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 12,
  },
  buttonText: {
    fontSize: 20,
    padding: 10,
    textAlign: 'center',
    fontWeight: '900',
    color: '#ffffff',
  },
  itemTextStyle: {
    color: colors.black,
  },
  uploadcontianerheadtext: {
    color: colors.black,
    fontSize: 18,
    margin: 5,
    textAlign: 'center',
  },
  uploadcontainersubheadtext: {
    color: colors.orange,
    margin: 5,
  },
  browsebox: {
    borderWidth: 1,
    flexDirection: 'row',
    borderRadius: 10,
  },
  browsebutton: {
    flex: 0.4,

    alignItems: 'center',
    justifyContent: 'center',
  },
  browseInputBox: {
    flex: 1,
    color: colors.black,
  },
  uploadcontainerText: {
    fontSize: 15,
    color: colors.black,
  },
  bottomcontainer: {
    margin: 8,
  },
  bottomshowcontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  showcontainerimage: {
    position: 'relative',
    margin: 10,
  },
  showcontainerimagestyle: {
    width: 60,
    height: 60,
  },
  deleteButtonImage: {
    position: 'absolute',
    top: -4,
    right: -6,
  },
  crossmark: {
    backgroundColor: colors.danger,
    width: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
});
