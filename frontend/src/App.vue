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
import Vue from "vue";

export default Vue.extend({
  name: "App",
});
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Kanit&display=swap");
html * {
  font-family: "Kanit" !important;
}
</style>
