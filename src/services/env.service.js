'use strict'
// import io from 'socket.io-client';
// import userService from './user.service.js'
import Axios from 'axios';

var BASE_URL = process.env.NODE_ENV === 'production'
    ? '/'
    : '//localhost:3010' 

async function getBaseUrl() {
    var res = await Axios.get(BASE_URL + '/api/server')
    console.log(res);
    return  res.data;
}
function getGoogleKey() {
    return  ;
}
export default {
    getBaseUrl,
    getGoogleKey    
}