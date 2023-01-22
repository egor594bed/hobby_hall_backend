const {Router} = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()
const config = require('config')

module.exports = router;

router.post(
    '/register',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длинна пароля 6 символов').isLength({min: 6}),
    ],
    async (req, res) => {
    try {
        
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при регистрации'
            })
        } 

        const {email, password, name, phone} = req.body;

        //Переделать запросы ниже ???
        const checkEmail = await User.findOne({ email })
        const checkPhone = await User.findOne({ phone })

        if (checkEmail || checkPhone) {
            res.status(400).json({message: 'Пользователь с таким Email или номером телефона уже существует'})
        }

        const hashedPassword = await bcrypt.hash(password, 5)
        const user = new User({email, password: hashedPassword, name, phone})

        await user.save()

        return res.status(201).json({message: 'Регистрация прошла успешно!'})

    } catch (e) {
        return res.status(500).json({message: 'Что-то пошло не так'})
    }
})

router.post(
    '/login',
    [
        check('email', 'Введите корректный Email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists(),
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при входе в систему'
            })
        }
        
        const {email, password} = req.body;

        const user = await User.findOne({email})

        if (!user) {
            return res.status(404).json ({message: 'Неверный email или пароль'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({message: 'Неверный email или пароль'})
        }

        const token = jwt.sign(
            { userId: user.id, userName: user.name, userPhone: user.phone },
            config.jwtSecret,
            {expiresIn: '1h'}
        )
        
        res.status(200).json({token, userId: user.id, userName: user.name, userPhone: user.phone, message: `Добро пожаловать, ${user.name}!`})

    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так'})
    }
    
})