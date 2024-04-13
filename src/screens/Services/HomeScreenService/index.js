import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';

import { createUserService, getCities, getState, getUserServices} from '../../../apis/apicalls';
import {useSelector} from 'react-redux';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Dropdown} from 'react-native-element-dropdown';
import colors from '../../../constants/colors';

export default function Services({navigation}) {
  const token = useSelector(state => state.AuthReducer.authToken);
  const [serviceData, setServiceData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCityIdandName, setSelectedCityIdandName] = useState(null);
  const [dataLoadedforState, setDataLoadedforState] = useState(false);
  const [selectedStateIdandName, setSelectedStateIdandName] = useState(null);
  const [dataLoadedforCity, setDataLoadedforCity] = useState(false);
  const [stateData, setStateData] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [selectedService, setSelectedService] = useState('');
  const [dataLoadedforService, setDataLoadedforService] = useState(null);
  const [selectedServiceIdandName, setSelectedServiceIdandName] = useState(null);
  const [status,setStatus] = useState('Active');
  const [mobileOne, setMobileOne] = useState('');
  const [mobiletwo, setMobileTwo] = useState('');
  const [experience, setExperience] = useState('');
  const [description, setDescription] = useState('');
  const getServies = () => {
    getUserServices(token)
      .then(response => {
        console.log('Messages' + JSON.stringify(response.data));
        setServiceData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };
  const ServiceDropdownOptions = serviceData
  ? serviceData.map(service => ({
      label: service.title,
      value: service.id // Assuming `id` is the value you want
    }))
  : [];



  const handleServiceDropDown = selectedItem => {
    setSelectedServiceIdandName(selectedItem);
    handleServiceIdandName(selectedItem);
    console.log(selectedItem);
    setDataLoadedforService(true);
  };

  const handleClearServiceDropDown = () => {
    setSelectedService(null);
    setSelectedServiceIdandName(null);
    setDataLoadedforService(false);
  };
  const handleServiceIdandName = selectedItem => {
    const selectedName = selectedItem.label;
    setSelectedService(selectedName);
    console.log("title: " + selectedName);
  };
  

  const searchTextInput = () => {
    if (serviceData) {
      const filteredData = serviceData.filter(service =>
        service.title.toLowerCase().includes(searchText.toLowerCase()),
      );
      return filteredData;
    }
    return [];
  };

  useEffect(() => {
    getServies();
  }, []);

  const getStateData = () => {
    getState(token)
      .then(response => {
        console.log('States' + response.data);
        setStateData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getCitiesData = stateId => {
      getCities(token, stateId)
        .then(response => {
          console.log('Cities' + response.data);
          setCityData(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    } 
  
  const cityDropDownOptions = cityData
    ? cityData.map(city => ({
        label: city.name,
        value: city.id.toString(),
      }))
    : [];
  const handleCityDropDown = selectedItem => {
    setSelectedCityIdandName(selectedItem);
    handleCityIdAndName(selectedItem);
    console.log(selectedItem);
    setDataLoadedforCity(true);
  };
  
  const handleCityIdAndName = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = cityData.find(city => city.id === selectedId)?.name;
    setSelectedCity(selectedName);
  };
  const handleClearCityDropdown = () => {
    setSelectedCity(null);
    setSelectedCityIdandName(null);
    setDataLoadedforCity(false);
  };

  const handleStateDropdown = selectedItem => {
    setSelectedStateIdandName(selectedItem);
    handleSelectedStates(selectedItem);
  };

  const handleClearStateDropdown = () => {
    setSelectedState(null);
    setSelectedStateIdandName(null);
    setDataLoadedforState(false);
    setCityData(null);
    handleClearCityDropdown();
  };
  const handleSelectedStates = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = stateData.find(state => state.id === selectedId)?.name;
    setSelectedState(selectedName);
    console.log('Selected Name:', selectedName);
    console.log('Selected ID:', selectedId);
    getCitiesData(selectedId);
    setDataLoadedforState(true);
  };

  const statedropdownOptions = stateData
    ? stateData.map(state => ({
        label: state.name,
        value: state.id.toString(),
      }))
    : [];

  useEffect(() => {
    getStateData();
  }, []);


  const CreateService = (selectedCity,description,experience,mobile1,mobile2,state,status,title) => {
    console.log("EVERYTHING " + token+" "+selectedCity+" "+description+" "+experience+" "+mobile1+" "+mobile2+" "+state+" "+status +" "+title)
    createUserService(token,selectedCity,description,experience,mobile1,mobile2,state,status,title)
      .then(response => {
        console.log('Messages' + JSON.stringify(response));
        Alert.alert('Service Created')
        handleClearStateDropdown();
        handleClearServiceDropDown();

      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleUserBasedOnService =(title,id)=>{
    navigation.navigate('ViewSpecificService',{
      title:title,
      id:id
    })
  };
  const handleNavToRegisteredServices = ()=>{
    navigation.navigate('RegisteredServicesByUser')
  }
  return (
    <ScrollView>
      <View>
        <TextInput
          onChangeText={text => setSearchText(text)}
          value={searchText}></TextInput>
          <TouchableOpacity onPress={()=>{
            handleNavToRegisteredServices()
          }}><Text style={{color:colors.black}}>Registered Services</Text></TouchableOpacity>

        {searchTextInput().map(service => (
          <View key={service.id}>
            <TouchableOpacity onPress={()=>{handleUserBasedOnService(service.title , service.id)}}>
            <Text>{service.title}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View>
        <View>
          <TextInput style={{borderWidth:1, margin:10, color:colors.black}}onChangeText={text => setMobileOne(text)} value={mobileOne}></TextInput>
          <TextInput style={{borderWidth:1, margin:10, color:colors.black}}onChangeText={text => setMobileTwo(text)} value={mobiletwo}></TextInput>
          <TextInput style={{borderWidth:1, margin:10, color:colors.black}}onChangeText={text => setExperience(text)} value={experience}></TextInput>
          <TextInput style={{borderWidth:1, margin:10, color:colors.black}}onChangeText={text => setDescription(text)} value={description}></TextInput>

          <TouchableOpacity onPress={()=>{ 
             setMobileOne('');
             setMobileTwo('');
             setExperience('');
             setDescription('');
             CreateService(selectedCity,description,experience,mobileOne,mobiletwo,selectedState,status,selectedService)}}>
            <Text>SUBMIT</Text>
          </TouchableOpacity>



          <Dropdown
          style={styles.dropdown}
          data={ServiceDropdownOptions}
          search
          itemTextStyle={styles.itemTextStyle}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          value={selectedServiceIdandName}
          placeholder="--Select state--"
          labelField="label"
          valueField="value"
          onChange={handleServiceDropDown}
          renderRightIcon={() => {
            if (dataLoadedforService && selectedService !== null) {
              return (
                <FontAwesome5
                  name="trash"
                  color={colors.orange}
                  size={20}
                  onPress={handleClearServiceDropDown}
                />
              );
            } else {
              return (
                <FontAwesome5
                  name="caret-down"
                  color={colors.blue}
                  size={28}
                />
              );
            }
          }}
        />
          
        </View>
        {stateData && (
          <Dropdown
          style={styles.dropdown}
          data={statedropdownOptions}
          search
          itemTextStyle={styles.itemTextStyle}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          value={selectedStateIdandName}
          placeholder="--Select state--"
          labelField="label"
          valueField="value"
          onChange={handleStateDropdown}
          renderRightIcon={() => {
            if (dataLoadedforState && selectedState !== null) {
              return (
                <FontAwesome5
                  name="trash"
                  color={colors.orange}
                  size={20}
                  onPress={handleClearStateDropdown}
                />
              );
            } else {
              return (
                <FontAwesome5
                  name="caret-down"
                  color={colors.blue}
                  size={28}
                />
              );
            }
          }}
        />
        )}
        <Dropdown
          style={styles.dropdown}
          data={cityDropDownOptions}
          search
          itemTextStyle={styles.itemTextStyle}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          value={selectedCityIdandName}
          placeholder="--Select city--"
          labelField="label"
          valueField="value"
          onChange={handleCityDropDown}
          renderRightIcon={() => {
            if (dataLoadedforCity && selectedCity !== null) {
              return (
                <FontAwesome5
                  name="trash"
                  color={colors.orange}
                  size={20}
                  onPress={handleClearCityDropdown}
                />
              );
            } else {
              return (
                <FontAwesome5 name="caret-down" color={colors.blue} size={28} />
              );
            }
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  placeholderStyle: {
    fontSize: 16,
    color: colors.black,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: colors.black,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  itemTextStyle: {
    color: colors.black,
    fontSize: 18,
  },
  dropdownoutsidecontainer: {
    marginTop: 10,
    backgroundColor: colors.white,
    elevation: 25,
    borderRadius: 15,
  },
});
