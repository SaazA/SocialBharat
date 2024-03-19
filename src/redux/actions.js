export const LoginAction = (token)=>{
    console.log("token",token)
    return (dispatch) =>{
        dispatch({type : "LOGIN" , payload : token })
    }
    }


    export const LogoutAction = () =>{
        return  (dispatch) =>{
          dispatch({type : "LOGOUT" , payload  : ""})
        }
      }

      export const UserInfoSaveAction = (res)=>{
        console.log("userInfo",res)
        return  (dispatch) =>{
          dispatch({type : "USERINFOSAVE" , payload  : res})
        }
      }

      export const UserInfoDeleteAction = (res) =>{
        console.log("userInfoDELTED",res)
        return  (dispatch) =>{
          dispatch({type : "USERINFODELETE" , payload  : ""})
        }
      }
    