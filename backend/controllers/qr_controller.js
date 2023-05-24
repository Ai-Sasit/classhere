const prisma = require("../src/connection");

module.exports.createQRcodeQuota = (req, res, next) => {
  const { quota, classroom_id } = req.body;
  prisma.qrcode_quota
    .create({
      data: {
        quota,
        classroom_id: Number(classroom_id),
      },
    })
    .then((qrcode_quota) => {
      res.json(qrcode_quota);
    });
};

module.exports.decrementQRcodeQuota = (req, res, next) => {
  const { id } = req.params;
  prisma.qrcode_quota
    .update({
      where: { classroom_id: Number(id) },
      data: {
        quota: {
          decrement: 1,
        },
      },
    })
    .then((qrcode_quota) => {
      res.json(qrcode_quota);
    });
};

module.exports.getQRcodeQuota = (req, res, next) => {
  const { id } = req.params;
  prisma.qrcode_quota
    .findUnique({ where: { classroom_id: Number(id) } })
    .then((qrcode_quota) => {
      res.json(qrcode_quota);
    });
};

module.exports.deleteQRcodeQuota = (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "Please provide classroom id",
    });
  }
  prisma.qrcode_quota.findFirst({ where: { classroom_id: Number(id) } }).then((qr)=>{
    if(!qr){
      return res.status(400).json({
        message: "Classroom not found",
      });
    } else {
      prisma.qrcode_quota.delete({ where: { classroom_id: Number(id) } }).then((qrcode_quota) => {
        res.json(qrcode_quota);
      });
    }
  })
  
};
