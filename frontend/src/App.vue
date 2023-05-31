<template>
  <v-app>
    <v-main style="background-color: antiquewhite">
      <AppBar v-show="$route.name != 'student-submit'" />
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import AppBar from './components/AppBar.vue'
import isBetween from 'dayjs/plugin/isBetween'
import './themes/global.css'
import dayjs from 'dayjs'
export default Vue.extend({
  name: 'App',
  components: {
    AppBar
  },
  setup() {
    dayjs.extend(isBetween)
  }
})
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Kanit&display=swap');
html * {
  font-family: 'Kanit' !important;
}
</style>
