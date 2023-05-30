const getClassroomObj = async (classroom) => {
  const errs = { err: true }

  !classroom.name ? (errs.name = 'Please fill name field') : null
  !classroom.start ? (errs.start = 'Please fill start time field') : null
  !classroom.end ? (errs.end = 'Please fill end time field') : null

  if (!classroom.name || !classroom.start || !classroom.end) {
    return errs
  }

  const classroomObj = {
    name: classroom.name,
    number_of_students: parseInt(classroom.number_of_students),
    start_time: classroom.start,
    end_time: classroom.end
  }

  const students = classroom.students

  return { classroomObj, students }
}

const getStudentObjArray = async (students, class_id) => {
  const studentObj = students.map((student) => ({
    name: student.name,
    no: student.studentNo,
    classroom_id: parseInt(class_id)
  }))

  return studentObj
}

const getStudentObj = async (student) => {
  const errs = { err: true }

  !student.name ? (errs.name = 'Please fill name field') : null
  !student.studentNo
    ? (errs.studentNo = 'Please fill student number field')
    : null
  !student.classroom_id
    ? (errs.classroom_id = 'Please fill classroom id field')
    : null

  if (!student.name || !student.studentNo || !student.classroom_id) {
    return errs
  }
  const studentObj = {
    name: student.name,
    no: student.studentNo,
    classroom_id: parseInt(student.classroom_id)
  }

  return studentObj
}

const getCheckInOutObj = async (checkInOut) => {
  const errs = { err: true }

  !checkInOut.classroom_id
    ? (errs.classroom_id = 'Please fill classroom id field')
    : null
  !checkInOut.no ? (errs.no = 'Please fill student number field') : null

  if (!checkInOut.classroom_id || !checkInOut.no) {
    return errs
  }

  const checkInOutObj = {
    no: checkInOut.no,
    classroom_id: parseInt(checkInOut.classroom_id)
  }

  return checkInOutObj
}

module.exports = {
  getClassroomObj,
  getStudentObj,
  getCheckInOutObj,
  getStudentObjArray
}
