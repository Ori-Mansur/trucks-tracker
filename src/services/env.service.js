'use strict'
// import io from 'socket.io-client';
// import userService from './user.service.js'
const BASE_URL = process.env.NODE_ENV === 'production'
    ? '/'
    : '//localhost:3000' 

function getBaseUrl() {
    return BASE_URL;
}
function getGoogleKey() {
    return  ;
}
export default {
    getBaseUrl,
    getGoogleKey    
}