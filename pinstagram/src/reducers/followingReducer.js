export const initialValue = null;

export const followingData = (state, action) => {
    if(action.type === 'FOLLOWINGDATA') {
        return action.payload;
    }
    return state;
}