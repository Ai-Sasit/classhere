const prisma = require('../connection')
const helper = require('../utils/helper')

const getAllClassroom = async (req, res) => {
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

const getClassroom = async (req, res) => {
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
  const data = await helper.getClassroomObj(req.body)
  const response = {}
  try {
    if (data.err) {
      delete data.err
      response.status = 'error_inputs'
      response.errors = data
    } else {
      await prisma.$transaction(async (tx) => {
        // create classroom
        const classroom = await tx.classroom.create({
          data: data.classroomObj
        })
        // create students
        const students = await helper.getStudentObjArray(
          data.students,
          classroom.id
        )
        await tx.student.createMany({ data: students })
      })
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
  const data = await helper.getClassroomObj(req.body)
  const id = parseInt(req.params.id)
  const response = {}
  try {
    if (data.err) {
      delete data.err
      response.status = 'error_inputs'
      response.errors = data
    } else {
      // filter new student
      const newStudent = data.students.filter(
        (student) => student.id === undefined
      )
      const newStu = await helper.getStudentObjArray(newStudent, id)

      await prisma.$transaction(async (tx) => {
        // update classroom
        await tx.classroom.update({
          where: { id: parseInt(req.params.id) },
          data: data.classroomObj
        })
        // delete students
        await tx.student.deleteMany({
          where: {
            no: { notIn: data.students.map((student) => student.no) },
            classroom_id: id
          }
        })
        // create new students
        await tx.student.createMany({ data: newStu })
      })
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
  getAllClassroom,
  deleteClassroom,
  getClassroom,
  createClassroom,
  updateClassroom
}
