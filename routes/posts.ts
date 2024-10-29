import { Router, Request, Response } from 'express'
import Posts from '../schemas/post'
import { PostCreateBody, PostDeleteBody, PostUpdateBody } from './posts.type'

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
        }).then((post) => {
            res.status(201).json({ id: post.id })
        })
    }
)

router.delete(
    '/',
    async (
        req: Request<object, object, PostDeleteBody>,
        res: Response
    ): Promise<any> => {
        const { user_password, post_id } = req.body

        const post = await Posts.findById(post_id)

        if (!post)
            return res.status(404).json({ message: '게시글을 찾을 수 없어요' })

        // TODO: await bcrypt.compare(user_password, post.user_pw)
        if (post.user_pw != user_password)
            return res
                .status(401)
                .json({ message: '비밀번호 입력을 확인해주세요' })

        return post
            .deleteOne()
            .then(() => res.json({}))
            .catch(() => res.status(500).json({ message: '서버 에러' }))
    }
)

router.put(
    '/',
    async (
        req: Request<object, object, PostUpdateBody>,
        res: Response
    ): Promise<any> => {
        const { user_password, post_id, title, content } = req.body

        const post = await Posts.findById(post_id)

        if (!post)
            return res.status(404).json({ message: '게시글을 찾을 수 없어요' })

        // TODO: await bcrypt.compare(user_password, post.user_pw)
        if (post.user_pw != user_password)
            return res
                .status(401)
                .json({ message: '비밀번호 입력을 확인해주세요' })

        return post
            .updateOne({ title, content })
            .then(() => res.json({}))
            .catch(() => res.status(500).json({ message: '서버 에러' }))
    }
)

export default router
