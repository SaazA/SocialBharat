import { BASE_URL } from "./urls";
import { LOGIN_API } from "./urls";

export const LoginApi = async(mobile , password)=>{
    const url = `${BASE_URL}${LOGIN_API}`
    const bodyData = JSON.stringify({
        mobile: mobile,
        password: password
    });
const requestOptions = {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: bodyData,
  };
  return fetch(url, requestOptions)
    .then((response) => response.text())
    .then((result) => {
        return result;
    })
    .catch((error) => console.error(error));
}