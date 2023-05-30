const prisma = require('../connection')
const constants = require('../utils/constants')

const getAllsStudent = async (req, res) => {
  const response = {}
  try {
    const class_id = req.query.class_id
    if (class_id) {
      // select * from student where classroom_id = class_id
      const students = await prisma.student.findMany({
        where: { classroom_id: parseInt(class_id) }
      })
      response.status = 'ok'
      response.message =
        '[ getAllsStudent ] - success get all student by class id'
      response.data = students
    } else {
      // select * from student
      const students = await prisma.student.findMany()
      response.status = 'ok'
      response.message = '[ getAllsStudent ] - success get all student'
      response.data = students
    }
  } catch (err) {
    response.status = 'error'
    response.message = `[ getAllsStudent ] - err.message`
  }
  res.json(response)
}

const getOneStudent = async (req, res) => {
  const response = {}
  try {
    // select * from student where id = id
    const student = await prisma.student.findUnique({
      where: { id: parseInt(req.params.id) }
    })
    response.status = 'ok'
    response.message = '[ getAllsStudent ] - success get one student'
    response.data = student
  } catch (err) {
    response.status = 'error'
    response.message = `[ getAllsStudent ] - ${err.message}`
  }
  res.json(response)
}

const createStudent = async (req, res) => {
  const data = await constants.getStudentObj(req.body)
  const response = {}
  try {
    if (data.err) {
      delete data.err
      response.status = 'error_inputs'
      response.errors = data
    } else {
      // insert into student (name, no, classroom_id) values (data.name, data.no, data.classroom_id)
      await prisma.student.create({ data })
      response.status = 'ok'
      response.message = '[ createStudent ] - success create student'
    }
  } catch (err) {
    response.status = 'error'
    response.message = `[ createStudent ] - ${err.message}`
  }
  res.json(response)
}

const updateStudent = async (req, res) => {
  const data = await constants.getStudentObj(req.body)
  const response = {}
  try {
    if (data.err) {
      delete data.err
      response.status = 'error_inputs'
      response.errors = data
    } else {
      // update student set name = data.name, no = data.no, classroom_id = data.classroom_id where id = data.id
      await prisma.student.update({
        where: { id: parseInt(req.params.id) },
        data
      })
      response.status = 'ok'
      response.message = '[ updateStudent ] - success update student'
    }
  } catch (err) {
    response.status = 'error'
    response.message = `[ updateStudent ] - ${err.message}`
  }
  res.json(response)
}

const deleteStudent = async (req, res) => {
  const response = {}
  try {
    // delete from student where id = id
    await prisma.student.delete({ where: { id: parseInt(req.params.id) } })
    response.status = 'ok'
    response.message = '[ deleteStudent ] - success delete student'
  } catch (err) {
    response.status = 'error'
    response.message = `[ deleteStudent ] - ${err.message}`
  }
  res.json(response)
}

const checkInStudent = async (req, res) => {
  const response = {}
  try {
    const conditions = await constants.getCheckInOutObj(req.body)
    if (conditions.err) {
      delete conditions.err
      response.status = 'error_inputs'
      response.errors = conditions
    }
    // select * from student where no = data.no and classroom_id = data.classroom_id
    const student = await prisma.student.findFirst({ where: conditions })
    if (student) {
      // update student set checkin_status = true where id = student.id
      await prisma.student.update({
        where: { id: student.id },
        data: { checkin_status: true }
      })
      response.status = 'ok'
      response.message = '[ checkInStudent ] - success checkin student'
    } else {
      response.status = 'errors'
      response.message = '[ checkInStudent ] - student not found'
    }
  } catch (err) {
    response.status = 'error'
    response.message = `[ checkInStudent ] -  ${err.message}`
  }
  res.json(response)
}
const checkOutStudent = async (req, res) => {
  const response = {}
  try {
    const conditions = await constants.getCheckInOutObj(req.body)
    if (conditions.err) {
      delete conditions.err
      response.status = 'error_inputs'
      response.errors = conditions
    }
    // select * from student where no = data.no and classroom_id = data.classroom_id
    const student = await prisma.student.findFirst({ where: conditions })
    if (student) {
      // update student set checkin_status = true where id = student.id
      await prisma.student.update({
        where: { id: student.id },
        data: { checkin_status: false }
      })
      response.status = 'ok'
      response.message = '[ checkOutStudent ] - success checkout student'
    } else {
      response.status = 'errors'
      response.message = '[ checkOutStudent ] - student not found'
    }
  } catch (err) {
    response.status = 'error'
    response.message = `[ checkOutStudent ] - ${err.message}`
  }
  res.json(response)
}

module.exports = {
  getAllsStudent,
  getOneStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  checkInStudent,
  checkOutStudent
}
