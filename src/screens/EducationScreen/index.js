import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import colors from '../../constants/colors';
import {Dropdown} from 'react-native-element-dropdown';
import {useSelector} from 'react-redux';
import {getDegrees, UpdateEducationDetails} from '../../apis/apicalls';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {TextInput} from 'react-native';
import routes from '../../constants/routes';

const EducationUpdate = ({navigation}) => {
  const token = useSelector(state => state.AuthReducer.authToken);
  const [degreeData, setDegreeData] = useState();

  const [dataLoadedforDegree, setDataLoadedForDegree] = useState(false);
  const [fieldOfStudy, setFieldOfStudy] = useState();
  const [university, setUniversity] = useState();
  const [passingYear, setPassingYear] = useState();
  const [score, setScore] = useState();
  const [selectedDegree, setSelectedDegree] = useState();
  const [selectedDegreeId, setSelectedDegreeId] = useState();
  const [dataLoadedforScore, setDataLoadedForScore] = useState(false);
  const [selectedScore, setSelectedScore] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);

  const [highestQualification, setHighestQualification] = useState('');

  const getdegree = () => {
    setApiFailed(false);

    getDegrees(token)
      .then(response => {
        console.log(response.data);
        setDegreeData(response.data.degrees);
      })
      .catch(error => {
        // console.log(error);
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        setApiFailed(true);
        // const {message, errors} = error.response.data;
        // console.log(message);
        // console.log(errors);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getdegree();
    setRefreshing(false);
  }, []);

  const UpdateEducation = (
    degree_id,
    field_of_study,
    highest_qualification,
    institution_name,
    passing_year,
    score,
    score_type,
  ) => {
    UpdateEducationDetails(
      token,
      degree_id,
      field_of_study,
      highest_qualification,
      institution_name,
      passing_year,
      score,
      score_type,
    )
      .then(response => {
        console.log(response.data);
        Alert.alert('Education Updated');
        handleNav();
      })
      .catch(error => {
        const errorMessage = error.message || 'An unexpected error occurred';

        // Show the error message in a toast
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        // const {message, errors} = error.response.data;
        // console.log(message);
        // console.log(errors);
      });
  };

  const handleNav = () => {
    navigation.navigate(routes.PROFILESCREEN);
  };

  const handleSubmit = () => {
    // Initialize an array to store error messages for each field
    const errors = [];

    console.log(
      selectedDegreeId,
      fieldOfStudy,
      highestQualification,
      university,
      passingYear,
      score,
      selectedScore,
    );
    // Perform validations for each field
    if (
      !selectedDegreeId ||
      !fieldOfStudy ||
      !university ||
      !passingYear ||
      !score ||
      !selectedScore
    ) {
      errors.push('Please Fill out all the Mandatory Details');
    }
    if (errors.length > 0) {
      const errorMessage = errors.join('\n'); // Join error messages with newline character
      Alert.alert(errorMessage);
      return;
    }

    UpdateEducation(
      selectedDegreeId,
      fieldOfStudy,
      highestQualification,
      university,
      passingYear,
      score,
      selectedScore,
    );
    // All fields are filled, proceed with form submission
  };

  const degreeDropDownOptions = degreeData
    ? degreeData.map(degree => ({
        label: degree.title,
        value: degree.id.toString(),
      }))
    : [];
  const handleDegreeDropDown = selectedItem => {
    handleDegreeIdAndName(selectedItem);
    console.log(selectedItem);
    setDataLoadedForDegree(true);
  };

  const handleClearDegreeDropdown = () => {
    setSelectedDegree(null);

    setDataLoadedForDegree(false);
  };
  const handleDegreeIdAndName = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = degreeData.find(
      degree => degree.id === selectedId,
    )?.title;
    setSelectedDegreeId(selectedId);
    setSelectedDegree(selectedItem);
  };

  useEffect(() => {
    getdegree();
  }, []);

  const ScroretypeOptions = [
    {label: 'PERCENTAGE', value: 'PERCENTAGE'},
    {label: 'GRADE', value: 'GRADE'},
  ];

  //   const scoreDropDownOptions = degreeData
  //     ? degreeData.map(degree => ({
  //         label: degree.title,
  //         value: degree.id.toString(),
  //       }))
  //     : [];
  const handleScoreDropDown = selectedItem => {
    handleScoreIdAndName(selectedItem);
    console.log(selectedItem);
    setDataLoadedForScore(true);
  };

  const handleClearScoreDropdown = () => {
    setSelectedScore(null);
    setDataLoadedForScore(false);
  };
  const handleScoreIdAndName = selectedItem => {
    const selectedId = selectedItem.value;
    const selectedName = ScroretypeOptions.find(
      Scoretype => Scoretype.label === selectedId,
    )?.label;
    setSelectedScore(selectedName);
  };

  return (
    <ScrollView
      style={styles.maincontainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {degreeData && !apiFailed ? (
        <View style={styles.innercontainer}>
          <View style={styles.headingcontainer}>
            <Text style={styles.headingtext}>Add Education Info</Text>
          </View>
          <View style={styles.contentcontainer}>
            <Text style={styles.textheaddropdown}>
              Select Degree <Text style={{color: colors.danger}}>*</Text>
            </Text>
            <Dropdown
              style={styles.dropdown}
              data={degreeDropDownOptions}
              search
              inputSearchStyle={styles.searchTextInput}
              itemTextStyle={styles.itemTextStyle}
              placeholderStyle={styles.placeholderStyle}
              searchPlaceholder="Search"
              selectedTextStyle={styles.selectedTextStyle}
              value={selectedDegree}
              placeholder="--Select--"
              labelField="label"
              valueField="value"
              onChange={handleDegreeDropDown}
              renderRightIcon={() => {
                if (dataLoadedforDegree && selectedDegree !== null) {
                  return (
                    <FontAwesome5
                      name="trash"
                      color={colors.orange}
                      size={20}
                      onPress={handleClearDegreeDropdown}
                    />
                  );
                } else {
                  return (
                    <FontAwesome5
                      name="caret-down"
                      color={'#ffc107'}
                      size={28}
                    />
                  );
                }
              }}
            />

            <View style={styles.inputcontainerwithlabel}>
              <Text style={styles.labeltext}>
                Field of Study <Text style={{color: colors.danger}}>*</Text>
              </Text>
              <TextInput
                style={styles.inputBox}
                onChangeText={text => setFieldOfStudy(text)}
                placeholder="Field Of Study"
                placeholderTextColor={colors.black}
              />
            </View>

            <View style={styles.inputcontainerwithlabel}>
              <Text style={styles.labeltext}>
                University/Institution{' '}
                <Text style={{color: colors.danger}}>*</Text>
              </Text>
              <TextInput
                style={styles.inputBox}
                onChangeText={text => setUniversity(text)}
                placeholder="Enter University"
                placeholderTextColor={colors.black}
              />
            </View>
            <View style={styles.inputcontainerwithlabel}>
              <Text style={styles.labeltext}>
                Passing Year <Text style={{color: colors.danger}}>*</Text>
              </Text>
              <TextInput
                style={styles.inputBox}
                onChangeText={text => setPassingYear(text)}
                placeholder="Enter Year"
                placeholderTextColor={colors.black}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.dropdownoutsidecontainer}>
              <Text style={styles.textheaddropdown}>
                Select Score <Text style={{color: colors.danger}}>*</Text>
              </Text>
              <Dropdown
                style={styles.dropdown}
                data={ScroretypeOptions}
                search
                inputSearchStyle={styles.searchTextInput}
                itemTextStyle={styles.itemTextStyle}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                value={selectedScore}
                placeholder="--Select--"
                labelField="label"
                valueField="value"
                onChange={handleScoreDropDown}
                renderRightIcon={() => {
                  if (dataLoadedforScore && selectedScore !== null) {
                    return (
                      <FontAwesome5
                        name="trash"
                        color={colors.orange}
                        size={20}
                        onPress={handleClearScoreDropdown}
                      />
                    );
                  } else {
                    return (
                      <FontAwesome5
                        name="caret-down"
                        color={'#ffc107'}
                        size={28}
                      />
                    );
                  }
                }}
              />
            </View>
            <View style={styles.inputcontainerwithlabel}>
              <Text style={styles.labeltext}>
                Score <Text style={{color: colors.danger}}>*</Text>
              </Text>
              <TextInput
                style={styles.inputBox}
                onChangeText={text => setScore(text)}
                keyboardType="decimal-pad"
                placeholder="Enter Score"
                placeholderTextColor={colors.black}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.submitcontainer}
            onPress={handleSubmit}>
            <Text style={styles.submittext}>Submit</Text>
          </TouchableOpacity>
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
};

export default EducationUpdate;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
  },
  innercontainer: {
    margin: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.grayLight,
    padding: 5,
  },
  headingcontainer: {
    backgroundColor: colors.gray,
    height: 40,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingtext: {
    fontSize: 22,
    color: colors.white,
  },
  contentcontainer: {
    marginTop: 10,
    padding: 5,
  },
  dropdown: {
    margin: 10,
    height: 50,
    borderBottomColor: colors.black,
    borderBottomWidth: 0.5,
  },

  textheaddropdown: {
    fontSize: 16,
    backgroundColor: colors.bgcolorSign_up_in,
    borderRadius: 120,
    color: colors.black,
    textAlign: 'center',
  },
  searchTextInput: {
    color: colors.black,
  },
  placeholderStyle: {
    fontSize: 16,
    color: colors.black,
  },
  selectedTextStyle: {
    fontSize: 14,

    color: colors.black,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  itemTextStyle: {
    color: colors.black,
    fontSize: 16,
  },
  inputcontainerwithlabel: {
    marginTop: 10,
    margin: 5,
  },
  labeltext: {
    marginLeft: 10,
    fontSize: 15,
    color: colors.black,
  },
  inputBox: {
    height: 50,
    borderWidth: 2,
    color: colors.black,
    padding: 10,
    borderRadius: 15,
  },
  submitcontainer: {
    backgroundColor: colors.primary,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  submittext: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '500',
  },
  dropdownoutsidecontainer: {
    marginTop: 10,
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
