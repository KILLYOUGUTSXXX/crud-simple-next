const path = require('path')
const jsonServer = require('json-server')
const moment = require('moment')
const server = jsonServer.create()
const router = jsonServer.router(path.resolve(__dirname) + '/../data/db.json')
const middlewares = jsonServer.defaults()
const UniqueId = require('short-unique-id')

const times = moment().unix()

server.use(middlewares)

const UUID_CASH = new UniqueId({ length: 12 })
const UUID_CASHDETAIL = new UniqueId({ length: 16 })

server.use(jsonServer.bodyParser)

server.post('/bulk/cash-entry', (req, res) => {
  let { details = [], header } = req.body
  
  header = {
    ...header,
    id: UUID_CASH(),
    status: true,
    createdat: times,
    updatedat: null
  }
  try {
    router.db.get('cash-entry').push(header).write()

    const cashEntryDetail = router.db.get('cash-entry-detail')
    for(let x in (details || [])) {
      cashEntryDetail.push({
        ...details[x],
        id: UUID_CASHDETAIL(),
        refid: header.id,
        createdat: times,
        updatedat: null
      }).write()
    }
    

    return res.status(200).json({ message: 'OK' })
  } catch (er) {
    return res.status(400).json({ message: 'Failed' })
  }
})

server.put('/bulk/cash-entry/:ids', (req, res, next) => {
  const headerid = req.params.ids
  const { details = [], header } = req.body
  const times = moment().unix()
  
  const cashEntry = router.db.get('cash-entry')
  const cashEntryDetail = router.db.get('cash-entry-detail')

  const currentHeader = cashEntry.getById(headerid).value()

  cashEntry.updateById(headerid, { ...currentHeader, ...header, updatedat: times }).write()

  cashEntryDetail.remove({ refid: headerid }).write()

  for(let x in (details || [])) {
    const items = details[x]
    cashEntryDetail.push({
      ...items,
      id: typeof items.id === 'string' ? items.id : UUID_CASHDETAIL(),
      refid: headerid,
      createdat: typeof items.createdat === 'number' ? items.createdat : times,
      updatedat: times
    }).write()
  }
  
  return res.status(200).json({ message: 'OK' })
})



server.use(router)
server.listen(5544, () => {
  console.log('JSON Server is running')
})