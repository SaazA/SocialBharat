import axios from 'axios';
import {
  ACTIVITY_POST,
  ATTEMPT_LOGIN,
  BASE_URL,
  CREATE_BUSINESS_DETAILS,
  CREATE_MATRIMONIAL_DETAILS,
  CREATE_SERVICE,
  DELETE_MATRIMONIAL_PROFILE,
  GET_ACTIVE_COMMUNITIES,
  GET_BUSINESSES,
  GET_CHAT_MATRIMONIAL,
  GET_CITIES,
  GET_COMMUNITIES,
  GET_DEGREES,
  GET_EVENT,
  GET_HOME_PAGE_DATA,
  GET_MEMBERS,
  GET_PARTNER,
  GET_PROFILE,
  GET_SELF_PROFILE_MATRIMONIAL,
  GET_SERVICE_ON_SEARCH,
  GET_SERVICE_REGISTERED_BY_USER,
  GET_STATES,
  GET_SUBCASTES,
  GET_USER_APPLIED_JOBS,
  GET_USER_COMMUNITY_BY_ID,
  GET_USER_SEARCH_JOBS,
  GET_USER_SERVICES,
  LOGIN_API,
  LOGIN_OTP,
  POST_FEEDBACK,
  POST_USER_JOB_APPLIED_DETAILS,
  REGISTER_VERIFY,
  SEARCH_EVENTS,
  SEARCH_USER_ACTIVITY,
  SEND_MESSAGE_MATRIMONIAL,
  SEND_OTP,
  UPDATE_CONTACT_DETAILS,
  UPDATE_EDUCATION_DETAILS,
  UPDATE_PASSWORD,
  UPDATE_PROFILE,
  UPLOAD_BIODATA_PDF,
  UPLOAD_MULTIPLE_IMAGES,
  UPLOAD_RESUME,
  UPLOAD_SINGLE_IMAGES,
  USER_CREATE_JOB,
} from './staticUrls';
import {ToastAndroid} from 'react-native';

// export const LoginApi = async (mobile, password) => {
//   const url = `${BASE_URL}${LOGIN_API}`;
//   const bodyData = {
//     mobile: mobile,
//     password: password,
//   };
//   return axios
//     .post(url, bodyData, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//     .then(response => {
//       return response.data;
//     })
//     .catch(error => {
//       // console.error('HEYYYYYYY1' + error);
//       throw error;
//     });
// };

