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
    async tick() {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.$emit("finished");
        clearInterval(this.interval);
      }
      // auto refresh quota
      const res = await api.get(`/qr/${this.$route.params.id}`);
      if (res && res.status === 200 && res.data.status === "ok") {
        this.quota = res.data.data.quota;
      } else {
        this.quota = 0;
      }
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
