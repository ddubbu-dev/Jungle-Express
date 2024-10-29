import { Schema, model, connect } from 'mongoose'

const db_username = process.env.MONGO_DB_USERNAME
const db_password = process.env.MONGO_DB_PASSWORD
const uri = `mongodb+srv://${db_username}:${db_password}@express-practice.q33pr.mongodb.net/?retryWrites=true&w=majority&appName=express-practice`

// 1. Create an interface representing a document in MongoDB.
interface IUser {
    name: string
    email: string
    avatar?: string
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: String,
})

// 3. Create a Model.
const User = model<IUser>('User', userSchema)

async function db_test() {
    await connect(uri)

    const user = new User({
        name: 'Bill',
        email: 'bill@initech.com',
        avatar: 'https://i.imgur.com/dM7Thhn.png',
    })
    await user.save()

    console.log(user.email) // 'bill@initech.com'
}

export { db_test }
