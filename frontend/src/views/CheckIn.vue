<template>
  <div>
    <AppBar />
    <v-container>
      <div style="margin-top: 1rem; display: flex; flex-direction: row">
        <v-col>
          <h1>{{ $route.query.name }}</h1>
        </v-col>
        <v-chip
          class="ma-2 mt-6"
          style="background-color: white !important"
          color="orange"
          label
          outlined>
          Total&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
            studentList.length
          }}
        </v-chip>
        <v-chip
          class="ma-2 mt-6"
          style="background-color: white !important"
          color="green"
          label
          outlined>
          Present&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
            studentList.filter((item) => item.checkin_status).length
          }}
        </v-chip>
        <v-chip
          class="ma-2 mt-6"
          style="background-color: white !important"
          color="red"
          label
          outlined>
          Absent&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
            studentList.filter((item) => !item.checkin_status).length
          }}
        </v-chip>
      </div>
      <v-tabs
        v-model="tab"
        color="orange darken-2"
        style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px">
        <v-tab key="QRScan"> QR Scan </v-tab>
        <v-tab key="Manaul"> Manual Check In </v-tab>
      </v-tabs>
      <v-tabs-items
        v-model="tab"
        style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px">
        <v-tab-item key="QRScan">
          <v-card color="basil" flat>
            <v-card-text
              ><v-row>
                <v-col
                  v-if="minutes > 0 || seconds > 0"
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                  "
                  ><img
                    style="margin-top: 2rem"
                    @click="goToStudent"
                    :src="`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${qr_data}`" /><br />
                  <Countdown
                    :key="loopKey"
                    :minutes="minutes"
                    :seconds="seconds"
                    @finished="onFinished"></Countdown></v-col
                ><v-col
                  v-else
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                  "
                  ><img
                    src="https://png.pngtree.com/png-vector/20221013/ourmid/pngtree-calendar-icon-logo-2023-date-time-png-image_6310337.png" /></v-col
                ><v-col
                  ><v-row style="margin-top: 4rem"
                    ><v-col style="padding-bottom: 0">Expired Time</v-col
                    ><v-col style="padding-bottom: 0">Quota</v-col></v-row
                  ><v-row
                    ><v-col>
                      <v-text-field
                        v-model="time"
                        placeholder="Enter Expired Time (MM:SS)"
                        outlined
                        color="orange darken-2"
                        v-mask="{
                          mask: '$#:$#',
                          tokens: {
                            $: { pattern: /[0-5]/ },
                            '#': { pattern: /[0-9]/ },
                          },
                        }"
                        :error-messages="timeError"
                        dense
                        append-icon="mdi-clock-time-four-outline"></v-text-field> </v-col
                    ><v-col
                      ><v-text-field
                        v-model.number="quota"
                        v-mask="'###'"
                        color="orange darken-2"
                        dense
                        :error-messages="quotaError"
                        append-icon="mdi-timer-sand"
                        outlined
                        placeholder="Enter scanning quota"></v-text-field></v-col></v-row
                  ><v-row style="margin-top: -1rem"
                    ><v-col
                      ><v-btn
                        block
                        color="orange darken-2"
                        style="color: white"
                        @click="onGenerate"
                        >Generate</v-btn
                      ></v-col
                    ><v-col
                      ><v-btn
                        block
                        color="orange darken-2"
                        style="color: white"
                        disabled
                        @click="onLoopGenerate"
                        >Loop Generate</v-btn
                      ></v-col
                    ><v-col
                      ><v-btn
                        block
                        outlined
                        @click="onStop"
                        color="orange darken-2"
                        style="color: white"
                        >Stop</v-btn
                      ></v-col
                    ></v-row
                  ></v-col
                ></v-row
              ></v-card-text
            >
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
                    <th
                      class="text-left"
                      style="
                        font-size: medium;
                        background: #263238;
                        color: white;
                      ">
                      Name
                    </th>
                    <th
                      class="text-left"
                      style="
                        font-size: medium;
                        background: #263238;
                        color: white;
                      ">
                      Student No.
                    </th>
                    <th
                      class="text-center"
                      style="
                        width: 10rem;
                        font-size: medium;
                        background: #263238;
                        color: white;
                      ">
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
                        @click="onClickCheckIn(item.no)"
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
                            @click="onClickCheckOut(item.no)"
                            v-on="on"
                            >PRESENT</v-btn
                          >
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
import AppBar from "@/components/AppBar.vue";
import Countdown from "@/components/Countdown.vue";
import { api, Toast } from "@/configs/api";
import sign from "jwt-encode";
import dayjs from "dayjs";
import { mask } from "@titou10/v-mask";
import Vue from "vue";
export default Vue.extend({
  components: { AppBar, Countdown },
  directives: { mask },
  mounted() {
    api
      .get(`/students?class_id=${this.$route.params.id}`)
      .then((res) => {
        this.studentList = res.data.data;
      })
      .catch(() => {
        Toast.fire({
          icon: "error",
          title: "Something went wrong!",
        });
      });
    api.delete(`/qr/${this.$route.params.id}`).catch(() => {
      console.log("Do nothing");
    });
  },
  data() {
    return {
      tab: null,
      menu2: false,
      studentList: [],
      isLoop: false,
      time: "",
      quota: "",
      minutes: 0,
      seconds: 0,
      loopKey: 0,
      qr_data: "",
      auto_status: 0,
      timeError: "",
      quotaError: "",
    };
  },
  watch: {
    time() {
      this.timeError = "";
    },
    quota() {
      this.quotaError = "";
    },
    tab(newValue) {
      if (newValue == 1) {
        api
          .get(`/students?class_id=${this.$route.params.id}`)
          .then((res) => {
            this.studentList = res.data.data;
          })
          .catch(() => {
            Toast.fire({
              icon: "error",
              title: "Something went wrong!",
            });
          });
      }
    },
  },
  methods: {
    onGenerate() {
      if (this.time == "" && this.quota == "") {
        this.timeError = "Please enter time";
        this.quotaError = "Please enter quota";
      } else if (this.time == "") {
        this.timeError = "Please enter time";
      } else if (this.quota == "") {
        this.quotaError = "Please enter quota";
      } else if (this.timeError !== "Invalid time format") {
        const minuteAndSecond = this.time.split(":");
        this.minutes = parseInt(minuteAndSecond[0]);
        this.seconds = parseInt(minuteAndSecond[1]);
        const date = dayjs(new Date())
          .add(this.minutes, "minute")
          .add(this.seconds, "second")
          .format("YYYY-MM-DD HH:mm:ss");
        const payload = {
          classroom_id: this.$route.params.id,
          expired_time: date,
          quota: this.quota,
        };
        api
          .post("/qr", {
            quota: this.quota,
            classroom_id: this.$route.params.id,
          })
          .catch(() => {
            Toast.fire({
              icon: "error",
              title: "Something went wrong!",
            });
          });
        this.qr_data = `https://aiz-app-demo.web.app/student-submit/${sign(
          payload,
          "class"
        )}`;
        this.auto_status = setInterval(() => {
          api.get(`/students?class_id=${this.$route.params.id}`).then((res) => {
            this.studentList = res.data.data;
          });
        }, 1000);
      }
    },
    onLoopGenerate() {
      this.isLoop = true;
      this.loopKey = dayjs(new Date()).unix();
      const minuteAndSecond = this.time.split(":");
      this.minutes = parseInt(minuteAndSecond[0]);
      this.seconds = parseInt(minuteAndSecond[1]);
      const date = dayjs(new Date())
        .add(this.minutes, "minute")
        .add(this.seconds, "second")
        .format("YYYY-MM-DD HH:mm:ss");
      const payload = {
        classroom_id: this.$route.params.id,
        expired_time: date,
        quota: this.quota,
      };
      this.qr_data = `https://aiz-app-demo.web.app/student-submit/${sign(
        payload,
        "class"
      )}`;
    },
    onStop() {
      this.minutes = 0;
      this.seconds = 0;
      clearInterval(this.auto_status);
      api
        .delete(`/qr/${this.$route.params.id}`)
        .then(() => {
          window.location.reload();
        })
        .catch(() => {
          Toast.fire({
            icon: "error",
            title: "Something went wrong!",
          });
        });
    },
    onFinished() {
      if (this.isLoop) {
        this.onLoopGenerate();
      } else {
        this.minutes = 0;
        this.seconds = 0;
        api.delete(`/qr/${this.$route.params.id}`).catch(() => {
          Toast.fire({
            icon: "error",
            title: "Something went wrong!",
          });
        });
        clearInterval(this.auto_status);
      }
    },
    onClickCheckIn(student_no) {
      const payload = {
        classroom_id: this.$route.params.id,
        no: student_no,
      };
      api.post("checkin", payload).then(() => {
        api
          .get(`/students?class_id=${this.$route.params.id}`)
          .then((res) => {
            this.studentList = res.data.data;
          })
          .catch(() => {
            Toast.fire({
              icon: "error",
              title: "Something went wrong!",
            });
          });
      });
    },
    onClickCheckOut(student_no) {
      const payload = {
        classroom_id: this.$route.params.id,
        no: student_no,
      };
      api
        .post("checkout", payload)
        .then(() => {
          api
            .get(`/students?class_id=${this.$route.params.id}`)
            .then((res) => {
              this.studentList = res.data.data;
            })
            .catch(() => {
              Toast.fire({
                icon: "error",
                title: "Something went wrong!",
              });
            });
        })
        .catch(() => {
          Toast.fire({
            icon: "error",
            title: "Something went wrong!",
          });
        });
    },
    goToStudent() {
      window.location.href = this.qr_data;
    },
  },
});
</script>
