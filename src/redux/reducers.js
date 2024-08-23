export const AuthReducer = (state = {authToken: null}, action) => {
  switch (action.type) {
    case 'LOGIN':
      console.log('Action', action);
      return {
        ...state,
        authToken: action.payload,
      };
    case 'LOGOUT':
      return {
        authToken: null,
      };
    default:
      return state;
  }
};

export const UserReducer = (
  state = {userData: null, isPasswordUpdate: false},
  action,
) => {
  console.log(action);
  switch (action.type) {
    case 'USERINFOSAVE':
      console.log('USEEEEMEEEE', action);
      return {
        ...state,
        userData: action.payload,
      };
    case 'USERINFODELETE':
      return {
        userData: null,
      };
    case 'SET_PASSWORD_UPDATE':
      console.log('AAAAA', action);
      return {
        ...state,
        isPasswordUpdate: action.payload,
      };
    default:
      return state;
  }
};
