const prisma = require('../connection')
const constants = require('../utils/constants')

const getAllsClassroom = async (req, res) => {
  const response = {
    status: '',
    message: '',
    data: null,
  }
  try {
    // select * from classroom  
    const classrooms = await prisma.classroom.findMany()
    response.status = '[OK] - getAllsClassroom'
    response.message = 'success get all classroom'
    response.data = classrooms
  } catch (err) {
    response.status = '[ERROR] - getAllsClassroom'
    response.message = err.message
  }
  res.json(response)
}

const getOneClassroom = async (req, res) => {
  const conditions = { where: { id: parseInt(req.params.id) } }
  const response = {
    status: '',
    message: '',
    data: null,
  }
  try {
    // select * from classroom where id = conditions
    const classroom = await prisma.classroom.findUnique(conditions)
    response.status = '[OK] - getOneClassroom'
    response.message = 'success get one classroom'
    response.data = classroom
  } catch (err) {
    response.status = '[ERROR] - getOneClassroom'
    response.message = err.message
  }
  res.json(response)
}

const createClassroom = async (req, res) => {
  const data = await constants.getClassroomObj(req.body)
  const response = {
    status: '',
    message: '',
    data: null,
  }
  try {
    if (typeof data === 'string') {
      response.status = '[ERROR] - createClassroom'
      response.message = data
    } else {
      // insert into classroom values (data.classroomOjb)
      const classroom = await prisma.classroom.create({ data: data.classroomObj })
      // get student object array with classroom id
      const students = await constants.getStudentObjArray(data.students, classroom.id)
      // insert into student values (students)
      await prisma.student.createMany({ data: students })
      response.status = '[OK] - createClassroom'
      response.message = 'success create classroom'
    }
  } catch (err) {
    response.status = '[ERROR] - createClassroom'
    response.message = err.message
  }
  res.json(response)
}

const updateClassroom = async (req, res) => {
  const { classroomObj, students } = await constants.getClassroomObj(req.body)
  const response = {
    status: '',
    message: '',
    data: null,
  }
  try {
    // update classroom
    const classroom = await prisma.classroom.update({
      where: { id: parseInt(req.params.id) },
      data: classroomObj,
    })
    // delete student 
    await prisma.student.deleteMany({
      where: {
        no: { notIn: students.map((student) => student.no) },
        classroom_id: classroom.id,
      }
    })
    // filter new student 
    const newStudent = students.filter((student) => student.id === undefined)
    const data = newStudent.map((student) => {
      return {
        name: student.name,
        no: student.no,
        classroom_id: classroom.id,
      }
    })
    // create new student
    await prisma.student.createMany({ data: data })

    response.status = '[OK] - updateClassroom'
    response.message = 'success update classroom'
  } catch (err) {
    response.status = '[ERROR] - updateClassroom'
    response.message = err.message
  }
  res.json(response)
}

const deleteClassroom = async (req, res) => {
  const response = {
    status: '',
    message: '',
    data: null,
  }
  try {
    // delete classroom where id = req.params.id
    await prisma.classroom.delete({ where: { id: parseInt(req.params.id) } })
    response.status = '[OK] - deleteClassroom'
    response.message = 'success delete classroom'
  } catch (err) {
    response.status = '[ERROR] - deleteClassroom'
    response.message = err.message
  }
  res.json(response)
}

module.exports = {
  getAllsClassroom,
  deleteClassroom,
  getOneClassroom,
  createClassroom,
  updateClassroom,
}
