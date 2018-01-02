<template>
  <section class='byline'>
    <span class=""><a href='#'@click.prevent @click='handleArticle(article.index)'>Expand</a></span>
    <span>Flagged {{ article.timestamp }} ago from {{ article.source }} by {{ article.author }}</span>
  </section>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'Byline',
  props: [
    'data',
  ],
  data() {
    return {
      article: this.data,
    };
  },
  methods: {
    /**
     * Sets Visibility for the Article in the $store.
     * Emits event as well
     * @param  {int} id Article ID
     * @return {[type]}    [description]
     */
    handleArticle(id) {
      this.$emit('articleID', id);
      this.$store.commit('cleanUpTables');
      this.$store.commit('setArticleVisibility', id);
    },
  },
  created() {

  },
  mounted() {

  },
  watch: {

  },
  ...mapMutations([
    'cleanUpTables',
    'setArticleVisibility',
  ]),
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
