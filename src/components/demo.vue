<template>
  <div class='content'>
    <article v-for='(article, articleIndex) of articles' :id='`article-${articleIndex}`' class='sighting' @click='setCurrentArticle(articleIndex)'>
      <section class="index">
        <article class="headline">
          <section>
            <header>
              <h2>{{ article.title }}</h2>
            </header>
          </section>
          <headline :article='article' :aID=articleIndex></headline>
          <detail :article='article' :aID=articleIndex></detail>
        </article>
        <section class="aindex"><div>{{ articleIndex + 100 }}</div></section>
        <section class="trend" :class='{ up: articleIndex % 2 === 0, down: articleIndex % 2 === 1 }'>
          <span class="icon el-icon-caret-top"></span>
          <span>{{`${Math.floor((Math.random() * 1000) + 1)}`}}</span>
          <span class="icon el-icon-caret-bottom"></span>
        </section>
        <section class='thumbnail'>
          <img v-if='article.images && article.images.thumbnail' :src='article.images.thumbnail' :alt='article.title' />
        </section>
      </section>
    </article>

</div>

</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import Headline from './headline/index';
import Detail from './details/index';
import data from '../data/data.json';

export default {
  name: 'demo',
  /**
   * Native Vue mountpoint
   * Grab data from backend and setup for Charting and Table Views

   * @return {[type]} [description]
   */
  created() {
    // axios.get('/data')
    // .then(function(response) {
    //   console.log(response);
    // })
    const that = this;
    data.articles.forEach((item) => {
      // Copy Article as we're muting the object
      const article = Object.assign({}, item);

      // Format timestamp
      article.timestamp = that.formatDate(article.timestamp);

      // Join Concordance array
      if (article.concordance) { article.concordance = article.concordance.join('\n'); }

      // Prep data for charting and Table Rendering
      if (article.chartData) {
        const keys = Object.keys(article.chartData);
        article.charts = {};

        keys.forEach((chart) => {
          const cdata = {};
          const tdata = {};
          cdata.type = chart;
          cdata.coords = that.parseChartCoords(article.chartData[chart].coords);
          cdata.coordLabels = that.parseCoordLabels(article.chartData[chart].coords);
          tdata.coords = that.parseTableCoords(article.chartData[chart].coords);

          article.charts[chart] = {
            chart: cdata,
            table: tdata,
          };
        });
      }
      that.articles.push(article);
    });
  },
  components: {
    Headline,
    Detail,
  },
  computed: mapGetters({
    currID: 'getCurrentArticle',
  }),
  data() {
    return {
      aID: 0,
      charts: [],
      articles: [],
    };
  },
  methods: {
    /**
     * This runs through an array of objects that are used to display the charts
     * Objects are generally { x: val, y: val }.
     * Dates are represented as { date: val, y: val }.
     * Occasionally y values are passed as an array of strings { date: val, y: ['1','2'] }
     * Tables are setup to handle x, y values only so we convert them here
     * @param  {array} coords Array of raw coordinates
     * @return {array}        Array of formatted coordinates
     */
    parseChartCoords(coords) {
      const x = [];
      const y = [];
      coords.forEach((item) => {
        const tx = item.x;
        const ty = item.y;
        const td = item.date;
        if (tx) { x.push(tx); }
        // Format UTC timestamp to JS timestamp
        if (td) { x.push(td * 1000); }
        // If y is an array grab length
        if (ty instanceof Array) {
          y.push(ty.length);
        } else {
          y.push(ty);
        }
      });
      return [x, y];
    },
    /**
     * This runs through an array of objects that are used to populate the data tables.
     * This formats the date and creates a list of Sources from the array of strings
     * Mutating coordinate Array so we need a copy
     * TODO: Helper Function for Date Formatting
     * @param  {array} coords Array of raw coordinates
     * @return {array}        Array of formatted coordinates
     */
    parseTableCoords(coords) {
      const c = coords.slice();
      c.forEach((item, inc) => {
        const nitem = Object.assign({}, item);
        const ty = nitem.y;
        const td = nitem.date * 1000;
        const d = new Date(td);
        const m = ((d.getMonth() + 1) <= 9) ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
        const day = (d.getDate() <= 9) ? `0${d.getDate()}` : d.getDate();
        if (td) {
          nitem.x = `${d.getFullYear()}-${m}-${day}`;
          delete nitem.date;
        }
        if (ty instanceof Array) {
          nitem.y = ty.join('\n');
        }
        c[inc] = Object.assign({}, item, nitem);
      });
      return c;
    },
    /**
     * Takes the y Array value and formats it to a list for chart hover
     * @param  {array} coords Array of raw coordinates
     * @return {array}        Array of formatted coordinates
     */
    parseCoordLabels(coords) {
      const y = [];
      coords.forEach((item) => {
        const ty = item.y;
        if (ty instanceof Array) {
          y.push(ty.join('<br>'));
        } else {
          y.push(ty);
        }
      });
      return y;
    },
    /**
     * Takes a UTC timestamp and formats duration
     * X Seconds ago
     * X Minutes ago (< 90)
     * X Hours ago (> 90m and < 13h)
     * X Weeks ago
     * X Year ago
     * X Year X Weeks ago
     * X Years X Weeks ago
     * @param  {int} date UTC timestamp
     * @return {string}      Formatted date string
     */
    formatDate(date) {
      const now = Date.now();
      let str;
      const diff = (now - date);
      const min = 1000 * 60;
      const hour = min * 60;
      const day = hour * 24;
      const week = day * 7;
      const year = day * 365;

      if (diff <= min) {
        str = 'Seconds';
      } else if (diff > min && diff <= (min * 90)) {
        str = `${Math.ceil(diff / min)} Minutes`;
      } else if (diff > (min * 90) && diff <= day) {
        str = `${Math.ceil(diff / hour)} Hours`;
      } else if (diff > day && diff <= (day * 13)) {
        str = `${Math.ceil(diff / day)} Days`;
      } else if (diff > (day * 13) && diff <= (week * 52)) {
        str = `${Math.ceil(diff / week)} Weeks`;
      } else if (diff >= year) {
        if ((diff / year) <= 1) {
          str = `${Math.floor(diff / year)} Year`;
        } else if ((diff / year) > 1 && (diff / year) < 2) {
          str = `${Math.floor(diff / year)} Year ${Math.ceil((diff - (Math.floor(diff / year) * year)) / week)} Weeks`;
        } else if ((diff / year) >= 2) {
          str = `${Math.floor(diff / year)} Years ${Math.ceil((diff - (Math.floor(diff / year) * year)) / week)} Weeks`;
        }
      } else {
        str = '';
      }
      return str;
    },
    setCurrentArticle(id) {
      this.$store.commit('setCurrentArticle', id);
    },
  },
  ...mapMutations([
    'setCurrentArticle',
  ]),
  watch: {
    // getCurrentArticle(cur, prev) {
    //  console.log(cur, prev);
    // },
  },
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>

</style>
