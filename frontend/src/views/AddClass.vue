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
            ><v-row><v-col style="margin-left: 1rem">Name</v-col></v-row>
            <v-row style="margin-top: 0"
              ><v-col cols="3" style="margin-left: 1rem"
                ><v-text-field
                  outlined
                  color="orange darken-2"
                  hide-details=""
                  v-model="className"
                  placeholder="Enter Classroom Name"
                  dense></v-text-field></v-col
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
                    <th class="text-left" style="font-size: medium">Name</th>
                    <th class="text-left" style="font-size: medium">
                      Student No.
                    </th>
                    <th
                      class="text-left"
                      style="width: 5rem; font-size: medium">
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
            color="orange darken-2"
            hide-details=""
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
  methods: {
    onAddStudent() {
      this.dialog = false;
      this.studentList.push({
        name: this.studentName,
        studentNo: this.studentNo,
      });
      this.studentName = "";
      this.studentNo = "";
    },
    onDeleteStudent(index: number) {
      this.studentList.splice(index, 1);
    },
    onSaveClassroom() {
      this.saving = true;
      const data = {
        name: this.className,
        number_of_students: this.studentList.length,
        students: this.studentList,
      };
      api.post("/classroom", data).then(() => {
        this.saving = false;
        swal.fire({
          icon: "success",
          title: "Success",
          text: "Classroom created successfully",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        this.$router.push("/");
      });
    },
  },
  data() {
    return {
      dialog: false,
      className: "",
      studentName: "",
      studentNo: "",
      studentList: [] as studentList[],
      saving: false,
    };
  },
});
</script>