export const LoginApi = (mobile, password) => {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${LOGIN_API}`;
    const bodyData = {
      mobile: mobile,
      password: password,
    };

    axios
      .post(url, bodyData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error); // Reject the promise with the error
      });
  });
};

export const LoginWithOTP = (mobile, otp) => {
  return new Promise((resolve, reject) => {
    const bodyData = {
      mobile: mobile,
      otp: otp,
    };
    axios
      .post(`${BASE_URL}${LOGIN_OTP}`, bodyData)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        // console.error('Error fetching data:', error);
        reject(error);
      });
  });
};

// export const getOTP = (name, mobile, community_id) => {
//   const bodyData = {
//     name: name,
//     mobile: mobile,
//     community_id: community_id,
//   };
//   console.log(bodyData);
//   return axios
//     .post(`${BASE_URL}${SEND_OTP}`, bodyData)
//     .then(response => {
//       return response.data;
//     })
//     .catch(error => {
//       // console.error('Error fetching data:', error);
//       // const {message, errors} = error;
//       // console.log('M', message);
//       // console.log(errors);
//       throw error;
//     });
// };

export const getOTP = (name, mobile, community_id) => {
  return new Promise((resolve, reject) => {
    const bodyData = {
      name: name,
      mobile: mobile,
      community_id: community_id,
    };
    console.log(bodyData);

    axios
      .post(`${BASE_URL}${SEND_OTP}`, bodyData)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error); // Reject the promise with the error
      });
  });
};

export const SendOTP = mobile => {
  return new Promise((resolve, reject) => {
    const bodyData = {
      mobile: mobile,
    };
    axios
      .post(`${BASE_URL}${ATTEMPT_LOGIN}`, bodyData)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        // console.error('Error fetching data:', error);
        reject(error);
      });
  });
};

export const RegisterVerify = (name, mobile, community_id, otp) => {
  return new Promise((resolve, reject) => {
    const bodyData = {
      name: name,
      mobile: mobile,
      community_id: community_id,
      otp: otp,
    };
    axios
      .post(`${BASE_URL}${REGISTER_VERIFY}`, bodyData)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        // console.error('Error fetching data:', error);
        reject(error);
      });
  });
};

export const UpdatePassword = (token, password, confirmPassword) => {
  return new Promise((resolve, reject) => {
    const BodyData = {
      password: password,
      confirmPassword: confirmPassword,
    };

    axios
      .put(`${BASE_URL}${UPDATE_PASSWORD}`, BodyData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        // console.error('Error fetching data:', error);
        reject(error);
      });
  });
};

// export const getCommunitybyid = async (id, token) => {
//   return axios
//     .get(`${BASE_URL}${GET_USER_COMMUNITY_BY_ID}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       data: {
//         id: id,
//       },
//     })
//     .then(response => {
//       return response.data;
//     })
//     .catch(error => {
//       console.error('Error fetching Community by Id data:', error);
//       throw error;
//     });
// };

export const getCommunitybyid = (id, token) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}${GET_USER_COMMUNITY_BY_ID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          id: id,
        },
      })
      .then(response => {
        if (response && response.data) {
          resolve(response.data);
        } else {
          reject(new Error('Unexpected response format'));
        }
      })
      .catch(error => {
        // console.error('Error fetching Community by Id data:', error);
        reject(error); // Reject the promise with the error
      });
  });
};

// export const getCommunities = async () => {
//   return axios
//     .get(`${BASE_URL}${GET_COMMUNITIES}`)
//     .then(response => {
//       return response.data;
//     })
//     .catch(error => {
//       console.error('Error fetching getCommunities data:', error);
//       throw error;
//     });
// };

export const getCommunities = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}${GET_COMMUNITIES}`)
      .then(response => {
        // Ensure response.data exists before resolving
        resolve(response.data);
      })
      .catch(error => {
        // console.error('Error fetching getCommunities data:', error);
        // Reject the promise with the error
        reject(error);
      });
  });
};

// export const getActiveCommunities = async () => {
//   return axios
//     .get(`${BASE_URL}${GET_ACTIVE_COMMUNITIES}`)
//     .then(response => {
//       return response.data;
//     })
//     .catch(error => {
//       console.error('Error fetching getActiveCommunities data:', error);
//       throw error;
//     });
// };

export const getActiveCommunities = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}${GET_ACTIVE_COMMUNITIES}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        // console.error('Error fetching getActiveCommunities data:', error);
        reject(error); // Reject the promise with the error
      });
  });
};

// export const getHomePageData = async () => {
//   return axios
//     .get(`${BASE_URL}${GET_HOME_PAGE_DATA}`)
//     .then(response => {
//       // console.log("HWWWHWWHS"+JSON.stringify(response.data));
//       return response.data.data;
//     })
//     .catch(error => {
//       console.error('Error fetching getHomePageData data:', error);
//       throw error;
//     });
// };

export const getHomePageData = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}${GET_HOME_PAGE_DATA}`)
      .then(response => {
        // Ensure response.data.data exists before resolving

        resolve(response.data.data);
      })
      .catch(error => {
        // console.error('Error fetching getHomePageData data:', error);
        // Reject the promise with the error
        reject(error);
      });
  });
};

// export const getState = async token => {
//   return axios
//     .get(`${BASE_URL}${GET_STATES}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then(response => {
//       return response.data;
//     })
//     .catch(error => {
//       // console.error('Error fetching data:', error);
//       // throw error;
//       const errorMessage = error.message || 'An unexpected error occurred';
//       // Show the error message in a toast
//       ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
//     });
// };

