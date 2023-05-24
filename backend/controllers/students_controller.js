const prisma = require("../src/connection");

module.exports.getAllsStudent = function (req, res) {
  const class_id = req.query.class_id;
  if (class_id) {
    prisma.student
      .findMany({
        where: {
          classroom_id: Number(class_id),
        },
      })
      .then((students) => {
        res.json(students);
      });
  } else {
    prisma.student.findMany().then((students) => {
      res.json(students);
    });
  }
};

module.exports.getOneStudent = function (req, res) {
  const { id } = req.params;
  prisma.student.findUnique({ where: { id: Number(id) } }).then((student) => {
    res.json(student);
  });
};

module.exports.createStudent = function (req, res) {
  const { name, no, classroom_id } = req.body;
  prisma.student
    .create({
      data: {
        name,
        no,
        classroom_id: Number(classroom_id),
      },
    })
    .then((student) => {
      res.json(student);
    });
};

module.exports.updateStudent = function (req, res) {
  const { id } = req.params;
  const { name, no, classroom_id } = req.body;
  prisma.student
    .update({
      where: { id: Number(id) },
      data: {
        name,
        no,
        classroom_id: Number(classroom_id),
      },
    })
    .then((student) => {
      res.json(student);
    });
};

module.exports.deleteStudent = function (req, res) {
  const { id } = req.params;
  prisma.student
    .delete({
      where: { id: Number(id) },
    })
    .then((student) => {
      res.json(student);
    });
};

module.exports.checkInStudent = function (req, res) {
  const { no, classroom_id } = req.body;
  prisma.student
    .findFirst({
      where: {
        no: no,
        classroom_id: Number(classroom_id),
      },
    })
    .then((student) => {
      prisma.student
        .update({
          where: {
            id: student.id,
          },
          data: {
            checkin_status: true,
          },
        })
        .then((result) => {
          res.json(result);
        });
    });
};

module.exports.checkOutStudent = function (req, res) {
  const { no, classroom_id } = req.body;
  prisma.student
    .findFirst({
      where: {
        no: no,
        classroom_id: Number(classroom_id),
      },
    })
    .then((student) => {
      prisma.student
        .update({
          where: {
            id: student.id,
          },
          data: {
            checkin_status: false,
          },
        })
        .then((result) => {
          res.json(result);
        });
    });
};
