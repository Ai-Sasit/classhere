<template>
  <div>
    <v-container>
      <div class="checkin-title">
        <v-col>
          <h1>{{ $route.query.name }}</h1>
        </v-col>
        <div class="chip-monitor-student chip-orange mr-3">
          <span>Total</span><span>{{ studentList.length }}</span>
        </div>
        <div class="chip-monitor-student chip-green mr-3">
          <span>Present</span><span>{{ present }}</span>
        </div>
        <div class="chip-monitor-student chip-red">
          <span>Absent</span><span>{{ absent }}</span>
        </div>
      </div>
      <v-tabs v-model="tab" color="orange darken-2" class="shadow">
        <v-tab key="QRScan"> QR Scan </v-tab>
        <v-tab key="Manaul"> Manual Check In </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab" class="shadow">
        <v-tab-item key="QRScan">
          <v-card color="basil" flat>
            <v-card-text>
              <v-row>
                <v-col v-if="isGenQR" class="show-qr">
                  <img
                    class="mt-2"
                    @click="goToStudent"
                    :src="`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${qr_data}`" /><br />
                  <Countdown
                    :key="loopKey"
                    :minutes="minutes"
                    :seconds="seconds"
                    @finished="onStop">
                  </Countdown>
                </v-col>
                <v-col v-else class="show-qr">
                  <img
                    src="https://png.pngtree.com/png-vector/20221013/ourmid/pngtree-calendar-icon-logo-2023-date-time-png-image_6310337.png" />
                </v-col>
                <v-col>
                  <v-row style="margin-top: 4rem">
                    <v-col class="pb-0">Expired Time</v-col>
                    <v-col class="pb-0">Quota</v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="time"
                        placeholder="Enter Expired Time (MM:SS)"
                        outlined
                        color="orange darken-2"
                        v-mask="mask"
                        :error-messages="timeError"
                        dense
                        append-icon="mdi-clock-time-four-outline">
                      </v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model.number="quota"
                        v-mask="'###'"
                        color="orange darken-2"
                        dense
                        :error-messages="quotaError"
                        append-icon="mdi-timer-sand"
                        outlined
                        placeholder="Enter scanning quota">
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row style="margin-top: -1rem">
                    <v-col>
                      <v-btn
                        block
                        style="color: white"
                        color="orange darken-2"
                        @click="onGenerate">
                        Generate
                      </v-btn>
                    </v-col>
                    <v-col>
                      <v-btn block color="orange darken-2" disabled>
                        Loop Generate
                      </v-btn>
                    </v-col>
                    <v-col>
                      <v-btn
                        block
                        outlined
                        @click="onStop"
                        color="orange darken-2">
                        Stop
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item key="Manaul">
          <v-card color="basil" flat>
            <v-simple-table
              style="margin-top: 1rem"
              height="400px"
              fixed-header>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left table-header">Name</th>
                    <th class="text-left table-header">Student No.</th>
                    <th class="text-center table-header" style="width: 10rem">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in studentList" :key="item.name">
                    <td>{{ item.name }}</td>
                    <td>{{ item.no }}</td>
                    <td v-if="!item.checkin_status">
                      <v-btn
                        color="orange darken-2"
                        block
                        @click="onClickCheckInOut(item.no, 'checkin')"
                        style="color: white">
                        Check In
                      </v-btn>
                    </td>
                    <td v-else>
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            color="teal darken-2"
                            text
                            block
                            v-bind="attrs"
                            @click="onClickCheckInOut(item.no, 'checkout')"
                            v-on="on">
                            PRESENT
                          </v-btn>
                        </template>
                        <span>Reset</span>
                      </v-tooltip>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </div>
</template>
<script>
import Countdown from '@/components/Countdown.vue'
import { api } from '@/configs/api'
import sign from 'jwt-encode'
import dayjs from 'dayjs'
import { mask } from '@titou10/v-mask'
import Vue from 'vue'
export default Vue.extend({
  components: { Countdown },
  directives: { mask },
  data() {
    return {
      class_id: this.$route.params.id,
      tab: null,
      menu2: false,
      studentList: [],
      isLoop: false,
      time: '',
      quota: '',
      minutes: 0,
      seconds: 0,
      loopKey: 0,
      qr_data: '',
      auto_status: 0,
      timeError: '',
      quotaError: '',
      isGenQR: false,
      mask: {
        mask: '$#:$#',
        tokens: {
          $: { pattern: /[0-5]/ },
          '#': { pattern: /[0-9]/ }
        }
      }
    }
  },
  async mounted() {
    await this.updateStudentList()
    // clear qr in db
    await api.delete(`/qr/${this.class_id}`)
  },
  computed: {
    present() {
      return this.studentList.filter((item) => item.checkin_status).length
    },
    absent() {
      return this.studentList.filter((item) => !item.checkin_status).length
    }
  },
  watch: {
    time() {
      this.timeError = ''
    },
    quota() {
      this.quotaError = ''
    },
    async tab(newValue) {
      if (newValue == 1) {
        await this.updateStudentList()
      }
    }
  },
  methods: {
    async updateStudentList() {
      const res = await api.get(`/students?class_id=${this.class_id}`)
      if (res && res.status == 200 && res.data.status == 'ok') {
        this.studentList = res.data.data
      }
    },
    async onGenerate() {
      if (this.time == '') {
        this.timeError = 'Please enter time'
      } else {
        // get countdown time
        const [minutes, seconds] = this.time.split(':')
        this.minutes = parseInt(minutes)
        this.seconds = parseInt(seconds)
        // get expired time
        const date = dayjs(new Date())
          .add(this.minutes, 'minute')
          .add(this.seconds, 'second')
          .format('YYYY-MM-DD HH:mm:ss')
        const payload = {
          classroom_id: this.$route.params.id,
          expired_time: date,
          quota: this.quota
        }
        const res = await api.post('/qr', payload)
        if (res && res.status === 200 && res.data.status === 'ok') {
          this.isGenQR = true
          // generate token for sequrity
          const token = sign(payload, 'class')
          this.qr_data = `https://aiz-app-demo.web.app/student-submit/${token}`
          // auto update student list
          this.auto_status = setInterval(this.updateStudentList, 1000)
        } else {
          const err = res.data.errors
          this.quotaError = err.quota || ''
        }
      }
    },
    async onStop() {
      this.minutes = 0
      this.seconds = 0
      // stop auto update student list
      clearInterval(this.auto_status)
      const res = await api.delete(`/qr/${this.class_id}`)
      if (res && res.status === 200 && res.data.status === 'ok') {
        window.location.reload()
      }
    },
    async onClickCheckInOut(student_no, route) {
      const payload = {
        classroom_id: this.class_id,
        no: student_no
      }
      const res = await api.post(route, payload)
      if (res && res.status === 200 && res.data.status === 'ok') {
        await this.updateStudentList()
      }
    },
    // for testing
    goToStudent() {
      window.location.href = this.qr_data
    }
  }
})
</script>