export const getState = token => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}${GET_STATES}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        const errorMessage = error.message || 'An unexpected error occurred';
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        reject(error); // Reject the promise with the error
      });
  });
};

// export const getCities = async (token, stateId) => {
//   return axios
//     .get(`${BASE_URL}${GET_CITIES}${stateId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then(response => {
//       return response.data;
//     })
//     .catch(error => {
//       // console.error('Error fetching data:', error);
//       // throw error;
//     });
// };

export const getCities = (token, stateId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}${GET_CITIES}${stateId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        const errorMessage = error.message || 'An unexpected error occurred';
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        reject(error); // Reject the promise with the error
      });
  });
};
// export const getCastes = async token => {
//   return axios
//     .get(`${BASE_URL}${GET_SUBCASTES}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then(response => {
//       return response.data;
//     })
//     .catch(error => {
//       // console.error('Error fetching data:', error);
//       // throw error;
//     });
// };

export const getCastes = token => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}${GET_SUBCASTES}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error); // Reject the promise with the error
      });
  });
};

// export const getPartnermatrimonial = async (
//   token,
//   text,
//   page,
//   community_id,
//   state,
//   city,
//   gender,
//   occupation,
//   gotra,
//   cast,
//   subcastId,
// ) => {
//   try {
//     console.log(page, state);
//     const response = await axios.get(`${BASE_URL}${GET_PARTNER}`, {
//       params: {
//         q: text,
//         page: page,
//         size: 5,
//         community_id: community_id,
//         state: state,
//         city: city,
//         gender: gender,
//         occupation: occupation,
//         gotra: gotra,
//         cast: cast,
//         subcastId: subcastId,
//       },
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     console.log(JSON.stringify(response.data));
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     throw error;
//   }
// };

export const getPartnermatrimonial = (
  token,
  text,
  page,
  community_id,
  state,
  city,
  gender,
  occupation,
  gotra,
  cast,
  subcastId,
) => {
  console.log(page, state);

  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}${GET_PARTNER}`, {
        params: {
          q: text,
          page: page,
          size: 5,
          community_id: community_id,
          state: state,
          city: city,
          gender: gender,
          occupation: occupation,
          gotra: gotra,
          cast: cast,
          subcastId: subcastId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        // console.error('Error fetching data:', error);
        // Reject the promise with the error
        reject(error);
      });
  });
};

// export const getChatMatrimonial = async (token, id, messages) => {
//   console.log(`${BASE_URL}${GET_CHAT_MATRIMONIAL}/${id}/${messages}`);
//   return axios
//     .get(`${BASE_URL}${GET_CHAT_MATRIMONIAL}/${id}/${messages}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then(response => {
//       return response.data;
//     })
//     .catch(error => {
//       console.error('Error fetching data getChatMatrimonial:', error);
//       throw error;
//     });
// };

export const getChatMatrimonial = (token, id, messages) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}${GET_CHAT_MATRIMONIAL}/${id}/${messages}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        // Ensure response.data exists before resolving

        resolve(response.data);
      })
      .catch(error => {
        // console.error('Error fetching data getChatMatrimonial:', error);
        // Reject the promise with the error
        reject(error);
      });
  });
};

// export const getProfile = async (token, id) => {
//   return axios
//     .get(`${BASE_URL}${GET_PROFILE}/${id}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then(response => {
//       return response;
//     })
//     .catch(error => {
//       console.error('Error fetching data getProfile:', error);
//       throw error;
//     });
// };
export const getProfile = (token, id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}${GET_PROFILE}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        // Resolve the promise with the response
        resolve(response);
      })
      .catch(error => {
        // console.error('Error fetching data getProfile:', error);
        // Reject the promise with the error
        reject(error);
      });
  });
};

// export const getSelfMatrimonialProfile = async (token, id) => {
//   return axios
//     .get(`${BASE_URL}${GET_SELF_PROFILE_MATRIMONIAL}/${id}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then(response => {
//       return response;
//     })
//     .catch(error => {
//       console.error('Error fetching data getSelfMatrimonialProfile:', error);
//       throw error;
//     });
// };

