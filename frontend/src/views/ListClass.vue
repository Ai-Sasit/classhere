<template>
  <div>
    <v-container>
      <v-row class="mt-4">
        <v-col><h1>Classroom</h1></v-col>
        <v-col class="layout-btn-col">
          <v-btn
            color="orange darken-3"
            style="color: white"
            @click="$router.push('/add-class')">
            NEW CLASSROOM
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-simple-table class="shadow" height="500px" fixed-header>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="table-header text-left">Classroom</th>
                  <th class="table-header text-left">Students</th>
                  <th class="table-header text-left">Start</th>
                  <th class="table-header text-left">End</th>
                  <th class="table-header text-left">Ceated At</th>
                  <th class="table-header text-left" style="width: 10rem">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in classrooms" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>{{ item.number_of_students }}</td>
                  <td>{{ item.start_time }}</td>
                  <td>{{ item.end_time }}</td>
                  <td>{{ dayjs(item.created_at).format('YYYY-MM-DD') }}</td>
                  <td class="text-center">
                    <v-btn
                      v-if="isBetweenTime(item.start_time, item.end_time)"
                      icon
                      color="grey darken-3"
                      @click="
                        $router.push(`/check-in/${item.id}?name=${item.name}`)
                      ">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                    <v-tooltip bottom v-else>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          color="grey darken-3"
                          v-on="on"
                          v-bind="attrs">
                          <v-icon>mdi-eye-off</v-icon>
                        </v-btn>
                      </template>
                      <span>Classroom is not available</span>
                    </v-tooltip>
                    <v-btn
                      icon
                      color="grey darken-3"
                      @click="
                        $router.push(
                          `/edit-class/${item.id}?name=${item.name}&start=${item.start_time}&end=${item.end_time}`
                        )
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
          </v-simple-table>
        </v-col>
      </v-row>
    </v-container>

    <LoadingModal :loading="loading" />
  </div>
</template>

<script lang="ts">
import { SwalSuccess, api } from '@/configs/api'
import swal from 'sweetalert2'
import dayjs from 'dayjs'
import Vue from 'vue'
import LoadingModal from '@/components/LoadingModal.vue'

interface Classroom {
  id: number
  name: string
  number_of_students: number
  created_at: string
  start_time: string
  end_time: string
}

export default Vue.extend({
  name: 'ListClassView',
  setup() {
    return {
      dayjs
    }
  },
  data() {
    return {
      classrooms: [] as Classroom[],
      loading: true
    }
  },
  async mounted() {
    const res = await api.get('/classrooms')
    this.loading = false
    if (res && res.status === 200 && res.data.status === 'ok') {
      this.classrooms = res.data.data
    }
  },
  methods: {
    async onDeleteClassroom(id: number) {
      const result = await swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff9800',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })
      if (result.isConfirmed) {
        const res = await api.delete(`/classroom/${id}`)
        if (res && res.status === 200 && res.data.status === 'ok') {
          SwalSuccess('Classroom deleted successfully')
          this.classrooms = this.classrooms.filter((item) => item.id !== id)
        }
      }
    },
    // check if current time is between start and end time for specific classroom
    isBetweenTime(start: string, end: string) {
      const hr1 = parseInt(start.split(':')[0])
      const hr2 = parseInt(end.split(':')[0])
      const now = dayjs()
      const date = now.format('YYYY-MM-DD')
      if (hr1 > hr2) {
        // if start time is greater than end time, then it's a night class
        const startDateTime = now.subtract(1, 'day').format('YYYY-MM-DD')
        const startTime = dayjs(`${startDateTime} ${start}`)
        const endTime = dayjs(`${date} ${end}`)
        return now.isBetween(startTime, endTime)
      } else {
        // if start time is less than end time, then it's a day class
        const startTime = dayjs(`${date} ${start}`)
        const endTime = dayjs(`${date} ${end}`)
        return now.isBetween(startTime, endTime)
      }
    }
  },
  components: { LoadingModal }
})
</script>
<style></style>
