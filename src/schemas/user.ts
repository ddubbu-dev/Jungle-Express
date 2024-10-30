import mongoose from 'mongoose'

const userScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    hashed_pw: {
        type: String,
        required: true,
    },
    created_at: { type: Date, default: Date.now },
})

export default mongoose.model('users', userScheme)