export const getSelfMatrimonialProfile = (token, id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}${GET_SELF_PROFILE_MATRIMONIAL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        // console.error('Error fetching data getSelfMatrimonialProfile:', error);
        reject(error);
      });
  });
};

// export const getBusiness = async (token, text, field, page, state, city) => {
//   console.log(token, text, field, page, state, city);
//   return axios
//     .get(`${BASE_URL}${GET_BUSINESSES}`, {
//       params: {
//         searchText: text,
//         category: field,
//         page: page,
//         size: 10,
//         state: state,
//         city: city,
//       },
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then(response => {
//       // console.log(response);
//       return response.data;
//     })
//     .catch(error => {
//       console.error('Error fetching data:', error);
//       throw error;
//     });
// };

export const getBusiness = (token, text, field, page, state, city) => {
  // console.log(token, text, field, page, state, city);

  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}${GET_BUSINESSES}`, {
        params: {
          searchText: text,
          category: field,
          page: page,
          size: 10,
          state: state,
          city: city,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        // Resolve the promise with the response data
        resolve(response.data);
      })
      .catch(error => {
        // console.error('Error fetching data:', error);
        // Reject the promise with the error
        reject(error);
      });
  });
};

export const sendTextMatrimonial = (token, receiver_id, message) => {
  return new Promise((resolve, reject) => {
    // console.log(`${BASE_URL}${SEND_MESSAGE_MATRIMONIAL}`);
    axios
      .post(
        `${BASE_URL}${SEND_MESSAGE_MATRIMONIAL}`,
        {
          receiver_id: receiver_id,
          message: message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        // console.error('Error fetching data: sendTextMatrimonial', error);
        reject(error);
      });
  });
};

export const getMembers = (token, text, page, state, city) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}${GET_MEMBERS}`, {
        params: {
          q: text,
          page: page,
          size: 20,
          state: state,
          city: city,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        // console.error('Error fetching data getMembers:', error);
        reject(error);
      });
  });
};

export const getUserServices = token => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}${GET_USER_SERVICES}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        // console.error('Error fetching data getUserServices:', error);
        reject(error);
      });
  });
};

export const createUserService = (
  token,
  city,
  description,
  experience,
  mobile1,
  mobile2,
  state,
  status,
  title,
  category,
) => {
  const bodyData = {
    city: city,
    description: description,
    experience: experience,
    mobile1: mobile1,
    mobile2: mobile2,
    state: state,
    status: status,
    title: title,
    category: category,
  };
  // console.log(bodyData);
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
        reject(error);
      });
  });
};

