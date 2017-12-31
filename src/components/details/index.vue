<template>
  <div>
  <article class='detail_content' :class='{ on: $store.state.artvis[this.aID].on }'>
    <section class='details'>
      <div v-if='article.images && article.images.full' class='col col1'>
        <template>
          <el-carousel :autoplay='false' indicator-position='outside'>
            <el-carousel-item v-for="path of article.images.full" :key="path">
              <img :src='path'  alt='' class='img' />
            </el-carousel-item>
          </el-carousel>
        </template>
        <div class='keywords'>
          <a href='#'>Lorem</a> <a href='#'>ipsum</a> <a href='#'>dolor</a> <a href='#'>sit</a> <a href='#'>amet</a> <a href='#'>consectetur</a> <a href='#'>adipiscing</a> <a href='#'>elit</a>
        </div>
        <div class='description'>
          {{ article.description }}
        </div>
        <div v-if="article.stats" class='text-analysis stats'>
          <el-table :ref='`statstable-${aID}`' :data="article.stats" :default-sort="{prop: 'name', order: 'ascending'}" row-key='name'>
            <el-table-column prop='name' label="Stat" sortable id="id">
            </el-table-column>
            <el-table-column prop='value' label="Value">
            </el-table-column>
          </el-table>
        </div>
        <div v-if="article.concordance && article.concordance.length > 0" class='text-analysis concordance'>
          <div><pre>{{ article.concordance }}</pre></div>
        </div>
        <div class='text-analysis recommendations'>
          <ul>
            <li><a href='#/1'>Recommendation 1</a></li>
            <li><a href='#/2'>Recommendation 2</a></li>
            <li><a href='#/3'>Recommendation 3</a></li>
            <li><a href='#/4'>Recommendation 4</a></li>
          </ul>
        </div>
      </div>
      <div class='col col2'>
          <div class='analysis' v-if='article.charts'>
            <template v-for='(chart, key, chartIndex) of article.charts' class='tabs'>
              <el-tabs :ref='`tab-${key}-${aID}`' type="border-card" @tab-click='delayShow(`${aID}`)'>
                <el-tab-pane>
                  <span slot="label"><i class="el-icon-date"></i> {{ key }} </span>
                  <div :id='`${key}-${aID}`' class='graph' :class='`${key}`'></div>
                </el-tab-pane>
                <el-tab-pane v-if='article.charts[key]' class="tpane" :class='{ on: $store.state.artvis[aID].table }'>
                  <span slot="label"><i class="el-icon-tickets"></i> Data</span>
                  <el-table :ref='`table-${key}-${aID}`' :data="article.charts[key].table.coords" :default-sort="{prop: 'x', order: 'ascending'}" row-key = 'x'>
                    <el-table-column prop='x' :label='$store.state.tableLabels[key].x' sortable id="id">
                    </el-table-column>
                    <el-table-column prop='y' :label='$store.state.tableLabels[key].y'>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane>
                  <span slot="label"><i class="el-icon-info"></i> Info</span>
                  <div class='tab-info'>
                    <h4>Parallel Dots</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dignissim, metus nec faucibus eleifend, dolor libero mattis arcu, in porta neque libero et augue. Donec pharetra feugiat purus, et aliquet mi congue et. Nam ut commodo nunc, vitae laoreet libero. Vestibulum volutpat sit amet nunc eu tempor. Proin vehicula rutrum risus, non congue velit fermentum a. Nam nec dapibus magna. Quisque ornare orci eget nulla venenatis elementum nec eu justo.</p>
                    <h4>Stanford</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dignissim, metus nec faucibus eleifend, dolor libero mattis arcu, in porta neque libero et augue. Donec pharetra feugiat purus, et aliquet mi congue et. Nam ut commodo nunc, vitae laoreet libero. Vestibulum volutpat sit amet nunc eu tempor. Proin vehicula rutrum risus, non congue velit fermentum a. Nam nec dapibus magna. Quisque ornare orci eget nulla venenatis elementum nec eu justo.</p>
                    <h4>Senticlass</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dignissim, metus nec faucibus eleifend, dolor libero mattis arcu, in porta neque libero et augue. Donec pharetra feugiat purus, et aliquet mi congue et. Nam ut commodo nunc, vitae laoreet libero. Vestibulum volutpat sit amet nunc eu tempor. Proin vehicula rutrum risus, non congue velit fermentum a. Nam nec dapibus magna. Quisque ornare orci eget nulla venenatis elementum nec eu justo.</p>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </template>
          </div>

      </div>
    </section>
  </article>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import Plotly from 'plotly.js/dist/plotly';

