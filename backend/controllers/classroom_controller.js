const prisma = require("../src/connection");

module.exports.getAllsClassroom = function (req, res) {
  prisma.classroom.findMany().then((classrooms) => {
    res.json(classrooms);
  });
};

module.exports.getOneClassroom = function (req, res) {
  const { id } = req.params;
  prisma.classroom
    .findUnique({ where: { id: Number(id) } })
    .then((classroom) => {
      res.json(classroom);
    });
};

module.exports.createClassroom = function (req, res) {
  const { name, number_of_students, students, start, end } = req.body;
  prisma.classroom
    .create({
      data: {
        name,
        number_of_students: Number(number_of_students),
        start_time: start,
        end_time: end,
      },
    })
    .then((classroom) => {
      prisma.student
        .createMany({
          data: students.map((student) => ({
            name: student.name,
            no: student.studentNo,
            classroom_id: classroom.id,
          })),
        })
        .then((students) => {
          res.json({ classroom, students });
        })
        .catch((err) => {
          res.json({ classroom, err });
        });
    })
    .catch((err) => {
      res.json({ err });
    });
};

module.exports.updateClassroom = function (req, res) {
  const { id } = req.params;
  const { name, number_of_students, students, start, end } = req.body;
  prisma.classroom
    .update({
      where: { id: Number(id) },
      data: {
        name,
        number_of_students: Number(number_of_students),
        start_time: start,
        end_time: end,
      },
    })
    .then((classroom) => {
      prisma.student
        .deleteMany({
          where: {
            classroom_id: classroom.id,
          },
        })
        .then(() => {
          prisma.student
            .createMany({
              data: students.map((student) => ({
                name: student.name,
                no: student.no,
                classroom_id: classroom.id,
              })),
            })
            .then((students) => {
              res.json({ classroom, students });
            })
            .catch((err) => {
              res.json({ classroom, err });
            });
        })
        .catch((err) => {
          res.json({ classroom, err });
        });
    });
};

module.exports.deleteClassroom = function (req, res) {
  const { id } = req.params;
  prisma.classroom
    .delete({
      where: { id: Number(id) },
    })
    .then((classroom) => {
      res.json(classroom);
    });
};
