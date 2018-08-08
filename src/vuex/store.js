// import Vue from 'vue';
// import Vuex from 'vuex';

import index from './module/index';
import list from './module/list';
import self from './module/self';

Vue.use(Vuex);

const store = new Vuex.Store({
  state:{

  },
  mutations:{

  },
  getters:{

  },
  actions:{

  },
  modules:{
    index,
    list,
    self
  }
})
window.store = store;
export default store