export const getSpecificService = (
  token,
  role,
  text,
  state,
  city,
  page,
  title,
) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}${GET_SERVICE_ON_SEARCH}`, {
        params: {
          role: role,
          searchQuery: text,
          state: state,
          city: city,
          page: page,
          size: 200,
          title: title,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        // console.error('Error fetching data getSpecificService:', error);
        reject(error);
      });
  });
};

export const getServicesRegisteredByUser = token => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}${GET_SERVICE_REGISTERED_BY_USER}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const getUserAppliedJobs = token => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}${GET_USER_APPLIED_JOBS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        // console.error('Error fetching data getUserAppliedJobs:', error);
        reject(error);
      });
  });
};

export const getJobs = (token, page, state, city, search, jobType) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}${GET_USER_SEARCH_JOBS}`, {
        params: {
          page: page,
          size: 5,
          state: state,
          city: city,
          search: search,
          jobType: jobType,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        // console.log(JSON.stringify(response.data.data.jobs));
        console.log(response);
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const userAppliedJobDetails = (
  token,
  company,
  email,
  job_id,
  job_title,
  mobile,
  resume,
  username,
) => {
  const body = {
    company: company,
    email: email,
    job_id: job_id,
    job_title: job_title,
    mobile: mobile,
    resume: resume,
    username: username,
  };
  return new Promise((resolve, reject) => {
    axios
      .post(`${BASE_URL}${POST_USER_JOB_APPLIED_DETAILS}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        console.log(response);
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const createMatrimonialProfile = (
  token,
  biodata,
  brother_count,
  city,
  contact_number,
  description,
  education,
  father_name,
  height_in_feet,
  is_manglik,
  maternal_gotra,
  matrimonial_profile_dob,
  matrimonial_profile_gender,
  matrimonial_profile_name,
  matrimonial_profile_occupation,
  mother_name,
  paternal_gotra,
  profile_created_for,
  proposal_photos,
  salary_package,
  sister_count,
  sisters_details,
  skin_tone,
  state,
  subcast_id,
) => {
  const bodyData = {
    biodata: biodata,
    brother_count: brother_count,
    city: city,
    contact_number: contact_number,
    description: description,
    education: education,
    father_name: father_name,
    height_in_feet: height_in_feet,
    is_manglik: is_manglik,
    maternal_gotra: maternal_gotra,
    matrimonial_profile_dob: matrimonial_profile_dob,
    matrimonial_profile_gender: matrimonial_profile_gender,
    matrimonial_profile_name: matrimonial_profile_name,
    matrimonial_profile_occupation: matrimonial_profile_occupation,
    mother_name: mother_name,
    paternal_gotra: paternal_gotra,
    profile_created_for: profile_created_for,
    proposal_photos: proposal_photos,
    salary_package: salary_package,
    sister_count: sister_count,
    sisters_details: sisters_details,
    skin_tone: skin_tone,
    state: state,
    subcast_id: subcast_id,
  };

  console.log(bodyData);

  return new Promise((resolve, reject) => {
    axios
      .post(`${BASE_URL}${CREATE_MATRIMONIAL_DETAILS}`, bodyData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        // console.error('Error posting data createMatrimonialProfile:', error);
        reject(error);
      });
  });
};

export const uploadImages = (token, data) => {
  return new Promise((resolve, reject) => {
    const myHeaders = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };
    const formData = new FormData();
    data.forEach((photo, index) => {
      formData.append(`images`, photo);
    });

    console.log(formData);
    axios
      .post(`${BASE_URL}${UPLOAD_MULTIPLE_IMAGES}`, formData, {
        headers: myHeaders,
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const uploadSingleImage = (token, data) => {
  return new Promise((resolve, reject) => {
    const myHeaders = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };

    const formData = new FormData();
    formData.append(`image`, data);

    axios
      .post(`${BASE_URL}${UPLOAD_SINGLE_IMAGES}`, formData, {
        headers: myHeaders,
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const uploadBiodataPdf = (token, pdf) => {
  return new Promise((resolve, reject) => {
    const myHeaders = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };

    const formData = new FormData();
    formData.append(`pdf`, pdf);
    // console.log(formData);
    axios
      .post(`${BASE_URL}${UPLOAD_BIODATA_PDF}`, formData, {
        headers: myHeaders,
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
        // console.log(error, 'sss');
      });
  });
};

export const uploadResume = (token, job_description, resume) => {
  return new Promise((resolve, reject) => {
    const body = {
      job_description: job_description,
      resume: resume,
    };
    console.log(body);
    const myHeaders = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .post(`${BASE_URL}${UPLOAD_RESUME}`, body, {
        headers: myHeaders,
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const CreatenewJob = (
  token,
  job_title,
  job_sector,
  job_type,
  job_subheading,
  location,
  attachment,
  logo,
  description,
  apply_link,
  job_apply_form,
  job_start_date,
  job_end_date,
  fee_details,
  state,
  city,
  resume_apply,
) => {
  return new Promise((resolve, reject) => {
    const body = {
      job_title: job_title,
      job_sector: job_sector,
      job_type: job_type,
      job_subheading: job_subheading,
      location: location,
      attachment: attachment,
      logo: logo,
      description: description,
      apply_link: apply_link,
      job_apply_form: job_apply_form,
      job_start_date: job_start_date,
      job_end_date: job_end_date,
      fee_details: fee_details,
      state: state,
      city: city,
      resume_apply: resume_apply,
    };
    console.log(body);
    const myHeaders = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .post(`${BASE_URL}${USER_CREATE_JOB}`, body, {
        headers: myHeaders,
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const CreateNewBusiness = (
  token,
  business_category,
  business_email,
  business_name,
  business_photos,
  business_website,
  city,
  contact1,
  description,
  google_map_link,
  state,
  status,
  street_address,
) => {
  return new Promise((resolve, reject) => {
    const body = {
      business_category: business_category,
      business_email: business_email,
      business_name: business_name,
      business_photos: business_photos,
      business_website: business_website,
      city: city,
      country: 'India',
      contact1: contact1,
      description: description,
      google_map_link: google_map_link,
      state: state,
      status: status,
      street_address: street_address,
    };
    console.log(body);
    const myHeaders = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .post(`${BASE_URL}${CREATE_BUSINESS_DETAILS}`, body, {
        headers: myHeaders,
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const getDegrees = token => {
  return new Promise((resolve, reject) => {
    console.log(`${BASE_URL}${GET_DEGREES}`);
    axios
      .get(`${BASE_URL}${GET_DEGREES}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        // console.error('Error fetching data:', error);
        reject(error);
      });
  });
};

export const SearchEvents = (token, searchText, page, state, city) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}${SEARCH_EVENTS}`, {
        params: {
          searchText: searchText,
          page: page,
          size: 200,
          state: state,
          city: city,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        // console.log(JSON.stringify(response.data.data.jobs));
        console.log(response);
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const UpdateProfileDetails = (
  token,
  dob,
  email,
  gender,
  highest_qualification,
  is_available_for_marriage,
  job_type,
  marital_status,
  name,
  native_place_city,
  native_place_state,
  occupation,
) => {
  return new Promise((resolve, reject) => {
    const body = {
      dob: dob,
      email: email,
      gender: gender,
      highest_qualification: highest_qualification,
      is_available_for_marriage: is_available_for_marriage,
      job_type: job_type,
      marital_status: marital_status,
      name: name,
      native_place_city: native_place_city,
      native_place_state: native_place_state,
      occupation: occupation,
    };
    console.log(body);
    const myHeaders = {
      Authorization: `Bearer ${token}`,
    };
    console.log(`${BASE_URL}${UPDATE_PROFILE}`);
    axios
      .put(`${BASE_URL}${UPDATE_PROFILE}`, body, {
        headers: myHeaders,
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const ActivityPost = (token, category, description, photo, title) => {
  return new Promise((resolve, reject) => {
    const body = {
      category: category,
      description: description,
      photo: photo,
      title: title,
    };
    console.log(body);
    const myHeaders = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .post(`${BASE_URL}${ACTIVITY_POST}`, body, {
        headers: myHeaders,
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const SearchActivity = (token, searchQuery, category, page, size) => {
  return new Promise((resolve, reject) => {
    console.log(`${BASE_URL}${SEARCH_USER_ACTIVITY}`);
    console.log('sssss', searchQuery, category, page);
    axios
      .get(`${BASE_URL}${SEARCH_USER_ACTIVITY}`, {
        params: {
          searchQuery: searchQuery,
          category: category,
          page: page,
          size: 200,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then(response => {
        // console.log(JSON.stringify(response.data.data.jobs));
        console.log(response);
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

// export const getSpecificEvent = async (token, id) => {
//   console.log(`${BASE_URL}${GET_EVENT}/${id}`);
//   return axios
//     .get(`${BASE_URL}${GET_EVENT}/${id}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then(response => {
//       return response.data;
//     })
//     .catch(error => {
//       console.error('Error fetching data: getSpecificEvent', error);
//       throw error;
//     });
// };

export const getSpecificEvent = (token, id) => {
  console.log(`${BASE_URL}${GET_EVENT}/${id}`);

  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}${GET_EVENT}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: getSpecificEvent', error);
        reject(error);
      });
  });
};

