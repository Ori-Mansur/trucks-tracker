import Vue from 'vue'
import Vuex from 'vuex'

import trucksStore from './trucksStore'
import googleStore from './googleStore'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters: {

  },
  modules: {
    trucksStore,
    googleStore
  }
})
