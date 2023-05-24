const express = require("express");
const cors = require("cors");
const UserRoute = require("../routes/user_route");
const classroomRoute = require("../routes/classroom_route");
const studentRoute = require("../routes/student_route");
const qrRoute = require("../routes/qr_route");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", UserRoute);
app.use("/api", classroomRoute);
app.use("/api", studentRoute);
app.use("/api", qrRoute);

const server = app.listen(8080, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/js/rest-express#3-using-the-rest-api`)
);
