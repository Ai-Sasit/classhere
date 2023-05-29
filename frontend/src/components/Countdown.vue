<script>
import { api } from "@/configs/api";
export default {
  name: "CountdownCom",
  props: {
    minutes: {
      type: Number,
      default: 0,
    },
    seconds: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      timeLeft: this.minutes * 60 + this.seconds,
      interval: 0,
      quota: 0,
    };
  },
  methods: {
    tick() {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.$emit("finished");
        clearInterval(this.interval);
      }
      api.get(`/qr/${this.$route.params.id}`).then((res) => {
        try {
          this.quota = res.data.data.quota;
        } catch (err) {
          this.quota = 0;
        }
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.interval = setInterval(() => {
        this.tick();
      }, 1000);
    });
  },
  computed: {
    formattedTimeLeft() {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      return `${minutes < 10 ? "0" + minutes : minutes}:${
        seconds < 10 ? "0" + seconds : seconds
      }`;
    },
  },
};
</script>

<template>
  <div style="padding-bottom: 2rem">
    <h2 style="color: red">Expired In : {{ formattedTimeLeft }}</h2>
    <h3 style="color: orange">Quota : {{ quota }} left</h3>
  </div>
</template>
