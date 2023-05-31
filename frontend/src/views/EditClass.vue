<template>
  <div>
    <v-container>
      <v-row class="mt-4">
        <v-col><h1>Edit Classroom</h1></v-col>
        <v-col cols="2" class="layout-btn-col">
          <v-btn
            color="orange darken-3"
            block
            outlined
            style="background-color: white"
            @click="$router.push('/')">
            CENCEL
          </v-btn>
        </v-col>
        <v-col cols="2" class="layout-btn-col">
          <v-btn
            color="orange darken-3"
            :loading="saving"
            block
            style="color: white"
            @click="onSaveClassroom">
            SAVE
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card class="shadow">
            <v-row>
              <v-col cols="3" class="ml-4">Name</v-col>
              <v-col cols="3">Start</v-col>
              <v-col cols="3">End</v-col>
            </v-row>
            <v-row class="mt-0">
              <v-col cols="3" class="ml-4">
                <v-text-field
                  outlined
                  color="orange darken-2"
                  :error-messages="nameFieldErrors"
                  v-model="className"
                  placeholder="Enter Classroom Name"
                  dense>
                </v-text-field>
              </v-col>
              <v-col cols="3">
                <v-menu
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
                      v-on="on">
                    </v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menuTimeStart"
                    v-model="startTime"
                    full-width
                    color="orange darken-2"
                    format="24hr"
                    @click:minute="$refs.menuStart?.save(startTime)">
                  </v-time-picker>
                </v-menu>
              </v-col>
              <v-col cols="3">
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
                      v-on="on">
                    </v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menuTimeEnd"
                    v-model="endTime"
                    color="orange darken-2"
                    full-width
                    format="24hr"
                    @click:minute="$refs.menuEnd?.save(endTime)">
                  </v-time-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="btn-add">Student List</v-col>
              <v-col cols="2" class="mr-4">
                <v-btn
                  block
                  color="orange darken-3"
                  style="color: white"
                  @click="dialog = true">
                  ADD
                </v-btn>
              </v-col>
            </v-row>
            <v-simple-table class="mt-4" height="350px" fixed-header>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left table-header">Name</th>
                    <th class="text-left table-header">Student No.</th>
                    <th class="text-left table-header" style="width: 10rem">
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
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <AddStudentModal
      :dialog="dialog"
      :studentList="studentList"
      @closed="dialog = false" />
    <LoadingModal :loading.sync="loading" />
  </div>
</template>
<script>
import LoadingModal from '@/components/LoadingModal.vue'
import AddStudentModal from '@/components/AddStudentModal.vue'
import { SwalSuccess, api } from '@/configs/api'
import Vue from 'vue'

export default Vue.extend({
  name: 'AddClassView',
  components: { LoadingModal, AddStudentModal },
  data() {
    return {
      class_id: this.$route.params.id,
      className: this.$route.query.name,
      startTime: this.$route.query.start,
      endTime: this.$route.query.end,
      dialog: false,
      loading: true,
      studentName: '',
      studentNo: '',
      studentList: [],
      saving: false,
      menuTimeStart: false,
      menuTimeEnd: false,
      stuNoError: '',
      nameFieldErrors: '',
      startTimeFieldErrors: '',
      endTimeFieldErrors: ''
    }
  },
  async mounted() {
    const res = await api.get(`/students?class_id=${this.class_id}`)
    this.loading = false
    if (res && res.status === 200 && res.data.status === 'ok') {
      this.studentList = res.data.data.map((item) => ({
        name: item.name,
        studentNo: item.no
      }))
    }
  },
  methods: {
    onDeleteStudent(index) {
      this.studentList.splice(index, 1)
    },
    async onSaveClassroom() {
      this.saving = true
      const data = {
        name: this.className,
        number_of_students: this.studentList.length,
        students: this.studentList,
        start: this.startTime,
        end: this.endTime
      }
      const res = await api.put(`/classroom/${this.class_id}`, data)
      if (res && res.status === 200 && res.data.status === 'ok') {
        SwalSuccess('Classroom updated successfully')
        this.$router.push('/')
      } else {
        const err = res.data.errors
        this.nameFieldErrors = err.name || ''
        this.startTimeFieldErrors = err.start || ''
        this.endTimeFieldErrors = err.end || ''
        this.saving = false
      }
    }
  }
})
</script>
