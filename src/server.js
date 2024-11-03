

import express from 'express'
import cors from 'cors';
import path from 'path'; // Thêm dòng này

import {CONECT_DB,GET_DB} from '~/config/mongodb'
import { APIs_V1 } from '~/routes/v1' // Điều chỉnh theo cấu trúc thư mục của bạn


const START_SERVER = ()=>{
  const app = express()

const hostname = 'localhost'
const port = 8017
app.use(cors());
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public'))); 

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'WellCome.html')); 
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Register.html')); 
});
app.get('/', (req, res) => {
  
  res.end('<h1>Nguyen Tan Tuan</h1><hr>')
})

app.use('/v1',APIs_V1)


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