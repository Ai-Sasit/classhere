<template>
  <div>
    <v-app-bar dense dark style="display: flex; justify-content: center">
      <v-toolbar-title
        ><b
          >CLASS<span style="color: sandybrown">HERE</span></b
        ></v-toolbar-title
      >
    </v-app-bar>
    <v-card
      class="mx-auto"
      elevation="2"
      style="height: 88vh; width: 90%; margin-top: 1.5rem">
      <v-divider style="margin-bottom: 30vh" />
      <div v-if="!loading">
        <div class="mx-4" v-if="allow">
          <h2 style="margin-bottom: 0.5rem">Student No.</h2>
          <v-text-field
            outlined
            style="font-size: large"
            color="orange darken-2"
            v-model="no"
            hide-details=""
            placeholder="Enter student number"></v-text-field>
          <div style="text-align: center; margin-top: 1.5rem">
            <v-btn
              color="orange darken-2"
              style="color: white; font-size: large"
              large
              @click="onSubmit"
              >submit</v-btn
            >
          </div>
        </div>
        <div
          v-else
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
          ">
          <v-icon large color="red darken-2" style="font-size: 8rem">
            mdi-cancel
          </v-icon>
          <h3>หมดเวลาเช็คชื่อ</h3>
        </div>
      </div>
      <div
        v-else
        style="
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
        ">
        <v-progress-circular
          :size="100"
          :width="7"
          color="orange darken-2"
          indeterminate></v-progress-circular>
        <br />
        <h3 style="text-align: center">Checking QR Code</h3>
      </div>
    </v-card>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { api, Toast } from "@/configs/api";
import Swal from "sweetalert2";

interface Payload {
  classroom_id: number;
  expired_time: string;
}

export default Vue.extend({
  name: "StudentSubmitView",
  data() {
    return {
      token: this.$route.params.token,
      allow: false,
      loading: true,
      no: "",
    };
  },
  async mounted() {
    const decoded: Payload = jwt_decode(this.token);
    const { data } = await api.get(`/qr/${decoded.classroom_id}`);
    // if (res && res.status === 200 && res.data.status === 'ok') {
      
    // }

    if (
      dayjs(decoded.expired_time).unix() > dayjs(new Date()).unix() &&
      data.data.quota > 0
    ) {
      await api.put(`/qr/${decoded.classroom_id}`);
      this.loading = false;
      this.allow = true;
    } else {
      await api.delete(`/qr/${decoded.classroom_id}`);
      this.loading = false;
      this.allow = false;
    }
  },
  methods: {
    onSubmit() {
      const decoded: Payload = jwt_decode(this.token);
      const payload = {
        no: this.no,
        classroom_id: decoded.classroom_id,
      };
      api
        .post("/checkin", payload)
        .then(() => {
          Swal.fire({
            title: "Success",
            text: "Check in success",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            window.location.href = "https://www.google.com";
          });
        })
        .catch(() => {
          Toast.fire({
            icon: "error",
            title: "Something went wrong!",
          });
        });
    },
  },
});
</script>
