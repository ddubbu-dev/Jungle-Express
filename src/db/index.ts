import dotenv from 'dotenv'
import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Post, User } from '../models'
dotenv.config()

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_MYSQL_HOST,
    port: 3306,
    username: process.env.DB_MYSQL_USERNAME,
    password: process.env.DB_MYSQL_PASSWORD,
    database: process.env.DB_MYSQL_DB_NAME,
    // synchronize: true,
    // logging: false,
    entities: [Post, User],
    migrations: ['./src/db/migrations/*.ts'],
})

const userRepository = AppDataSource.getRepository(User)
const postRepository = AppDataSource.getRepository(Post)

export const repository = {
    user: userRepository,
    post: postRepository,
}

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!')
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err)
    })
