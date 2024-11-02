

import express from 'express'
import {CONECT_DB,GET_DB} from '~/config/mongodb'

const START_SERVER = ()=>{
  const app = express()

const hostname = 'localhost'
const port = 8017

app.get('/', (req, res) => {
  // Test Absolute import mapOrder
  
  res.end('<h1>Nguyen Tan Tuan</h1><hr>')
})

app.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`Hello Nguyen Tan Tuan, I am running at http://${ hostname }:${ port }/`)
})
}
CONECT_DB()
.then(() => console.log('Connected to database'))
.then(()=> START_SERVER())
.catch(error=>{
  console.error(error)
  process.exit(0)
});
