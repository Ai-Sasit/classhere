const router = require("express").Router();

const {
  createQRcodeQuota,
  getQRcodeQuota,
  deleteQRcodeQuota,
  decrementQRcodeQuota,
} = require("../controllers/qr_controller");

router.post("/qr", createQRcodeQuota);
router.get("/qr/:id", getQRcodeQuota);
router.delete("/qr/:id", deleteQRcodeQuota);
router.put("/qr/:id", decrementQRcodeQuota);

module.exports = router;
