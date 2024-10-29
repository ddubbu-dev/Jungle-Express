import mongoose from 'mongoose'

const db_username = process.env.MONGO_DB_USERNAME
const db_password = process.env.MONGO_DB_PASSWORD
const uri = `mongodb+srv://${db_username}:${db_password}@express-practice.q33pr.mongodb.net/?retryWrites=true&w=majority&appName=express-practice`

const connect_db = () => mongoose.connect(uri)

export { connect_db }
