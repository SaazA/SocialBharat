export const LoginAction = (token)=>{
    console.log("token"  ,token)
    return (dispatch) =>{
        dispatch({type : "LOGIN" , payload : token })
    }
    }


    export const LogoutAction = () =>{
        return  (dispatch) =>{
          dispatch({type : "LOGOUT" , payload  : ""})
        }
      }
    