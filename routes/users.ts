import { Router, Request, Response } from 'express'
import UserModel from '../schemas/user'
import { UserPostBody } from './users.tpye'
import { validateField } from '../utils/validate'

const router = Router()

router.post(
    '/sign-up',
    async (req: Request<object, object, UserPostBody>, res: Response) => {
        const { nickname, password, password_confirm } = req.body

        const newUser = new UserModel({
            name: nickname,
            hashed_pw: password,
        })

        try {
            await newUser.validate()
        } catch (err) {
            res.status(400).json({ msg: err })
        }

        const nicknameValid = validateField('nickname', nickname)
        const passwordValid = validateField('password', { password, nickname })

        if (!nicknameValid.valid)
            res.status(400).json({ msg: nicknameValid.msg })
        else if (!passwordValid.valid)
            res.status(400).json({ msg: passwordValid.msg })
        else if (password != password_confirm)
            res.status(400).json({ msg: '비밀번호/확인 불일치' })
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
