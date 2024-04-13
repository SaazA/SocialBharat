import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../../constants/colors';
import {Dropdown} from 'react-native-element-dropdown';
import {ScrollView} from 'react-native';
import DatePicker from 'react-native-date-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {getCastes, getProfile} from '../../../apis/apicalls';
import {useSelector} from 'react-redux';
import DocumentPicker from 'react-native-document-picker';
import Slider from '@react-native-community/slider';

const AddMatrimonial = () => {
  const token = useSelector(state => state.AuthReducer.authToken);
  const [personalValue, setPersonalValue] = useState(null);
  const [dataLoadedforPersonalValue, setDataLoadedforPersonalValue] =
    useState(false);
  const [gender, setGender] = useState(null);
  const [dataLoadedforgender, setDataLoadedforgender] = useState(false);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [subCastes, setSubCastes] = useState(null);
  const [slectedCasteidAndName, setSlectedCasteidAndName] = useState(null);
  const [manglik, setManglik] = useState(null);
  const [sliderValueForFeet, setSliderValueForFeet] = useState(0);
  const [sliderValueForInches, setSliderValueForInches] = useState(0);


  // const getUserProfile = ()=>{
  //   getProfile(token)
  //       .then(response => {
  //         console.log('UserProfiles' + JSON.stringify(response.data));
  //       })
  //       .catch(error => {
  //         console.log(error);
  //       });
  // }

  // useEffect(()=>{
  //   getUserProfile()
  // },[])


  const ProfileCreatingOptions = [
    {label: 'Self', value: 'Self'},
    {label: 'Brother', value: 'brother'},
    {label: 'Sister', value: 'sister'},
    {label: 'Son', value: 'son'},
    {label: 'Daughter', value: 'daughter'},
  ];
  const handlePersonalValue = selectedItem => {
    setPersonalValue(selectedItem);
    handlePersonalValueDropdown(selectedItem);
    setDataLoadedforPersonalValue(true);
  };
  const handlePersonalValueDropdown = selectedItem => {
    console.log(selectedItem.label);
    console.log(selectedItem.value);
  };

  const handleClearPersonalValues = () => {
    setPersonalValue(null);
    setDataLoadedforPersonalValue(false);
  };

  const genderoptions = [
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
    {label: 'other', value: ''},
  ];
  const handleGenderValue = selectedItem => {
    setGender(selectedItem);
    handleGenderValueDropdown(selectedItem);
  };
  const handleGenderValueDropdown = selectedItem => {
    console.log(selectedItem.label);
    console.log(selectedItem.value);
  };

  const formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  const getSubCastesData = () => {
    try {
      getCastes(token)
        .then(response => {
          console.log('Subcastes' + response.data);
          setSubCastes(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const subCastesDropDownOption = subCastes
    ? subCastes.map(subCastes => ({
        label: subCastes.subcast,
        value: subCastes.subcast_id.toString(),
      }))
    : [];
  const handleSubcasteDropDown = selectedItem => {
    handleSubcastes(selectedItem);
    setSlectedCasteidAndName(selectedItem);
  };
  const handleSubcastes = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = subCastes.find(
      subCastes => subCastes.subcast_id === selectedId,
    )?.subcast;

    console.log('Selected Name:', selectedName);
    console.log('Selected ID:', selectedId);
  };

  useEffect(() => {
    getSubCastesData();
  }, []);

  const manglikOptions = [
    {label: 'Yes', value: 'yes'},
    {label: 'No', value: 'no'},
  ];
  const handleManglikValue = selectedItem => {
    setManglik(selectedItem);
    handleManglikDropdown(selectedItem);
  };
  const handleManglikDropdown = selectedItem => {
    console.log(selectedItem.label);
    console.log(selectedItem.value);
  };

  const handleSliderChangeforFeet = (value) => {
    const roundedValue = Math.round(value);
    setSliderValueForFeet(roundedValue);
  };
  const handleSliderChangeforInches = (value) => {
    const roundedValue = Math.round(value);
    setSliderValueForInches(roundedValue);
  };

  const mainHeight = `${sliderValueForFeet}.${sliderValueForInches} `

  const selectDoc = () => {
    return new Promise((resolve, reject) => {
      DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      })
        .then(doc => {
          resolve(doc);
          console.log(doc);
        })
        .catch(err => {
          if (DocumentPicker.isCancel(err)) {
            console.log(err);
          } else {
            console.log(err);
          }
        });
    });
  };
  const selectPhoto = () => {
    return new Promise((resolve, reject) => {
      DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        allowMultiSelection: true,
      })
        .then(doc => {
          resolve(doc);
          console.log(doc);
        })
        .catch(err => {
          if (DocumentPicker.isCancel(err)) {
            reject('Document picking cancelled.');
          } else {
            reject(err);
          }
        });
    });
  };
  return (
    <View style={styles.mainContainer}>
      <ScrollView>
        <View style={styles.headingcontainer}>
          <Text style={styles.mainheading}>Matrimonial Info</Text>
        </View>
        <View style={styles.formcontainer}>
          <View style={styles.dropdowncontainer}>
            <Text style={styles.dropdowntextLabel}>
              For Whom, You are creating profile
            </Text>
            <Dropdown
              style={styles.dropdown}
              data={ProfileCreatingOptions}
              itemTextStyle={styles.itemTextStyle}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              value={personalValue}
              placeholder="Select item"
              labelField="label"
              valueField="value"
              onChange={handlePersonalValue}
              renderRightIcon={() => {
                if (dataLoadedforPersonalValue && personalValue !== null) {
                  return (
                    <FontAwesome5
                      name="trash"
                      color={'blue'}
                      size={20}
                      onPress={handleClearPersonalValues}
                    />
                  );
                } else {
                  return null; // Hide the broom icon initially
                }
              }}
            />
          </View>
          <View style={styles.inputcontainerwithlabel}>
            <Text style={styles.labeltext}>Name</Text>
            <TextInput style={styles.inputBox}></TextInput>
          </View>
          <View style={styles.inputcontainerwithlabel}>
            <Text style={styles.labeltext}>Father's Name</Text>
            <TextInput style={styles.inputBox}></TextInput>
          </View>
          <View style={styles.inputcontainerwithlabel}>
            <Text style={styles.labeltext}>Mother's Name</Text>
            <TextInput style={styles.inputBox}></TextInput>
          </View>
          <View style={styles.dropdowncontainer}>
            <Text style={styles.dropdowntextLabel}>Gender</Text>
            <Dropdown
              style={styles.dropdown}
              data={genderoptions}
              itemTextStyle={styles.itemTextStyle}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              value={gender}
              placeholder="Select item"
              labelField="label"
              valueField="value"
              onChange={handleGenderValue}
            />
          </View>

          <View style={styles.inputcontainerwithlabel}>
            <Text style={styles.labeltext}>Date of Birth</Text>
            <View style={styles.calendarBox}>
              <TextInput
                style={styles.calendarBoxInput}
                value={formatDate(date)}
                editable={false}
              />
              <TouchableOpacity onPress={() => setOpen(true)}>
                <View style={styles.iconcontainer}>
                  <FontAwesome5 name="calendar" color={'blue'} size={26} />
                </View>
              </TouchableOpacity>
              <DatePicker
                modal
                mode="date"
                open={open}
                date={date}
                onConfirm={date => {
                  setOpen(false);
                  setDate(date);
                  console.log(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </View>
          </View>
          <View style={styles.dropdowncontainer}>
            <Text style={styles.dropdowntextLabel}>Subcast</Text>
            <Dropdown
              style={styles.dropdown}
              data={subCastesDropDownOption}
              itemTextStyle={styles.itemTextStyle}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              value={slectedCasteidAndName}
              placeholder="Select item"
              labelField="label"
              valueField="value"
              onChange={handleSubcasteDropDown}
            />
          </View>
          <View style={styles.inputcontainerwithlabel}>
            <Text style={styles.labeltext}>Paternal Gotra</Text>
            <TextInput style={styles.inputBox}></TextInput>
          </View>
          <View style={styles.inputcontainerwithlabel}>
            <Text style={styles.labeltext}>Maternal Gotra</Text>
            <TextInput style={styles.inputBox}></TextInput>
          </View>
          <View style={styles.dropdowncontainer}>
            <Text style={styles.dropdowntextLabel}>Manglik</Text>
            <Dropdown
              style={styles.dropdown}
              data={manglikOptions}
              itemTextStyle={styles.itemTextStyle}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              value={manglik}
              placeholder="Select item"
              labelField="label"
              valueField="value"
              onChange={handleManglikValue}
            />
          </View>
          <View style={styles.inputcontainerwithlabel}>
            <Text style={styles.labeltext}>Number of Brothers</Text>
            <TextInput style={styles.inputBox}></TextInput>
          </View>
          <View style={styles.inputcontainerwithlabel}>
            <Text style={styles.labeltext}>Number of Sister's</Text>
            <TextInput style={styles.inputBox}></TextInput>
          </View>
          <View style={styles.inputcontainerwithlabel}>
            <Text style={styles.labeltext}>Package</Text>
            <TextInput style={styles.inputBox}></TextInput>
          </View>
          <View style={styles.slidercontainer}>
      <Text style={styles.labeltextforSlider}>Height Measurement</Text>
      <View style={styles.mainslidercontainer}>
        <Text style={styles.slidercontainerheadtext}>Feet:</Text>
        <Slider
          minimumValue={0}
          maximumValue={15}
          value={sliderValueForFeet}
          onValueChange={handleSliderChangeforFeet}
          trackStyle={styles.track}
          thumbStyle={styles.thumb}
          minimumTrackTintColor={colors.orange}
          maximumTrackTintColor={colors.black}
        />
        <Text style={styles.sliderValuetext}>
          {sliderValueForFeet} Feet
        </Text>
        <Text style={styles.slidercontainerheadtext}>Inches:</Text>
        <Slider
          minimumValue={0}
          maximumValue={12}
          value={sliderValueForInches}
          onValueChange={handleSliderChangeforInches}
          trackStyle={styles.track}
          thumbStyle={styles.thumb}
          minimumTrackTintColor={colors.orange}
          maximumTrackTintColor={colors.black}
        />
        <Text style={styles.sliderValuetext}>
          {sliderValueForInches} Inches
        </Text>
      </View>
      <Text style={styles.givenslidervalue}>
        Height is{mainHeight}Feet
      </Text>
    </View>
        
          <View>
            <Text style={styles.uploadcontianerheadtext}>Proposal Photos</Text>
            <Text style={styles.uploadcontainersubheadtext}>Add atleast 2 and maximum 5 photos (should be in png,jpg,jgep,pdf format)</Text>
            <View style={styles.browsebox}>
                <View style={styles.browsebutton}>
                <TouchableOpacity onPress={selectPhoto}>
              <Text style={styles.uploadcontainerText}> Browse..</Text>
            </TouchableOpacity>
                </View>
                <View style={styles.browsetextcontainer}>
                <TextInput style={styles.browseInputBox}></TextInput>
                </View>
            </View>
            
          </View>
          <View>
            <Text style={styles.uploadcontianerheadtext}>BioData</Text>
            <Text style={styles.uploadcontainersubheadtext}>upload biodata in pdf format only</Text>
            <View style={styles.browsebox}>
                <View style={styles.browsebutton}>
                <TouchableOpacity onPress={selectDoc}>
              <Text style={styles.uploadcontainerText}> Browse..</Text>
            </TouchableOpacity>
                </View>
                <View style={styles.browsetextcontainer}>
                <TextInput style={styles.browseInputBox}></TextInput>
                </View>
            </View>
            
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    margin: 15,
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 15,
  },

  mainheading: {
    textAlign: 'center',
    color: colors.black,
    fontSize: 20,
  },
  headingcontainer: {
    margin: 10,
    backgroundColor: colors.grayLight,
    borderRadius: 50,
  },
  formcontainer: {
    marginTop: 20,
    flex: 1,
  },
  dropdowncontainer: {
    margin: 5,
  },
  dropdowntextLabel: {
    color: colors.black,
    marginLeft: 10,
    fontSize: 15,
  },
  dropdown: {
    borderRadius: 15,
    height: 50,
    borderWidth: 2,
  },
  placeholderStyle: {
    fontSize: 16,
    color: colors.black,
    margin: 5,
  },
  selectedTextStyle: {
    fontSize: 16,
    marginLeft: 5,
    color: colors.black,
  },
  itemTextStyle: {
    color: colors.black,
  },
  inputBox: {
    height: 50,
    borderWidth: 2,
    padding: 10,
    borderRadius: 15,
  },
  labeltext: {
    marginLeft: 10,
    fontSize: 15,
    color: colors.black,
  },
  inputcontainerwithlabel: {
    marginTop: 10,
    margin: 5,
  },
  calendarBox: {
    borderWidth: 2,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calendarBoxInput: {
    width: 200,
    fontSize: 15,
    marginLeft: 5,
    color: colors.black,
  },
  iconcontainer: {
    marginRight: 20,
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: colors.blue,
    borderColor: '#30a935',
    borderWidth: 2,
  },
  mainslidercontainer:{
    marginTop:20
  },
  slidercontainer: {
    margin: 10,
  },
  labeltextforSlider: {
    marginLeft: 10,
    fontSize: 20,
    color: colors.black,
    textAlign: 'center',
  },
  slidercontainerheadtext: {
    color: colors.gray,
    fontSize: 18,
  },
  sliderValuetext:{
    color:colors.black,
    fontSize: 20,
    textAlign:'center'
  },
  givenslidervalue:{
    color:colors.black,
    textAlign:'center',
    marginTop:15,
    fontSize:18
  },
  uploadcontianerheadtext:{
    color:colors.black,
    fontSize:15,
    margin:5
  },
  uploadcontainersubheadtext:{
    color:colors.orange
  },browsebox:{
    borderWidth:1,
    flexDirection:'row',
    margin:10,
  },
  browsebutton:{
    borderWidth:1,
    width:100,
    justifyContent:'center'
  },
  browseInputBox:{
    width:200,
  },
  uploadcontainerText:{
    fontSize:15,
    color:colors.black
  }
});

export default AddMatrimonial;
