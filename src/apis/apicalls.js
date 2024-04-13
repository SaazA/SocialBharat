import axios from 'axios';
import { BASE_URL, CREATE_SERVICE, GET_BUSINESSES, GET_CHAT, GET_CHAT_MATRIMONIAL, GET_CITIES, GET_COMMUNITIES, GET_HOME_PAGE_DATA, GET_MEMBERS, GET_PARTNER, GET_PROFILE, GET_SERVICE_ON_SEARCH, GET_SERVICE_REGISTERED_BY_USER, GET_STATES, GET_SUBCASTES, GET_USER_COMMUNITY_BY_ID, GET_USER_SERVICES, LOGIN_API, SEND_MESSAGE_MATRIMONIAL } from './staticUrls';

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
       console.log(JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };
  export const getChatMatrimonial = async(token , id ,messages)=>{
    return axios.get(`${BASE_URL}${GET_CHAT_MATRIMONIAL}/${id}/${messages}` ,{
      headers:{
        Authorization:`Bearer ${token}`,
      }
    })
    .then(response =>{
      return response.data;
    })
    .catch(error=>{
      console.error('Error fetching data:', error);
      throw error
    })
  }


  export const getProfile = async(token ,id)=>{
    return axios.get(`${BASE_URL}${GET_PROFILE}/${id}`, {
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

  export const getBusiness = async(token , text ,state,city)=>{
    return axios.get(`${BASE_URL}${GET_BUSINESSES}`,{
      params:{
        q:text,
        state:state,
        city:city
      },
      headers:{
        Authorization:`Bearer ${token}`,
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

  export const sendTextMatrimonial = (token, receiver_id, message) => {
    return new Promise((resolve, reject) => {
      axios.post(
        `${BASE_URL}${SEND_MESSAGE_MATRIMONIAL}`,
        {
          receiver_id: receiver_id,
          message: message
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        reject(error);
      });
    });
  };
  

  export const getMembers = async(token , text ,page,state,city)=>{
    return axios.get(`${BASE_URL}${GET_MEMBERS}`,{
      params:{
        q:text,
        page:page,
        size:20,
        state:state,
        city:city
      },
      headers:{
        Authorization:`Bearer ${token}`,
      }
    })
    .then(response => {
      return response;
    }) 
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
  }


  export const getUserServices = (token) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${BASE_URL}${GET_USER_SERVICES}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          reject(error);
        });
    });
  };
  

  export const createUserService = (token, city, description, experience, mobile1, mobile2, state, status, title) => {
    const bodyData = {
      city: city,
      description: description,
      experience: experience,
      mobile1: mobile1,
      mobile2: mobile2,
      state: state,
      status: status,
      title: title,
    };
  
    return new Promise((resolve, reject) => {
      axios
        .post(`${BASE_URL}${CREATE_SERVICE}`, bodyData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          reject(error);
        });
    });
  };
  

  export const getSpecificService = async(token,role,text,state,city,page,title)=>{
    return axios.get(`${BASE_URL}${GET_SERVICE_ON_SEARCH}`,{
      params:{
        role:role,
        searchQuery:text,
        state:state,
        city:city,
        page:page,
        size:200,
        title:title
      },
      headers:{
        Authorization:`Bearer ${token}`,
      }
    })
    .then(response => {
      return response;
    }) 
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
  }

  export const getServicesRegisteredByUser = (token) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${BASE_URL}${GET_SERVICE_REGISTERED_BY_USER}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          reject(error);
        });
    });
  };
