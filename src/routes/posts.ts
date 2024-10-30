import { Router, Request, Response } from 'express'
import { repository } from '../db'
import { PostCreateBody, PostDeleteBody, PostUpdateBody } from './posts.type'
import { comparePasswords } from '../utils/encrypt'
import { validateAuth } from '../middleware/auth'

const router = Router()

router.get('/list', async (req: Request, res: Response) => {
    const result = await repository.post.find({
        select: ['title', 'created_at'],
        relations: ['user'],
        order: { created_at: 'DESC' },
    })

    const formattedResult = result.map((post) => ({
        title: post.title,
        nickname: post.user.name,
        created_at: post.created_at,
    }))

    res.json({ data: formattedResult })
})

router.get('/:post_id', async (req: Request, res: Response): Promise<void> => {
    const { post_id } = req.params

    const post = await repository.post.findOne({
        where: { id: Number(post_id) },
        relations: ['user'],
    })

    if (!post) {
        res.status(404).json({ message: '게시글을 찾을 수 없어요' })
        return
    }

    res.status(200).json({
        title: post.title,
        content: post.content,
        nickname: post.user?.name ?? '탈퇴 유저',
        created_at: post.created_at,
    })
})

router.post(
    '/',
    validateAuth,
    async (
        req: Request<object, object, PostCreateBody>,
        res: Response
    ): Promise<void> => {
        const { title, content } = req.body
        const user_id = req.user_id

        const existingUser = await repository.user.findOne({
            where: { id: user_id },
        })

        if (!existingUser) {
            res.status(404).json({ message: '미가입 유저에요' })
            return
        }

        const newPost = repository.post.create({
            title,
            content,
            user: existingUser,
        })

        try {
            await repository.post.save(newPost)
            res.status(201).json({
                id: newPost.id,
                title,
                content,
                user_name: existingUser.name,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: '서버 오류' })
        }
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
        } else if (!post.user) {
            res.status(404).json({ message: '미가입 유저에요' })
            return
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
        } else if (!post.user) {
            res.status(404).json({ message: '미가입 유저에요' })
            return
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
