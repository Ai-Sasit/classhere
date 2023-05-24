const router = require("express").Router();
const {
  getAllsClassroom,
  getOneClassroom,
  createClassroom,
  updateClassroom,
  deleteClassroom,
} = require("../controllers/classroom_controller");

router.get("/classrooms", getAllsClassroom);
router.get("/classroom/:id", getOneClassroom);
router.post("/classroom", createClassroom);
router.put("/classroom/:id", updateClassroom);
router.delete("/classroom/:id", deleteClassroom);

module.exports = router;
