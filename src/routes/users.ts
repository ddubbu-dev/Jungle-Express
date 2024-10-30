import { Router, Request, Response } from 'express'
import UserModel from '../schemas/user'
import { UserSignInBody, UserSignUpBody } from './users.tpye'
import { validateField } from '../utils/validate'
import { encryptPassword } from '../utils/encrypt'

const router = Router()

router.post(
    '/sign-in',
    async (req: Request<object, object, UserSignInBody>, res: Response) => {
        const { nickname, password } = req.body

        const encrypted = await encryptPassword(password)
        const user = await UserModel.findOne({
            name: nickname,
            hashed_pw: encrypted,
        })

        if (!user)
            res.status(400).json({
                msg: '닉네임 또는 패스워드를 확인해주세요.',
            })
        else {
            // TODO: JWT
            res.status(200).json({
                data: {
                    accessToken: 'accessToken',
                    refreshToken: 'refreshToken',
                },
            })
        }
    }
)

router.post(
    '/sign-up',
    async (
        req: Request<object, object, UserSignUpBody>,
        res: Response
    ): Promise<void> => {
        const { nickname, password, password_confirm } = req.body

        if (password != password_confirm) {
            res.status(400).json({ msg: '비밀번호/확인 불일치' })
            return
        }

        const encrypted = await encryptPassword(password)
        const newUser = new UserModel({
            name: nickname,
            hashed_pw: encrypted,
        })

        try {
            await newUser.validate()
        } catch (err) {
            res.status(400).json({ msg: err })
        }

        const nicknameValid = validateField('nickname', nickname)
        const passwordValid = validateField('password', {
            password: encrypted,
            nickname,
        })

        if (!nicknameValid.valid)
            res.status(400).json({ msg: nicknameValid.msg })
        else if (!passwordValid.valid)
            res.status(400).json({ msg: passwordValid.msg })
        else {
            try {
                const user = await UserModel.findOne({ name: nickname })
                if (user) res.status(409).json({ msg: '중복된 닉네임입니다' })
                else {
                    await newUser.save()
                    res.status(201).send({})
                }
            } catch (e) {
                res.status(500).json({ msg: '서버 오류' })
            }
        }
    }
)

export default router