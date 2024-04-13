import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {useEffect} from 'react';
import colors from '../../constants/colors';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {getBusiness, getCities, getState} from '../../apis/apicalls';
import {useSelector} from 'react-redux';
import {Dropdown} from 'react-native-element-dropdown';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function Business() {
  const token = useSelector(state => state.AuthReducer.authToken);
  const [searchText, setSearchText] = useState('');
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCityIdandName, setSelectedCityIdandName] = useState(null);
  const [dataLoadedforState, setDataLoadedforState] = useState(false);
  const [selectedStateIdandName, setSelectedStateIdandName] = useState(null);
  const [dataLoadedforCity, setDataLoadedforCity] = useState(false);
  const [stateData, setStateData] = useState(null);
  const [cityData, setCityData] = useState(null);

  const getBusinessData = () => {
    getBusiness(token, searchText, selectedState, selectedCity)
      .then(response => {
        console.log('Business Data' + JSON.stringify(response.data));
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
    getBusinessData();
  });

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
    try {
      getCities(token, stateId)
        .then(response => {
          console.log('Cities' + response.data);
          setCityData(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };
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

  const handleClearCityDropdown = () => {
    setSelectedCity(null);
    setSelectedCityIdandName(null);
    setDataLoadedforCity(false);
  };
  const handleCityIdAndName = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = cityData.find(city => city.id === selectedId)?.name;
    setSelectedCity(selectedName);
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
  };
  const handleSelectedStates = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = stateData.find(
      state => state.id === selectedId,
    )?.name;
    setSelectedState(selectedName);
    console.log('Selected Name:', selectedName);
    console.log('Selected ID:', selectedId);
    getCitiesData(selectedId);
    setDataLoadedforState(true);
    getBusinessData(token,searchText,selectedState,selectedCity)
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
  return (
    <ScrollView>
      <View>
        <View>
          <TextInput
            style={{borderWidth: 1}}
            onChangeText={text => {
              setSearchText(text);
            }}></TextInput>
        </View>
        <View></View>
        <View>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  maincontaier: {
    backgroundColor: colors.RegisterandLoginButton,
    padding: 15,
  },
});
