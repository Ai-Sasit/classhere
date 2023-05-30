const prisma = require('../connection')

const createQRcodeQuota = async (req, res) => {
  const { classroom_id, quota } = req.body
  const response = {}
  const err = {}

  !classroom_id ? (err.classroom_id = 'Please fill classroom_id field') : null
  !quota ? (err.quota = 'Please fill quota field') : null

  if (!classroom_id || !quota) {
    res.json({ status: 'error_inputs', errors: err })
  } else {
    try {
      // insert into qrcode_quota (classroom_id, quota) values (classroom_id, quota)
      await prisma.qrcode_quota.create({
        data: { classroom_id: parseInt(classroom_id), quota }
      })
      response.status = 'ok'
      response.message = '[ createQRcodeQuota ] - success create qrcode quota'
    } catch (err) {
      response.status = 'error'
      response.message = `[ createQRcodeQuota ] - ${err.message}`
    }
    res.json(response)
  }
}

const decrementQRcodeQuota = async (req, res) => {
  const response = {}

  try {
    // update qrcode_quota set quota = quota - 1 where classroom_id = id
    await prisma.qrcode_quota.update({
      where: { classroom_id: parseInt(req.params.id) },
      data: { quota: { decrement: 1 } }
    })
    response.status = 'ok'
    response.message =
      '[ decrementQRcodeQuota ] - success decrement qrcode quota'
  } catch (err) {
    response.status = 'error'
    response.message = `[ decrementQRcodeQuota ] - ${err.message}`
  }
  res.json(response)
}

const getQRcodeQuota = async (req, res) => {
  const response = {}
  try {
    // select * from qrcode_quota where classroom_id = id
    const qrcode_quota = await prisma.qrcode_quota.findFirst({
      where: { classroom_id: parseInt(req.params.id) }
    })
    response.status = 'ok'
    response.message = '[ getQRcodeQuota ] - success get qrcode quota'
    response.data = qrcode_quota
  } catch (err) {
    response.status = 'error'
    response.message = `[ getQRcodeQuota ] - ${err.message}`
  }
  res.json(response)
}

const deleteQRcodeQuota = async (req, res) => {
  const response = {}

  try {
    // select * from qrcode_quota where classroom_id = id
    const qrcode_quota = await prisma.qrcode_quota.findFirst({
      where: { classroom_id: parseInt(req.params.id) }
    })
    if (!qrcode_quota) {
      response.status = 'errors'
      response.message = '[ deleteQRcodeQuota ] - qrcode quota not found'
    } else {
      // delete from qrcode_quota where classroom_id = id
      await prisma.qrcode_quota.delete({
        where: { classroom_id: parseInt(req.params.id) }
      })
      response.statusCode = 200
      response.status = 'ok'
      response.message = '[ deleteQRcodeQuota ] - success delete qrcode quota'
    }
  } catch (err) {
    response.status = 'error'
    response.message = `[ deleteQRcodeQuota ] - ${err.message}`
  }
  res.json(response)
}

module.exports = {
  createQRcodeQuota,
  decrementQRcodeQuota,
  getQRcodeQuota,
  deleteQRcodeQuota
}
