import { Router, Request, Response } from 'express'
import Posts from '../schemas/post'
import { PostCreateBody } from './posts.type'

const router = Router()

router.get('/list', async (req: Request, res: Response) => {
    const result = await Posts.find()
        .select('title user_name created_at')
        .sort({ created_at: -1 })

    res.json({ data: result })
})

router.post(
    '/',
    async (req: Request<object, object, PostCreateBody>, res: Response) => {
        const { title, content, user_name, user_password } = req.body

        await Posts.create({
            title,
            user_name,
            content,
            user_pw: user_password,
        }).then(() => {
            res.status(201).send({})
        })
    }
)

export default router
