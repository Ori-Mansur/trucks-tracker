'use strict';


export default {
    state: {
        googleKey: null
    },
    mutations: {
        setGoogleKey(state, { key }) {
            state.googleKey = key;
        }
    },
    actions: {
        async getGoogleKey(context,{key}) {  
            context.commit({ type: 'setGoogleKey', key })
        }
    },
    getters: {
        googleKey(state) {
            return state.googleKey
        }
    }

};
