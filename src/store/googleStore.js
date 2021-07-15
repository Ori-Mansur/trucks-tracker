'use strict';
import envService from "../services/env.service";

export default {
    state: {
        googleKey: null,
        BASE_URL: '/'
    },
    mutations: {
        setBASE_URL(state, { url }) {
            state.BASE_URL = url;
        },
        setGoogleKey(state, { key }) {
            state.googleKey = key;
        }
    },
    actions: {
        async getBASE_URL(context) {
            var url = envService.getBaseUrl()
            context.commit({ type: 'setBASE_URL', url })
        },
        async getGoogleKey(context, { key }) {
            context.commit({ type: 'setGoogleKey', key })
        }
    },
    getters: {
        googleKey(state) {
            return state.googleKey
        },
        BASE_URL(state) {
            return state.BASE_URL
        },

    }

};
