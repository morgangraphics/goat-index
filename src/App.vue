<template>
  <demo></demo>
</template>

<script>
import 'element-ui/lib/theme-chalk/index.css';
import demo from './components/demo';

export default {
  name: 'app',
  components: {
    demo,
  },
  data() {
    return {
    };
  },
};
</script>


<style lang='scss'>
  @import './assets/scss/main.scss';
</style>
