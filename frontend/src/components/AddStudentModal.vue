<template>
  <v-dialog ref="dialog" :value="dialog" width="350">
    <v-card>
      <v-card-title class="text-p orange darken-2" style="color: white">
        <v-row>
          <v-col>Add Student</v-col>
          <v-col class="text-end" style="cursor: pointer" @click="closeDialog">
            X
          </v-col>
        </v-row>
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
</template>
<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    studentList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      studentName: '',
      studentNo: '',
      stuNoError: ''
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closed')
    },
    onAddStudent() {
      const studentNo = this.studentNo
      const studentList = this.studentList
      // check if student no. already exist
      if (studentList.some((item) => item.studentNo === studentNo)) {
        this.stuNoError = 'Student No. already exist'
      } else {
        this.$emit('closed')
        // add student to list
        studentList.push({
          name: this.studentName,
          studentNo: this.studentNo
        })
        this.studentName = ''
        this.studentNo = ''
      }
    }
  }
}
</script>
