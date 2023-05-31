<template>
  <div>
    <v-app-bar dense dark class="app-bar">
      <v-toolbar-title>
        <b>CLASS<span class="half-text-app-bar">HERE</span></b>
      </v-toolbar-title>
    </v-app-bar>
    <v-card class="mx-auto main-card" elevation="2">
      <v-divider style="margin-bottom: 30vh" />
      <div v-if="!loading">
        <div class="mx-4" v-if="allow">
          <h2 class="mb-1">Student No.</h2>
          <v-text-field
            outlined
            style="font-size: large"
            color="orange darken-2"
            v-model="no"
            hide-details=""
            placeholder="Enter student number"></v-text-field>
          <div class="btn-section">
            <v-btn
              color="orange darken-2"
              class="btn-style"
              large
              @click="onSubmit">
              submit
            </v-btn>
          </div>
        </div>
        <div v-else class="card-layout">
          <v-icon large color="red darken-2" style="font-size: 8rem">
            mdi-cancel
          </v-icon>
          <h3>หมดเวลาเช็คชื่อ</h3>
        </div>
      </div>
      <div v-else class="card-layout">
        <v-progress-circular
          :size="100"
          :width="7"
          color="orange darken-2"
          indeterminate></v-progress-circular>
        <br />
        <h3 class="text-center">Checking QR Code</h3>
      </div>
    </v-card>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import jwt_decode from 'jwt-decode'
import dayjs from 'dayjs'
import { api } from '@/configs/api'
import Swal from 'sweetalert2'

interface Payload {
  classroom_id: number
  expired_time: string
}

export default Vue.extend({
  name: 'StudentSubmitView',
  data() {
    return {
      token: this.$route.params.token,
      allow: false,
      loading: true,
      no: ''
    }
  },
  async mounted() {
    // decode token from qr code
    const { classroom_id, expired_time }: Payload = jwt_decode(this.token)
    // get qr code quota data
    const res = await api.get(`/qr/${classroom_id}`)
    if (res && res.status === 200 && res.data.status === 'ok') {
      const { quota } = res.data.data
      // check if expired time is not expired and quota is not 0
      if (dayjs(expired_time).unix() > dayjs(new Date()).unix() && quota > 0) {
        // decrease quota
        await api.put(`/qr/${classroom_id}`)
        this.allow = true
      } else {
        // force delete qr code
        await api.delete(`/qr/${classroom_id}`)
        this.allow = false
      }
      this.loading = false
    }
  },
  methods: {
    async onSubmit() {
      const decoded: Payload = jwt_decode(this.token)
      const payload = {
        no: this.no,
        classroom_id: decoded.classroom_id
      }
      // send check in request
      const res = await api.post('/checkin', payload)
      if (res && res.status === 200 && res.data.status === 'ok') {
        Swal.fire({
          title: 'Success',
          text: 'Check in success',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          window.close()
        })
      }
    }
  }
})
</script>
<style scoped>
.app-bar {
  display: flex;
  justify-content: center;
}
.half-text-app-bar {
  color: sandybrown;
}
.main-card {
  height: 88vh;
  width: 90%;
  margin-top: 1.5rem;
}
.btn-section {
  text-align: center;
  margin-top: 1.5rem;
}
.btn-style {
  color: white;
  font-size: large;
}
.card-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
