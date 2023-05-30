<template>
  <v-app>
    <v-main style="background-color: antiquewhite">
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import isBetween from 'dayjs/plugin/isBetween'
import dayjs from 'dayjs'
export default Vue.extend({
  name: 'App',
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
