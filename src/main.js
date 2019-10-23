// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import {
  Carousel,
  CarouselItem,
  Loading,
  Table,
  TableColumn,
  TabPane,
  Tabs,
} from 'element-ui';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
import store from './store';
import App from './App';
import router from './router';


locale.use(lang);

// Only include what we really need
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Loading);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Table);
Vue.use(TableColumn);

Vue.use(locale);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
