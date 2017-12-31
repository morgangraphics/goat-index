// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import { Carousel, CarouselItem, Tabs, TabPane, Table, TableColumn, Loading } from 'element-ui';
import store from './store';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

// Only include what we really need
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Loading);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Table);
Vue.use(TableColumn);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
