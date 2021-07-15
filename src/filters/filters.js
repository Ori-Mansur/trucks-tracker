import Vue from 'vue'
var moment = require('moment');


Vue.filter('dateFormat', (value) => {

    if (!value) return
    return value
})
Vue.filter('dateTimeFormat', (value) => {

    if (!value) return
    value = moment.unix(value).format("DD/MM/YYYY HH:mm:ss");
    
    return value
})


