const prisma = require('../src/connection')

module.exports.getAllsClassroom = function (req, res) {
  prisma.classroom.findMany().then((classrooms) => {
    res.json(classrooms);
  });
}

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
  console.log(req.body);
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

module.exports.updateClassroom =  async (req, res) => {
  const { id } = req.params;
  const { classroomOjb, getStudentObj } = await getClassroomObj(req.body)

  const classroom = await prisma.classroom.find({ where:{ id: Number(id) } })
  classroom.update({ data: classroomOjb })
  
  // remove students unuse
  await prisma.student.deleteMany({ where: { classroom_id: classroom.id } })

  // const { name, number_of_students, students, start, end } = req.body;
  // prisma.classroom
  //   .update({
  //     where: { id: Number(id) },
  //     data: await getClassroomObj(),
  //   })
  //   .then((classroom) => {
  //     prisma.student
  //       .deleteMany({
  //         where: {
  //           classroom_id: classroom.id,
  //         },
  //       })
  //       .then(() => {
  //         prisma.student
  //           .createMany({
  //             data: students.map((student) => ({
  //               name: student.name,
  //               no: student.no,
  //               classroom_id: classroom.id,
  //             })),
  //           })
  //           .then((students) => {
  //             res.json({ classroom, students });
  //           })
  //           .catch((err) => {
  //             res.json({ classroom, err });
  //           });
  //       })
  //       .catch((err) => {
  //         res.json({ classroom, err });
  //       });
  //   });
};

const getClassroomObj = async (classroom) => {
  if (!classroom) {
    return null
  }
  const classroomOjb = {
    name: classroom.name,
    number_of_students: Number(classroom.number_of_students),
    start_time: classroom.start_time,
    end_time: classroom.end_time
  }

  const students = getStudentObj(classroom.students)

  return {classroomOjb, students}
}

const getStudentObj = async (students) => {
  const studentObj = students.map((student) => ({
    name: student.name,
    no: student.no,
    classroom_id: classroom.id,
  }))

  return studentObj
}

const deleteClassroom = async (req, res) => {
  const { id } = req.params
  const response = {
    status: 'error',
    msg: null
  }

  try {
    await prisma.classroom.delete({ where: { id: Number(id) }})
    response.status = 'ok'
    response.msg = 'deleted success!!'
  } catch (error) {
    response.msg = `[ERROR - deleteClassroom] msg: ${error.msg} `
  }

  res.json(response)
}

module.exports = {
  deleteClassroom
}
