import axios from 'axios';
import { BASE_URL, GET_COMMUNITIES, GET_HOME_PAGE_DATA, GET_USER_COMMUNITY_BY_ID, LOGIN_API } from './urls';

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
        console.log(response.data);
        return response.data;
      })
      .catch(error => {
        console.error(error);
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
        console.log(response.data);
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
        console.log(response.data);
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
        console.log("HWWWHWWHS"+response.data);
        return response;
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
      });
  };
  
 
