const prisma = require('../connection')

const createQRcodeQuota = async (req, res) => {
  const { classroom_id, quota } = req.body
  const response = {
    status: '',
    message: '',
    data: null,
  }
  try {
    // insert into qrcode_quota (classroom_id, quota) values (classroom_id, quota)
    await prisma.qrcode_quota.create({ data: { classroom_id: parseInt(classroom_id), quota } })
    response.status = '[OK] - createQRcodeQuota'
    response.message = 'success create qrcode quota'
  }
  catch (err) {
    response.status = '[ERROR] - createQRcodeQuota'
    response.message = err.message
  }
  res.json(response)
}

const decrementQRcodeQuota = async (req, res) => {
  const response = {
    status: '',
    message: '',
    data: null,
  }
  try {
    // update qrcode_quota set quota = quota - 1 where classroom_id = id
    await prisma.qrcode_quota.update({
      where: { classroom_id: parseInt(req.params.id) },
      data: { quota: { decrement: 1 } },
    })
    response.status = '[OK] - decrementQRcodeQuota'
    response.message = 'success decrement qrcode quota'
  } catch (err) {
    response.status = '[ERROR] - decrementQRcodeQuota'
    response.message = err.message
  }
  res.json(response)
}

const getQRcodeQuota = async (req, res) => {
  const response = {
    status: '',
    message: '',
    data: null,
  }
  try {
    // select * from qrcode_quota where classroom_id = id
    const qrcode_quota = await prisma.qrcode_quota.findFirst({ where: { classroom_id: parseInt(req.params.id) } })
    response.status = '[OK] - getQRcodeQuota'
    response.message = 'success get qrcode quota'
    response.data = qrcode_quota
  } catch (err) {
    response.status = '[ERROR] - getQRcodeQuota'
    response.message = err.message
  }
  res.json(response)
}

const deleteQRcodeQuota = async (req, res) => {
  const response = {
    status: '',
    message: '',
    data: null,
  }

  try {
    // select * from qrcode_quota where classroom_id = id
    const qrcode_quota = await prisma.qrcode_quota.findFirst({ where: { classroom_id: parseInt(req.params.id) } })
    if (!qrcode_quota) {
      response.status = '[ERROR] - deleteQRcodeQuota'
      response.message = 'qrcode quota not found'
    } else {
      // delete from qrcode_quota where classroom_id = id
      await prisma.qrcode_quota.delete({ where: { classroom_id: parseInt(req.params.id) } })
      response.statusCode = 200
      response.status = '[OK] - deleteQRcodeQuota'
      response.message = 'success delete qrcode quota'
    }
  } catch (err) {
    response.status = '[ERROR] - deleteQRcodeQuota'
    response.message = err.message
  }
  res.json(response)
}

module.exports = {
  createQRcodeQuota,
  decrementQRcodeQuota,
  getQRcodeQuota,
  deleteQRcodeQuota,
}
