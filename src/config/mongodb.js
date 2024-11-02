// tantuan0162
// nguyentantuan
const MOGODB_url = 'mongodb+srv://tantuan0162:nguyentantuan@cluster0-nguyentantuan.juvxz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0-nguyentantuan'
const DATABASE_NAME ='GearShop_database_nguyentantuan'
import{MongoClient,ServerApiVersion} from 'mongodb'

let trelloDatabaseInstance = null

const mongoClientInstance = new MongoClient(MOGODB_url,{
    serverApi:{
        version : ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})
export const CONECT_DB = async () =>{
    await mongoClientInstance.connect()
    trelloDatabaseInstance = mongoClientInstance.db(DATABASE_NAME)
}
export const GET_DB = () =>{
    if(!trelloDatabaseInstance) throw new console.error('Must conect to database first');
    return trelloDatabaseInstance
}