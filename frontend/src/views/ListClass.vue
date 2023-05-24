<template>
  <div>
    <AppBar />
    <v-container>
      <v-row style="margin-top: 1rem"
        ><v-col><h1>Classroom</h1></v-col
        ><v-col style="display: flex; align-items: center; justify-content: end"
          ><v-btn
            color="orange darken-3"
            style="color: white"
            @click="$router.push('/add-class')"
            >NEW CLASSROOM</v-btn
          ></v-col
        ></v-row
      >
      <v-row>
        <v-col>
          <v-simple-table
            style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
            height="500px"
            fixed-header>
            <template v-slot:default>
              <thead>
                <tr>
                  <th style="text-align: left; font-size: medium">Classroom</th>
                  <th style="text-align: left; font-size: medium">Students</th>
                  <th style="text-align: left; font-size: medium">Date</th>
                  <th style="text-align: left; font-size: medium">TIme</th>
                  <th
                    style="text-align: center; font-size: medium; width: 10rem">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in classrooms" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>{{ item.number_of_students }}</td>
                  <td>{{ dayjs(item.created_at).format("YYYY-MM-DD") }}</td>
                  <td>{{ dayjs(item.created_at).format("HH:mm") }}</td>
                  <td style="text-align: center">
                    <v-btn
                      icon
                      color="grey darken-3"
                      @click="
                        $router.push(`/check-in/${item.id}?name=${item.name}`)
                      ">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      color="grey darken-3"
                      @click="
                        $router.push(`/edit-class/${item.id}?name=${item.name}`)
                      ">
                      <v-icon>mdi-layers-edit</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      color="grey darken-3"
                      @click="onDeleteClassroom(item.id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table></v-col
        >
      </v-row></v-container
    >
    <v-dialog v-model="loading" hide-overlay persistent width="300">
      <v-card color="orange darken-2" dark>
        <v-card-text>
          Please stand by
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import AppBar from "@/components/AppBar.vue";
import { api } from "@/configs/api";
import { Toast } from "@/configs/api";
import swal from "sweetalert2";
import dayjs from "dayjs";
import Vue from "vue";

interface Classroom {
  id: number;
  name: string;
  number_of_students: number;
  created_at: string;
}

export default Vue.extend({
  name: "ListClassView",
  components: { AppBar },
  setup() {
    return {
      dayjs,
    };
  },
  mounted() {
    api
      .get("/classrooms")
      .then((res) => {
        this.loading = false;
        this.classrooms = res.data;
      })
      .catch(() => {
        this.loading = false;
        Toast.fire({
          icon: "error",
          title: "Something went wrong!",
        });
      });
  },
  data() {
    return {
      classrooms: [] as Classroom[],
      loading: true,
    };
  },
  methods: {
    onDeleteClassroom(id: number) {
      swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#ff9800",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        })
        .then((result) => {
          if (result.isConfirmed) {
            api.delete(`/classroom/${id}`).then(() => {
              swal
                .fire({
                  title: "Deleted!",
                  text: "Your classroom has been deleted.",
                  icon: "success",
                  timer: 1500,
                  focusConfirm: false,
                  showConfirmButton: false,
                  timerProgressBar: true,
                })
                .catch(() => {
                  Toast.fire({
                    icon: "error",
                    title: "Something went wrong!",
                  });
                });
              this.classrooms = this.classrooms.filter(
                (item) => item.id !== id
              );
            });
          }
        });
    },
  },
});
</script>
