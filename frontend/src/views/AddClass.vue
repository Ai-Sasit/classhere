<template>
  <div>
    <AppBar />
    <v-container>
      <v-row style="margin-top: 1rem"
        ><v-col><h1>New Classroom</h1></v-col
        ><v-col
          cols="2"
          style="display: flex; align-items: center; justify-content: end"
          ><v-btn
            color="orange darken-3"
            block
            outlined
            style="color: white; background-color: white"
            @click="$router.push('/')"
            >CENCEL</v-btn
          ></v-col
        ><v-col
          cols="2"
          style="display: flex; align-items: center; justify-content: end"
          ><v-btn
            color="orange darken-3"
            block
            style="color: white"
            :loading="saving"
            @click="onSaveClassroom"
            >SAVE</v-btn
          ></v-col
        ></v-row
      >
      <v-row
        ><v-col
          ><v-card style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
            ><v-row
              ><v-col cols="3" style="margin-left: 1rem">Name</v-col
              ><v-col cols="3">Start</v-col><v-col cols="3">End</v-col></v-row
            >
            <v-row style="margin-top: 0"
              ><v-col cols="3" style="margin-left: 1rem"
                ><v-text-field
                  outlined
                  color="orange darken-2"
                  :error-messages="nameFieldErrors"
                  v-model="className"
                  placeholder="Enter Classroom Name"
                  dense></v-text-field></v-col
              ><v-col cols="3"
                ><v-menu
                  ref="menuStart"
                  v-model="menuTimeStart"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="startTime"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="startTime"
                      label="Start Time"
                      outlined
                      dense
                      :error-messages="startTimeFieldErrors"
                      append-icon="mdi-clock-time-four-outline"
                      readonly
                      v-bind="attrs"
                      v-on="on"></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menuTimeStart"
                    v-model="startTime"
                    full-width
                    color="orange darken-2"
                    format="24hr"
                    @click:minute="
                      $refs.menuStart?.save(startTime)
                    "></v-time-picker> </v-menu></v-col
              ><v-col cols="3">
                <v-menu
                  ref="menuEnd"
                  v-model="menuTimeEnd"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="endTime"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="endTime"
                      label="End Time"
                      outlined
                      dense
                      :error-messages="endTimeFieldErrors"
                      append-icon="mdi-clock-time-four-outline"
                      readonly
                      v-bind="attrs"
                      v-on="on"></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menuTimeEnd"
                    v-model="endTime"
                    color="orange darken-2"
                    full-width
                    format="24hr"
                    @click:minute="
                      $refs.menuEnd?.save(endTime)
                    "></v-time-picker>
                </v-menu> </v-col
            ></v-row>
            <v-row>
              <v-col
                style="margin-left: 1rem; display: flex; align-items: center"
                >Student List</v-col
              >
              <v-col cols="2" style="margin-right: 1rem"
                ><v-btn
                  block
                  color="orange darken-3"
                  style="color: white"
                  @click="dialog = true"
                  >ADD</v-btn
                ></v-col
              >
            </v-row>
            <v-simple-table
              style="margin-top: 1rem"
              height="350px"
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
                      class="text-left"
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
                  <tr v-for="(item, index) in studentList" :key="item.name">
                    <td>{{ item.name }}</td>
                    <td>{{ item.studentNo }}</td>
                    <td>
                      <v-btn
                        icon
                        color="grey darken-3"
                        @click="onDeleteStudent(index)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card></v-col
        ></v-row
      >
    </v-container>
    <v-dialog v-model="dialog" width="350">
      <v-card>
        <v-card-title class="text-p orange darken-2" style="color: white">
          <v-row
            ><v-col>Add Student</v-col
            ><v-col
              style="text-align: end; cursor: pointer"
              @click="dialog = false"
              >X</v-col
            ></v-row
          >
        </v-card-title>

        <v-card-text>
          <br />
          <label>Student Name</label>
          <v-text-field
            outlined
            color="orange darken-2"
            v-model="studentName"
            hide-details=""
            placeholder="Enter Student Name"
            dense></v-text-field>
          <br />
          <label>Student No.</label>
          <v-text-field
            outlined
            v-model="studentNo"
            :error-messages="stuNoError"
            color="orange darken-2"
            placeholder="Enter Student No."
            dense></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="orange darken-2"
            style="color: white"
            @click="onAddStudent">
            ADD
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import AppBar from "@/components/AppBar.vue";
import swal from "sweetalert2";
import { api } from "@/configs/api";
import Vue from "vue";

interface studentList {
  name: string;
  studentNo: string;
}

export default Vue.extend({
  name: "AddClassView",
  components: { AppBar },
  data() {
    return {
      dialog: false,
      className: "",
      studentName: "",
      studentNo: "",
      studentList: [] as studentList[],
      saving: false,
      startTime: "",
      endTime: "",
      menuTimeStart: false,
      menuTimeEnd: false,
      stuNoError: "",
      nameFieldErrors: "",
      startTimeFieldErrors: "",
      endTimeFieldErrors: "",
    };
  },
  watch: {
    studentNo() {
      this.stuNoError = "";
    },
  },
  methods: {
    onDeleteStudent(index: number) {
      this.studentList.splice(index, 1);
    },
    onAddStudent() {
      const studentNo = this.studentNo;
      const studentList = this.studentList;
      // check if student no. already exist
      if (studentList.some((item) => item.studentNo === studentNo)) {
        this.stuNoError = "Student No. already exist";
      } else {
        this.dialog = false;
        // add student to list
        studentList.push({
          name: this.studentName,
          studentNo: this.studentNo,
        });
        this.studentName = "";
        this.studentNo = "";
      }
    },
    async onSaveClassroom() {
      this.saving = true;
      const data = {
        name: this.className,
        number_of_students: this.studentList.length,
        students: this.studentList,
        start: this.startTime,
        end: this.endTime,
      };

      const res = await api.post("/classroom", data);
      this.saving = false;
      if (res && res.status === 200 && res.data.status === "ok") {
        swal.fire({
          icon: "success",
          title: "Success",
          text: "Classroom created successfully",
          timer: 1200,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        this.$router.push("/");
      } else {
        const err = res.data.errors;
        this.nameFieldErrors = err.name || "";
        this.startTimeFieldErrors = err.start || "";
        this.endTimeFieldErrors = err.end || "";
      }
    },
  },
});
</script>
