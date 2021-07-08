import AsyncStorage from '@react-native-community/async-storage';

const baseAPIURL = 'http://localhost:3000/api/';

export const getUserData = async (userId) => {
    const res = await fetch(baseAPIURL + 'user/' + userId, {
        method: 'get',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
    })
    return res
};

export const updateUserData = async (userId, userData) => {
    const res = await fetch(baseAPIURL + 'user/' + userId, {
        method: 'put',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ ...userData }),
    })
    return res
};

export const subscribeUsers = (callback) => {
    AsyncStorage.getItem("jwt_token", (_error, token) => {
        const config = {
            headers: { 'Authorization': token }
        };
    
        fetch(baseAPIURL + "users", config)
            .then(response => response.json())
            .then(data => {
                callback(data.users)
            })
            .catch(err => { console.log(err) });
    })

    return null
};

export const subscribeCurrentUser = (userId, callback) => {
    fetch(baseAPIURL + 'user/' + userId, {
        method: 'get',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
    })
    .then((response) => response.json())
    .then((json) => {
        callback(json);
    })
    .catch((error) => {
        alert(error)
        console.error(error);
    });
    return null;
};
