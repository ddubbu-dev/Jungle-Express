import { Router, Request, Response } from 'express'
import { repository } from '../db'
import { PostCreateBody, PostDeleteBody, PostUpdateBody } from './posts.type'
import { comparePasswords, encryptPassword } from '../utils/encrypt'

const router = Router()

router.get('/list', async (req: Request, res: Response) => {
    const result = await repository.post.find({
        select: ['title', 'user', 'created_at'],
        relations: ['user'],
        order: { created_at: 'DESC' },
    })

    res.json({ data: result })
})

router.get('/:post_id', async (req: Request, res: Response): Promise<any> => {
    const { post_id } = req.params

    const post = await repository.post.findOne({
        where: { id: Number(post_id) },
        relations: ['user'],
    })

    if (!post) {
        return res.status(404).json({ message: '게시글을 찾을 수 없어요' })
    }

    return res.status(200).json({
        title: post.title,
        content: post.content,
        user_name: post?.user?.name ?? '탈퇴 유저',
        created_at: post.created_at,
    })
})

router.post(
    '/',
    async (
        req: Request<object, object, PostCreateBody>,
        res: Response
    ): Promise<void> => {
        const { title, content, user_name, user_password } = req.body

        // TODO: 로그인 유저 token으로 발급되도록
        const existingUser = await repository.user.findOne({
            where: { name: user_name },
        })
        if (!existingUser) {
            res.status(404).json({ message: '미가입 유저에요' })
            return
        }

        const encrypted_pw = await encryptPassword(user_password)
        const newPost = repository.post.create({
            title,
            content,
            user: { name: user_name, hashed_pw: encrypted_pw },
        })

        await repository.post.save(newPost)
        res.status(201).json({ id: newPost.id })
    }
)

router.delete(
    '/',
    async (
        req: Request<object, object, PostDeleteBody>,
        res: Response
    ): Promise<any> => {
        const { user_password, post_id } = req.body

        const post = await repository.post.findOne({
            where: { id: Number(post_id) },
            relations: ['user'], // user 관계 로딩
        })

        if (!post) {
            return res.status(404).json({ message: '게시글을 찾을 수 없어요' })
        }

        const valid = await comparePasswords(user_password, post.user.hashed_pw)
        if (!valid) {
            return res
                .status(401)
                .json({ message: '비밀번호 입력을 확인해주세요' })
        }

        await repository.post.delete(post.id)
        res.json({})
    }
)

router.put(
    '/',
    async (
        req: Request<object, object, PostUpdateBody>,
        res: Response
    ): Promise<any> => {
        const { user_password, post_id, title, content } = req.body

        const post = await repository.post.findOne({
            where: { id: Number(post_id) },
            relations: ['user'],
        })

        if (!post) {
            return res.status(404).json({ message: '게시글을 찾을 수 없어요' })
        }

        const valid = await comparePasswords(user_password, post.user.hashed_pw)
        if (!valid) {
            return res
                .status(401)
                .json({ message: '비밀번호 입력을 확인해주세요' })
        }

        post.title = title
        post.content = content
        await repository.post.save(post)

        res.json({})
    }
)

export default router
