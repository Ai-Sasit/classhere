const router = require('express').Router()
const classroom = require('../controllers/classroomController')
const student = require('../controllers/studentsController')
const qr = require('../controllers/qrController')

//! Classroom Controller Routes
router.get('/classrooms', classroom.getAllsClassroom)
router.get('/classroom/:id', classroom.getOneClassroom)
router.post('/classroom', classroom.createClassroom)
router.put('/classroom/:id', classroom.updateClassroom)
router.delete('/classroom/:id', classroom.deleteClassroom)

//! Student Controller Routes
router.get('/students', student.getAllsStudent)
router.get('/student/:id', student.getOneStudent)
router.post('/student', student.createStudent)
router.put('/student/:id', student.updateStudent)
router.delete('/student/:id', student.deleteStudent)
router.post('/checkin', student.checkInStudent)
router.post('/checkout', student.checkOutStudent)

//! QR Controller Routes
router.post('/qr', qr.createQRcodeQuota)
router.get('/qr/:id', qr.getQRcodeQuota)
router.delete('/qr/:id', qr.deleteQRcodeQuota)
router.put('/qr/:id', qr.decrementQRcodeQuota)

module.exports = router
