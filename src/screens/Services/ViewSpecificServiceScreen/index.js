import { View, Text, StyleSheet , TextInput} from 'react-native'
import React, { useEffect, useState } from 'react'
import { getCities, getSpecificService, getState } from '../../../apis/apicalls';
import { useSelector } from 'react-redux';
import { Dropdown } from 'react-native-element-dropdown';
import colors from '../../../constants/colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


const ViewSpecificService = ({route}) => {
  const {title} = route.params;
  const {id} = route.params;
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCityIdandName, setSelectedCityIdandName] = useState(null);
  const [dataLoadedforState, setDataLoadedforState] = useState(false);
  const [selectedStateIdandName, setSelectedStateIdandName] = useState(null);
  const [dataLoadedforCity, setDataLoadedforCity] = useState(false);
  const [stateData, setStateData] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [serviceData, setServiceData] = useState('');
  const [roleset,selectedRole] = useState('user');
  const [searchText,setSearchText] = useState('');

const token = useSelector(state=>state.AuthReducer.authToken);

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
    getSpecificeServiceData(roleset,searchText,selectedState,selectedName,1,title)
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
    getSpecificeServiceData(roleset,searchText,selectedName,selectedCity,1,title)
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


  const getSpecificeServiceData =(role,searchQuerry,state,city,page,title)=>{
    getSpecificService(token,role,searchQuerry,state,city,page,title) 
    .then(response => {
      console.log('Service Data' + JSON.stringify(response));
      setServiceData(response.data);
    })
    .catch(error => {
      console.log(error);
    });
  }

useEffect(()=>{
getSpecificeServiceData(roleset,searchText,selectedState,selectedCity,1,title)
},[])


  return (
    <View>

<TextInput onChangeText={text=>{
  console.log(text);
  setServiceData([]);
        setSearchText(text);
        getSpecificeServiceData(roleset,text,selectedState,selectedCity,1,title)
      }}></TextInput>


      <Text>ViewSpecificService  , {title}</Text>

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
  )
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
})

export default ViewSpecificService