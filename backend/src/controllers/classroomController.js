const prisma = require('../connection')
const constants = require('../utils/constants')

const getAllsClassroom = async (req, res) => {
  const response = {}
  try {
    // select * from classroom  
    const classrooms = await prisma.classroom.findMany()
    response.status = 'ok'
    response.message = '[ getAllsClassroom  ] - success get all classroom'
    response.data = classrooms
  } catch (err) {
    response.status = 'error'
    response.message = `[ getAllsClassroom ] - ${err.message}`
  }
  res.json(response)
}

const getOneClassroom = async (req, res) => {
  const conditions = { where: { id: parseInt(req.params.id) } }
  const response = {}
  try {
    // select * from classroom where id = conditions
    const classroom = await prisma.classroom.findUnique(conditions)
    if (!classroom) {
      response.status = 'errors'
      response.message = '[ getOneClassroom ] - classroom not found'
    } else {
      response.status = 'ok'
      response.message = '[ getOneClassroom ] - success get one classroom'
      response.data = classroom
    }
  } catch (err) {
    response.status = 'error'
    response.message = `[ getOneClassroom ] - ${err.message}`
  }
  res.json(response)
}

const createClassroom = async (req, res) => {
  const data = await constants.getClassroomObj(req.body)
  const response = {}
  try {
    if (data.err) {
      delete data.err
      response.status = 'error_inputs'
      response.errors = data
    } else {
      // insert into classroom values (data.classroomOjb)
      const classroom = await prisma.classroom.create({ data: data.classroomObj })
      // get student object array with classroom id
      const students = await constants.getStudentObjArray(data.students, classroom.id)
      // insert into student values (students)
      await prisma.student.createMany({ data: students })
      response.status = 'ok'
      response.message = '[ createClassroom ] - success create classroom'
    }
  } catch (err) {
    response.status = 'error'
    response.message = `[ createClassroom ] - ${err.message}`
  }
  res.json(response)
}

const updateClassroom = async (req, res) => {
  const data = await constants.getClassroomObj(req.body)
  const response = {}
  try {
    if (data.err) {
      delete data.err
      response.status = 'error_inputs'
      response.errors = data
    } else {
      // update classroom
      const classroom = await prisma.classroom.update({
        where: { id: parseInt(req.params.id) },
        data: data.classroomObj,
      })

      // delete student 
      await prisma.student.deleteMany({
        where: {
          no: { notIn: data.students.map((student) => student.no) },
          classroom_id: classroom.id,
        }
      })
      // filter new student 
      const newStudent = data.students.filter((student) => student.id === undefined)
      const newStu = newStudent.map((student) => {
        return {
          name: student.name,
          no: student.no,
          classroom_id: classroom.id,
        }
      })
      // create new student
      await prisma.student.createMany({ data: newStu })

      response.status = 'ok'
      response.message = '[ updateClassroom ] - success update classroom'

    }
  } catch (err) {
    response.status = 'error'
    response.message = `[ updateClassroom ] - ${err.message}`
  }
  res.json(response)
}

const deleteClassroom = async (req, res) => {
  const response = {}
  try {
    // delete classroom where id = req.params.id
    await prisma.classroom.delete({ where: { id: parseInt(req.params.id) } })
    response.status = 'ok'
    response.message = '[ deleteClassroom ] - success delete classroom'
  } catch (err) {
    response.status = 'error'
    response.message = `[ deleteClassroom ] - ${err.message}`
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
