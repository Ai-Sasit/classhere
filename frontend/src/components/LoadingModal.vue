<template>
  <v-dialog :value="loading" hide-overlay persistent width="300">
    <v-card color="orange darken-2" dark>
      <v-card-text>
        Loading...
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: true
    }
  }
}
</script>
