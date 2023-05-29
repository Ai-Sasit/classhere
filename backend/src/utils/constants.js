const getClassroomObj = async (classroom) => {
    if (!classroom.name || !classroom.start || !classroom.end) {
        return 'Please fill all field'
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
        classroom_id: parseInt(class_id),
    }))

    return studentObj
}

const getStudentObj = async (student) => {
    if (!student.name || !student.studentNo || !student.classroom_id) {
        return 'Please fill all field'
    }
    const studentObj = {
        name: student.name,
        no: student.studentNo,
        classroom_id: parseInt(student.classroom_id),
    }

    return studentObj
}

const getCheckInOutObj = async (checkInOut) => {
    if (!checkInOut.no || !checkInOut.classroom_id) {
        return 'Please fill all field'
    }
    const checkInOutObj = {
        no: checkInOut.no,
        classroom_id: parseInt(checkInOut.classroom_id),
    }

    return checkInOutObj
}

module.exports = {
    getClassroomObj,
    getStudentObj,
    getCheckInOutObj,
    getStudentObjArray
}