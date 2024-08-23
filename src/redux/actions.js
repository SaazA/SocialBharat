export const LoginAction = token => {
  console.log('token', token);
  return dispatch => {
    dispatch({type: 'LOGIN', payload: token});
  };
};

export const LogoutAction = () => {
  return dispatch => {
    dispatch({type: 'LOGOUT', payload: ''});
  };
};

export const UserInfoSaveAction = res => {
  console.log('userInfo', res);
  return dispatch => {
    dispatch({type: 'USERINFOSAVE', payload: res});
  };
};

export const UserInfoDeleteAction = res => {
  console.log('userInfoDELTED', res);
  return dispatch => {
    dispatch({type: 'USERINFODELETE', payload: ''});
  };
};

export const setPasswordUpdated = isUpdate => {
  console.log('userPassword', isUpdate);
  return (dispatch, getState) => {
    dispatch({type: 'SET_PASSWORD_UPDATE', payload: isUpdate});
    if (isUpdate) {
      const userData = getState().UserReducer.userData;
      userData.data.is_password_set = 1; // Update the is_password_set value
      dispatch({type: 'USERINFOSAVE', payload: userData}); // Save the updated user data
    }
  };
};
