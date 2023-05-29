const prisma = require('../connection')
const constants = require('../utils/constants')

const getAllsStudent = async (req, res) => {
  const response = {
    status: '',
    message: '',
    data: null,
  }
  try {
    const class_id = req.query.class_id
    if (class_id) {
      // select * from student where classroom_id = class_id
      const students = await prisma.student.findMany({ where: { classroom_id: parseInt(class_id) } })
      response.status = '[OK] - getAllsStudent'
      response.message = 'success get all student by class id'
      response.data = students
    } else {
      // select * from student
      const students = await prisma.student.findMany()
      response.status = '[OK] - getAllsStudent'
      response.message = 'success get all student'
      response.data = students
    }
  } catch (err) {
    response.status = '[ERROR] - getAllsStudent'
    response.message = err.message
  }
  res.json(response)
}

const getOneStudent = async (req, res) => {
  const response = {
    status: '',
    message: '',
    data: null,
  }
  try {
    // select * from student where id = id
    const student = await prisma.student.findUnique({ where: { id: parseInt(req.params.id) } })
    response.status = '[OK] - getOneStudent'
    response.message = 'success get one student'
    response.data = student
  } catch (err) {
    response.status = '[ERROR] - getOneStudent'
    response.message = err.message
  }
  res.json(response)
}

const createStudent = async (req, res) => {
  const data = await constants.getStudentObj(req.body)
  const response = {
    status: '',
    message: '',
    data: null,
  }
  try {
    if (typeof data === 'string') {
      response.status = '[ERROR] - createStudent'
      response.message = data
    } else {
      // insert into student (name, no, classroom_id) values (data.name, data.no, data.classroom_id)
      await prisma.student.create({ data })
      response.status = '[OK] - createStudent'
      response.message = 'success create student'
    }
  } catch (err) {
    response.status = '[ERROR] - createStudent'
    response.message = err.message
  }
  res.json(response)
}

const updateStudent = async (req, res) => {
  const data = await constants.getStudentObj(req.body)
  const response = {
    status: '',
    message: '',
    data: null,
  }
  try {
    if (typeof data === 'string') {
      response.status = '[ERROR] - updateStudent'
      response.message = data
    } else {
      // update student set name = data.name, no = data.no, classroom_id = data.classroom_id where id = data.id
      await prisma.student.update({ where: { id: parseInt(req.params.id) }, data })
      response.status = '[OK] - updateStudent'
      response.message = 'success update student'
    }
  } catch (err) {
    response.status = '[ERROR] - updateStudent'
    response.message = err.message
  }
  res.json(response)
}

const deleteStudent = async (req, res) => {
  const response = {
    status: '',
    message: '',
    data: null,
  }
  try {
    // delete from student where id = id
    await prisma.student.delete({ where: { id: parseInt(req.params.id) } })
    response.status = '[OK] - deleteStudent'
    response.message = 'success delete student'
  } catch (err) {
    response.status = '[ERROR] - deleteStudent'
    response.message = err.message
  }
  res.json(response)
}

const checkInStudent = async (req, res) => {
  const response = {
    status: '',
    message: '',
    data: null,
  }
  try {
    const conditions = await constants.getCheckInOutObj(req.body)
    if (typeof data === 'string') {
      response.status = '[ERROR] - checkInStudent'
      response.message = conditions
    }
    // select * from student where no = data.no and classroom_id = data.classroom_id
    const student = await prisma.student.findFirst({ where: conditions })
    if (student) {
      // update student set checkin_status = true where id = student.id
      await prisma.student.update({ where: { id: student.id }, data: { checkin_status: true } })
      response.status = '[OK] - checkInStudent'
      response.message = 'success checkin student'
    } else {
      response.status = '[ERROR] - checkInStudent'
      response.message = 'student not found'
    }
  } catch (err) {
    response.status = '[ERROR] - checkInStudent'
    response.message = err.message
  }
  res.json(response)

}
const checkOutStudent = async (req, res) => {
  const response = {
    status: '',
    message: '',
    data: null,
  }
  try {
    const conditions = await constants.getCheckInOutObj(req.body)
    if (typeof data === 'string') {
      response.status = '[ERROR] - checkOutStudent'
      response.message = conditions
    }
    // select * from student where no = data.no and classroom_id = data.classroom_id
    const student = await prisma.student.findFirst({ where: conditions })
    if (student) {
      // update student set checkin_status = true where id = student.id
      await prisma.student.update({ where: { id: student.id }, data: { checkin_status: false } })
      response.status = '[OK] - checkOutStudent'
      response.message = 'success checkout student'
    } else {
      response.status = '[ERROR] - checkOutStudent'
      response.message = 'student not found'
    }
  } catch (err) {
    response.status = '[ERROR] - checkOutStudent'
    response.message = err.message
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