export default {
  name: 'Detail',
  props: [
    'article',
    'aID',
  ],
  components: {
    // Byline,
    // HeadlineFooter,
  },
  computed: mapGetters({
    currID: 'getCurrentArticle',
  }),
  data() {
    return {
      charts: [],
    };
  },
  methods: {
    /**
     * Set a timeout because the Table functionality needs to calculate space before rendering
     * this is set to visibility: hidden for that calculation then visibility: visible to prevent
     * a jump while the Table functionality does its thing
     *
     * TODO: When switching tabs - adjust the chart off screen in a visibility: hidden situation
     * so when the window resize event fires we can resize the chart without it
     * throwing a bunch of errors
     * @param {int} Article ID
     */
    delayShow(id) {
      const that = this;
      setTimeout(() => {
        that.$store.state.artvis[id].table = true;
      }, 1000);
    },
    /**
     * This preps the Lexical Dispersion Chart
     * @type {Plot}
     */
    dispersion() {
      if (!this.article.charts || !this.article.charts.dispersion) return;
      const canvs = this.fitChart(`div[id='dispersion-${this.aID}']`);
      const dataSet = {
        x: this.article.charts.dispersion.chart.coords[0],
        y: this.article.charts.dispersion.chart.coords[1],
        mode: 'markers',
        marker: {
          symbol: 142,
        },
        type: 'scatter',
      };
      const data = [dataSet];
      const layout = {
        filename: 'dispersion',
        fileopt: 'overwrite',
        autosize: true,
        margin: {
          t: 40,
          l: 100,
          r: 50,
        },
        xaxis: {
        },
        yaxis: {
          autorange: 'reversed',
        },
      };
      this.charts.push(canvs);
      Plotly.newPlot(canvs, data, layout);
      Plotly.Plots.resize(canvs);
    },
    /**
     * Plotly is a PITA in that there is really no way to resize a chart other
     * than by redrawing the entire thing. This method calculates the H + W of the new
     * parent area and returns a new object to insert the chart into
     * @param  {HTML Element} el HTML element to inset Chart into
     * @return {Object}    D3 Node
     */
    fitChart(el) {
      const d3 = Plotly.d3;
      const WIDTH_IN_PERCENT_OF_PARENT = 100;
      const HEIGHT_IN_PERCENT_OF_PARENT = 100;
      const gd3 = d3.select(el)
        .style({
          width: `${WIDTH_IN_PERCENT_OF_PARENT}%`,
          'margin-left': `((100 -${WIDTH_IN_PERCENT_OF_PARENT}) / 2)%`,
          height: `${HEIGHT_IN_PERCENT_OF_PARENT}%`,
        });
      return gd3.node();
    },
    /**
     * This preps the Mentions (flair) Chart
     * @type {Plot}
     */
    mentions() {
      if (!this.article.charts || !this.article.charts.mentions) return;
      const canvs = this.fitChart(`div[id='mentions-${this.aID}']`);
      const dataSet = {
        x: this.article.charts.mentions.chart.coords[0],
        y: this.article.charts.mentions.chart.coords[1],
        mode: 'lines+markers',
        type: 'scatter',
        line: {
          shape: 'hv',
        },
        text: this.article.charts.mentions.chart.coordLabels || '',
        hoverinfo: 'text',
      };
      const data = [dataSet];
      const layout = {
        filename: 'mentions',
        fileopt: 'overwrite',
        autosize: true,
        margin: {
          t: 40,
          l: 100,
          r: 50,
        },
        xaxis: {
          type: 'date',
        },
        yaxis: {},
      };
      this.charts.push(canvs);
      Plotly.newPlot(canvs, data, layout);
      Plotly.Plots.resize(canvs);
    },
    /**
     * This preps the Sentiment Model Chart
     * Sentiment is measured in % 0 - 1
     * range is set +-.1 on either side to the margins show
     * @type {Plot}
     */
    sentiment() {
      if (!this.article.charts || !this.article.charts.sentiment) return;
      const canvs = this.fitChart(`div[id='sentiment-${this.aID}']`);
      const dataSet = {
        x: this.article.charts.sentiment.chart.coords[0],
        y: this.article.charts.sentiment.chart.coords[1],
        mode: 'markers',
        marker: {
          symbol: 142,
        },
        type: 'scatter',
      };
      const data = [dataSet];
      const layout = {
        filename: 'sentiment',
        fileopt: 'overwrite',
        autosize: true,
        margin: {
          t: 40,
          l: 100,
          r: 50,
        },
        xaxis: {
          tickvals: [0, 0.5, 1],
          ticktext: ['negative', 'neutral', 'positive'],
          range: [-0.1, 1.1],
          zeroline: false,
        },
        yaxis: {
        },
      };
      this.charts.push(canvs);
      Plotly.newPlot(canvs, data, layout);
      Plotly.Plots.resize(canvs);
    },
    /**
     * This preps the Trending Chart
     * @type {Plot}
     */
    trending() {
      if (!this.article.charts || !this.article.charts.trending) return;
      const canvs = this.fitChart(`div[id='trending-${this.aID}']`);
      const dataSet = {
        x: this.article.charts.trending.chart.coords[0],
        y: this.article.charts.trending.chart.coords[1],
        mode: 'lines+markers',
        type: 'scatter',
      };
      const data = [dataSet];
      const layout = {
        filename: 'trend',
        fileopt: 'overwrite',
        autosize: true,
        margin: {
          t: 40,
          l: 100,
          r: 50,
        },
        title: 'Trending',
        xaxis: {
          type: 'date',
        },
        yaxis: {},
      };
      this.charts.push(canvs);
      Plotly.newPlot(canvs, data, layout);
      Plotly.Plots.resize(canvs);
    },
    /**
     * Function that is called when window is resized to redraw charts so they
     * fit within the new space. Handles Plotly limitation
     * @type {[type]}
     */
    redrawCharts() {
      this.charts.forEach((el) => {
        Plotly.Plots.resize(el);
      });
    },
    /**
     * Determine if if screen is large enough to render the charts.
     * Emmulates breakpoints in CSS, Charts don't work well below 600px.
     * TODO: Generate Images and display for devices under 600px
     * https://plot.ly/javascript/static-image-export/
     * @type {Boolean}
     */
    render() {
      let render = false;
      const vpw = window.screen.width;
      if (vpw > 600) {
        render = true;
      }
      return render;
    },
  },
  /**
   * Native Vue mountpoint
   * Add event listener for resize to handle charting limitations
   * @type {Object}
   */
  created() {
    window.addEventListener('resize', this.redrawCharts);
  },
  /**
   * Native Vue mountpoint
   * When the browser is ready, Render all the charts off screen. That way the user
   * is not waiting to see the data
   */
  mounted() {
    if (this.render()) {
      this.dispersion();
      this.mentions();
      this.sentiment();
      this.trending();
    }
  },
  watch: {
    /**
     * Watch for changes to the the Current Article ID
     * Info is read from the $store;
     * @return {[type]} [description]
     */
    currID() {
      // this.redrawCharts();
      if (this.currID === this.aID) {
        // Do somthing to this single instance
        // this.sentiment();
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  [v-cloak] {
    display: none;
  }
</style>