// export const PostEvent = async (
//   token,
//   banner_image,
//   city,
//   description,
//   end_datetime,
//   event_type,
//   start_datetime,
//   state,
//   thumb_image,
//   title,
//   venue,
// ) => {
//   console.log(`${BASE_URL}${GET_EVENT}`);
//   const BodyData = {
//     banner_image: banner_image,
//     city: city,
//     country: 'India',
//     description: description,
//     end_datetime: end_datetime,
//     event_type: event_type,
//     start_datetime: start_datetime,
//     state: state,
//     thumb_image: thumb_image,
//     title: title,
//     venue: venue,
//   };
//   console.log(BodyData);
//   return axios
//     .post(`${BASE_URL}${GET_EVENT}`, BodyData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then(response => {
//       return response.data;
//     })
//     .catch(error => {
//       console.error('Error fetching data PostEvent:', error);
//       const {errors, message} = error.response.data;
//       console.log(errors);
//       console.log(message);

//       throw error;
//     });
// };

export const PostEvent = (
  token,
  banner_image,
  city,
  description,
  end_datetime,
  event_type,
  start_datetime,
  state,
  thumb_image,
  title,
  venue,
) => {
  console.log(`${BASE_URL}${GET_EVENT}`);

  const BodyData = {
    banner_image: banner_image,
    city: city,
    country: 'India',
    description: description,
    end_datetime: end_datetime,
    event_type: event_type,
    start_datetime: start_datetime,
    state: state,
    thumb_image: thumb_image,
    title: title,
    venue: venue,
  };

  console.log(BodyData);

  return new Promise((resolve, reject) => {
    axios
      .post(`${BASE_URL}${GET_EVENT}`, BodyData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        console.error('Error fetching data PostEvent:', error);
        if (error.response && error.response.data) {
          const {errors, message} = error.response.data;
          console.log(errors);
          console.log(message);
        }
        reject(error);
      });
  });
};

