export const initialValue = null;

export const user = (state, action) => {
    let data = 'hello';
    if(action.type === 'USER'){
        return action.payload;
    }
    if(action.type === 'CLEAR'){
        return null;
    }
    if(action.type === 'UPDATE'){
        return {
            ...state,
            followers: action.payload.followers,
            following: action.payload.following
        }
    }
    if(action.type === 'UPDATEIMAGE'){
        return {
            ...state,
            image: action.payload
        }
    }
    // if(action.type === 'FOLLOWINGDATA') {
    //     data = action.payload;
    //     return data;
    // }
    return state;
}