const intitalState = {
    authToken: null,
}

export default (state = intitalState, action) => {
    switch (action.type) {
        case 'LOGIN':
            console.log("Action" ,  action)
            return {
                ...state,
                authToken: action.payload,
            }
        case 'LOGOUT':
            return {
                authToken: null,
            }
        default:
            return state;
    }

}