export const PostFeedback = (token, message, rating) => {
  return new Promise((resolve, reject) => {
    const body = {
      message: message,
      rating: rating,
    };
    console.log(body);
    const myHeaders = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .post(`${BASE_URL}${POST_FEEDBACK}`, body, {
        headers: myHeaders,
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const UpdateEducationDetails = (
  token,
  degree_id,
  field_of_study,
  highest_qualification,
  institution_name,
  passing_year,
  score,
  score_type,
) => {
  return new Promise((resolve, reject) => {
    const body = {
      degree_id: degree_id,
      field_of_study: field_of_study,
      highest_qualification: highest_qualification,
      institution_name: institution_name,
      passing_year: passing_year,
      score: score,
      score_type: score_type,
    };
    console.log(body);
    const myHeaders = {
      Authorization: `Bearer ${token}`,
    };
    console.log(`${BASE_URL}${UPDATE_EDUCATION_DETAILS}`);
    axios
      .put(`${BASE_URL}${UPDATE_EDUCATION_DETAILS}`, body, {
        headers: myHeaders,
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const UpdateAddress = (
  token,
  address_type,
  address_line,
  city,
  country,
  state,
) => {
  return new Promise((resolve, reject) => {
    const body = {
      address_line: address_line,
      address_type: address_type,
      city: city,
      country: country,
      state: state,
    };
    console.log(body);
    const myHeaders = {
      Authorization: `Bearer ${token}`,
    };
    console.log(`${BASE_URL}${UPDATE_CONTACT_DETAILS}`);
    axios
      .put(`${BASE_URL}${UPDATE_CONTACT_DETAILS}`, body, {
        headers: myHeaders,
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const DeleteMatrimonialProfile = (token, id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${BASE_URL}${DELETE_MATRIMONIAL_PROFILE}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        // console.error('Error fetching data getSelfMatrimonialProfile:', error);
        reject(error);
      });
  });
};
