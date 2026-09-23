import { SERVER_BASE_URL, API_BASE_URL } from '../js/config'

export async function refreshTokens(refreshToken) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'refresh': refreshToken
        })
    }
    const response = await fetch(`${API_BASE_URL}/token/refresh/`, options);
    if(!response.ok) {
        console.log("refresh_token rejected by the server.");
        return false;
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('user', JSON.stringify(data.user));

    // If you ever turn off token rotation in your Django SIMPLE_JWT settings (ROTATE_REFRESH_TOKENS = False), 
    // the backend TokenRefreshView stops sending a new refresh_token. 
    // When that happens, data.refresh will be undefined, so just wrap in quick check
    if(data.refresh)
        localStorage.setItem('refreshToken', data.refresh);

    console.log('Refresh and Access Tokens refreshed.');
    return data;
}

export async function getUserProfileFromAPI(accessToken) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    }
    const response = await fetch(`${API_BASE_URL}/me/`, options);
    if(!response.ok) {
        console.log("access token expired...");
        return false;
    }

    const data = await response.json();
    localStorage.setItem('user', JSON.stringify(data.user));

    console.log('User Session is still valid.');
    return data.user;
}

export async function checkInitAuthStatus() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    console.log('initial - accessToken',accessToken,'refreshToken',refreshToken);

    try {
        // if access_token available
        if(accessToken) {
            const user = await getUserProfileFromAPI(accessToken);
            if(user) return {isAuth:true, user:user};
        }

        // if access_token not available or expired, lets get through refresh_token if available
        if(refreshToken) {
            const data = await refreshTokens(refreshToken);
            if(data.user) return {isAuth:true, user:data.user};
        }

        return {isAuth:false, user:null};
    }
    catch(networkError) {
        // This ONLY runs if the server is dead or internet is disconnected!
        console.log("Network Error:", networkError);
        return false;
    }
}