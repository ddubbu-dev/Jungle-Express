import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const db_username = process.env.MONGO_DB_USERNAME
const db_password = process.env.MONGO_DB_PASSWORD
const db_name = process.env.MONGO_DB_DATABASE
const uri = `mongodb+srv://${db_username}:${db_password}@express-practice.q33pr.mongodb.net/${db_name}`

const connect_db = () => mongoose.connect(uri)

export { connect_db }
