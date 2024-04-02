import axios from 'axios';
import { BASE_URL, GET_CITIES, GET_COMMUNITIES, GET_HOME_PAGE_DATA, GET_PARTNER, GET_STATES, GET_SUBCASTES, GET_USER_COMMUNITY_BY_ID, LOGIN_API } from './staticUrls';

export const LoginApi = async (mobile, password) => {
    const url = `${BASE_URL}${LOGIN_API}`;
    const bodyData = {
      mobile: mobile,
      password: password
    };
    return axios.post(url, bodyData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error("HEYYYYYYY1"+error);
        throw error;
      });
  
  };

 export const getCommunitybyUserid = async (id, token) => {
    return axios.get(`${BASE_URL}${GET_USER_COMMUNITY_BY_ID}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
      data: {
        id: id, 
      },
    })
      .then(response => {
        return response.data;
      }) 
      .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
      });
  };

  export const getCommunities = async () => {
    return axios.get(`${BASE_URL}${GET_COMMUNITIES}`)
      .then(response => {
       
        return response.data;
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
      });
  };

  export const getHomePageData = async () => {
    return axios.get(`${BASE_URL}${GET_HOME_PAGE_DATA}`)
      .then(response => {
        // console.log("HWWWHWWHS"+JSON.stringify(response.data));
        return response.data.data;
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
      });
  };
  
  export const getState = async(token)=>{
    return axios.get(`${BASE_URL}${GET_STATES}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      }
    })
      .then(response => {
      
        return response.data;
      }) 
      .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
      });
  }
 
  export const getCities = async(token, stateId)=>{
    return axios.get(`${BASE_URL}${GET_CITIES}${stateId}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      }
    })
      .then(response => {
   
        return response.data;
      }) 
      .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
      });
  }

  export const getCastes = async(token)=>{
    return axios.get(`${BASE_URL}${GET_SUBCASTES}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      }
    })
      .then(response => {

        return response.data;
      }) 
      .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
      });
  }

  export const getPartner = async (token, community_id, page) => {
    try {
      const response = await axios.get(`${BASE_URL}${GET_PARTNER}`, {
        params: {
          community_id: community_id,
          q: '',
          page: page,
          size: 20,
          state: '',
          city: '',
          gender: '',
          gotra: '',
          cast: '',
          subcastId: ''
        },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log(response)
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  export const searchPartner = async (token, community_id, page, text) => {
    try {
      console.log(page);
      const response = await axios.get(`${BASE_URL}${GET_PARTNER}`, {
        params: {
          q: text,
          community_id: community_id,
          page: page,
          size: 20,
          state: '',
          city: '',
          gender: '',
          gotra: '',
          cast: '',
          subcastId: ''
        },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };
  
  export const getPartnermatrimonial = async (token, text ,page , community_id ,state,city,gender,gotra,cast,subcastId) => {
    try {
      console.log(page, state)
      const response = await axios.get(`${BASE_URL}${GET_PARTNER}`, {
        params: {
          q: text,
          page: page,
          size: 20,
          community_id: community_id,
          state: state,
          city: city,
          gender: gender,
          gotra: gotra,
          cast: cast,
          subcastId: subcastId
        },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
       console.log(response);
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

