<template>
  <div class="headline-content">
    <byline :data='this.byline'></byline>
    <headline-footer></headline-footer>
  </div>
</template>

<script>
import HeadlineFooter from './footer';
import Byline from './byline';

export default {
  name: 'Headline',
  props: [
    'article',
    'aID',
  ],
  components: {
    Byline,
    HeadlineFooter,
  },
  data() {
    return {
      // Normalize the Byline info here
      byline: {
        index: this.aID,
        timestamp: this.article.timestamp,
        author: this.article.author,
        source: this.article.source,
      },
    };
  },
  methods: {

  },
  created() {

  },
  mounted() {

  },
  watch: {

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
