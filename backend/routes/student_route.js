const router = require("express").Router();
const {
  getAllsStudent,
  getOneStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  checkInStudent,
  checkOutStudent,
} = require("../controllers/students_controller");

router.get("/students", getAllsStudent);
router.get("/student/:id", getOneStudent);
router.post("/student", createStudent);
router.put("/student/:id", updateStudent);
router.delete("/student/:id", deleteStudent);
router.post("/checkin", checkInStudent);
router.post("/checkout", checkOutStudent);

module.exports = router;
