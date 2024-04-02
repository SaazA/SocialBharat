import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../constants/colors';
import {Dropdown} from 'react-native-element-dropdown';
import {
  getCastes,
  getCities,
  getPartner,
  getPartnermatrimonial,
  getState,
  searchPartner,
} from '../../apis/apicalls';
import {useSelector} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function Matrimonial({navigation}) {
  const token = useSelector(state => state.AuthReducer.authToken);
  const userInfo = useSelector(state => state.UserReducer.userData);
  const community_id = userInfo.data.community_id;
  const [stateData, setStateData] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [gender, setGender] = useState(null);
  const [selectedStateIdandName, setSelectedStateIdandName] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCityIdandName, setSelectedCityIdandName] = useState(null);
  const [subCastes, setSubCastes] = useState(null);
  const [gotra, setGotra] = useState(null);
  const [slectedCasteidAndName, setSlectedCasteidAndName] = useState(null);
  const [slectedCaste, setSlectedCaste] = useState(null);
  const [slectedSubCasteId, setSelectedSubCasteId] = useState(null);
  const [partnerData, setPartnerData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataLoadedforgender, setDataLoadedforgender] = useState(false);
  const [dataLoadedforState, setDataLoadedforState] = useState(false);
  const [dataLoadedforCity, setDataLoadedforCity] = useState(false);
  const [dataLoadedforCaste, setDataLoadedforCaste] = useState(false);

  //  const searchPartnerMatrimonial = (page, text) => {
  //   try {
  //     if (text.trim() !== "") {
  //       // Only make the search API call if text is provided
  //       searchPartner(token, community_id, page, text)
  //         .then((response) => {
  //           setSearchData(response.data.users);
  //           setTotalrecords(response.data.totalFilteredRecords);
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     } else {
  //       // If no text is provided, clear the search data
  //       setSearchData([]);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const getpartnersmatrimonial = (page) => {
  //   try {
  //     getPartner(token, community_id, page)
  //       .then((response) => {
  //         // console.log(response.data);
  //         const newData = response.data.users.map((user) => ({
  //           ...user,
  //           key: user.id.toString()
  //         }));
  //         setPartnerData((prevData) => [...prevData, ...newData]);
  //         setTotalrecords(response.data.totalFilteredRecords);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getpartnersmatrimonial = (
    text,
    page,
    state,
    city,
    gender,
    gotra,
    cast,
    subcastId,
  ) => {
    try {
      getPartnermatrimonial(
        token,
        text,
        page,
        community_id,
        state,
        city,
        gender,
        gotra,
        cast,
        subcastId,
      )
        .then(response => {
          setPartnerData(prevData => {
            const newData = {...prevData};
            response.data.users.forEach(user => {
              newData[user.id] = user;
            });
            return newData;
          });
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getpartnersmatrimonial(
      searchText,
      1,
      selectedState,
      selectedCity,
      gender,
      gotra,
      '',
      slectedSubCasteId,
    );
  }, [
    searchText,
    currentPage,
    selectedState,
    selectedCity,
    gender,
    gotra,
    slectedSubCasteId,
  ]);

  const handleScroll = event => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const paddingToBottom = 20;
    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    ) {
      // Use the updated currentPage value directly
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      getpartnersmatrimonial(
        searchText,
        nextPage, // Use nextPage here
        selectedState,
        selectedCity,
        gender,
        gotra,
        '',
        slectedSubCasteId,
      );
    }
  };

  const genderoptions = [
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
    {label: 'other', value: ''},
  ];

  const handleGenderDropDown = item => {
    setGender(item.value);
    setCurrentPage(1);
    setPartnerData([]);
    getpartnersmatrimonial(
      searchText,
      1,
      selectedState,
      selectedCity,
      item.value,
      gotra,
      slectedCaste,
      slectedSubCasteId,
    );
    setDataLoadedforgender(true);
  };
  const handleClearClickGender = () => {
    setGender(null);
    setDataLoadedforgender(false);
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
    setCurrentPage(1);
    setPartnerData([]);
    setSelectedCityIdandName(selectedItem);
    handleCityIdAndName(selectedItem);
  };

 const handleClearCityDropdown = ()=>{
  setSelectedCity(null);
  setSelectedCityIdandName(null);
  setDataLoadedforCity(false);
 }  
  const handleCityIdAndName = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = cityData.find(city => city.id === selectedId)?.name;
    setSelectedCity(selectedName);
    getpartnersmatrimonial(
      searchText,
      1,
      selectedState,
      selectedName,
      gender,
      gotra,
      '',
      slectedSubCasteId,
    );
    console.log('Selected Name:', selectedName);
    console.log('Selected ID:', selectedId);
    setDataLoadedforCity(true);
  };
  const getStateData = () => {
    try {
      getState(token)
        .then(response => {
          console.log('States' + response.data);
          setStateData(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handleStateDropdown = selectedItem => {
    setCurrentPage(1);
    setPartnerData([]);
    setSelectedStateIdandName(selectedItem);
    handlecountrydropdown(selectedItem);
  };

  const handleClearStateDropdown = () => {
    setSelectedState(null);
    setSelectedStateIdandName(null);
    setDataLoadedforState(false);
    setCityData(null)
  };
  const handlecountrydropdown = selectedItem => {
    const selectedId = parseInt(selectedItem.value);
    const selectedName = stateData.find(
      country => country.id === selectedId,
    )?.name;
    setSelectedState(selectedName);
    console.log('Selected Name:', selectedName);
    console.log('Selected ID:', selectedId);
    getpartnersmatrimonial(
      searchText,
      1,
      selectedName,
      selectedCity,
      gender,
      gotra,
      '',
      slectedSubCasteId,
    );
    getCitiesData(selectedId);
    setDataLoadedforState(true);
  };
  const countriesdropdownOptions = stateData
    ? stateData.map(state => ({
        label: state.name,
        value: state.id.toString(),
      }))
    : [];

    useEffect(() => {
      getStateData();
    }, []);
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
  setSlectedCasteidAndName(selectedItem);
  setCurrentPage(1);
  setPartnerData([]);
  handleSubcastes(selectedItem);
};
const handleSubcastes = selectedItem => {
  const selectedId = parseInt(selectedItem.value);
  const selectedName = subCastes.find(
    subCastes => subCastes.subcast_id === selectedId,
  )?.subcast;
  setSelectedSubCasteId(selectedId);
  setSlectedCaste(selectedName);
  getpartnersmatrimonial(
    searchText,
    1,
    selectedState,
    selectedCity,
    gender,
    gotra,
    '',
    selectedId,
  );
  console.log('Selected Name:', selectedName);
  console.log('Selected ID:', selectedId);
  setDataLoadedforCaste(true);
};
const handleClearCasteDropdown = () => {
  setDataLoadedforCaste(false);
  setSelectedSubCasteId(null);
  setSlectedCaste(null);
  setSlectedCasteidAndName(null);;
};
useEffect(() => {
  getSubCastesData();
}, []);



  return (
    <ScrollView onScroll={handleScroll}>
      <View style={styles.container}>
        {/* <TextInput
  style={{ borderWidth: 1, margin: 15 }}
  onChangeText={(text) => {
    setSearchText(text); // Update searchText state
    searchPartnerMatrimonial(currentPage, text); // Call searchPartnerMatrimonial function
  }}
/> */}

        <TextInput
          style={{borderWidth: 1, color: 'black'}}
          onChangeText={text => {
            setPartnerData([]);
            setSearchText(text);
            setCurrentPage(1);
            getpartnersmatrimonial(
              searchText,
              1,
              selectedState,
              selectedCity,
              gender,
              gotra,
              '',
              slectedSubCasteId,
            );
          }}
          value={searchText}
        />
        <Dropdown
          style={styles.dropdown}
          data={genderoptions}
          search // Enable search functionality
          itemTextStyle={styles.itemTextStyle}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          labelField="label"
          valueField="value"
          maxHeight={300}
          placeholder={'Select item'}
          searchPlaceholder="Search..."
          value={gender}
          onChange={handleGenderDropDown}
          renderRightIcon={() => {
            if (dataLoadedforgender && gender !== null) {
              return (
                <FontAwesome5
                  name="trash"
                  color={'blue'}
                  size={20}
                  onPress={handleClearClickGender}
                />
              );
            } else {
              return null; // Hide the broom icon initially
            }
          }}
        />
        {stateData && (
          <Dropdown
            style={styles.dropdown}
            data={countriesdropdownOptions}
            search
            itemTextStyle={styles.itemTextStyle}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            value={selectedStateIdandName}
            placeholder="Select item"
            labelField="label"
            valueField="value"
            onChange={handleStateDropdown}
            renderRightIcon={() => {
              if (dataLoadedforState && selectedState !== null) {
                // Show the broom icon only if data has been loaded and a gender is selected
                return (
                  <FontAwesome5
                    name="trash"
                    color={'blue'}
                    size={20}
                    onPress={handleClearStateDropdown}
                  />
                );
              } else {
                return null; // Hide the broom icon initially
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
          placeholder="Select item"
          labelField="label"
          valueField="value"
          onChange={handleCityDropDown}
          renderRightIcon={() => {
            if (dataLoadedforCity && selectedCity !== null) {
              // Show the broom icon only if data has been loaded and a gender is selected
              return (
                <FontAwesome5
                  name="trash"
                  color={'blue'}
                  size={20}
                  onPress={handleClearCityDropdown}
                />
              );
            } else {
              return null; // Hide the broom icon initially
            }
          }}
          
        />
        <Dropdown
          style={styles.dropdown}
          data={subCastesDropDownOption}
          search
          itemTextStyle={styles.itemTextStyle}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          value={slectedCasteidAndName}
          placeholder="Select item"
          labelField="label"
          valueField="value"
          onChange={handleSubcasteDropDown}
          renderRightIcon={() => {
            if (dataLoadedforCaste && slectedSubCasteId !== null) {
              return (
                <FontAwesome5
                  name="trash"
                  color={'blue'}
                  size={20}
                  onPress={handleClearCasteDropdown}
                />
              );
            } else {
              return null; // Hide the broom icon initially
            }
          }}
        />

        <TouchableOpacity
          style={{backgroundColor: 'red'}}
          onPress={() => navigation.navigate('AddMatrimonialScreen')}>
          <Text>ADD Matrimonial</Text>
        </TouchableOpacity>

        {/* {(searchData.length > 0 ? searchData : partnerData).map((item) => (
        <View key={item.id}>
          <Text style={{ backgroundColor: 'blue', color: 'black' }}>{item.name}</Text>
        </View>
      ))} */}

        {Object.keys(partnerData).length > 0 ? (
          Object.keys(partnerData).map(userId => (
            <View key={userId}>
              <Text style={{backgroundColor: 'blue', color: 'black'}}>
                {partnerData[userId].name}
              </Text>
            </View>
          ))
        ) : (
          <View>
            <Text>NO DATA AVAILABLE</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
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
  },
});
