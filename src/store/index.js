import Vue from 'vue';
import Vuex from 'vuex';
import * as getters from './getters';
import * as actions from './actions';
import * as mutations from './mutators';
// import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex);

const state = {
  currentArticle: 0,
  articleState: [],
  artvis: [
    {
      on: false,
      table: false,
    }, {
      on: true,
      table: false,
    }, {
      on: false,
    }, {
      on: false,
    }, {
      on: false,
    }, {
      on: false,
    }, {
      on: false,
    },
  ],
  history: [],
  tableLabels: {
    sentiment: {
      x: 'Sentiment Score',
      y: 'Sentiment Model',
    },
    dispersion: {
      x: 'Word Position',
      y: 'Word',
    },
    trending: {
      x: 'Date',
      y: 'Flair',
    },
    mentions: {
      x: 'Date',
      y: 'Sources',
    },
  },
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  plugins: process.env.NODE_ENV !== 'production'
  //    ? [createLogger()]
    ? []
    : [],
});
