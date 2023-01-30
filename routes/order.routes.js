const {Router} = require('express')
const Order = require('../models/Order')
const User = require('../models/User')
const router = Router()

router.post(
    '/newOrder',
    async (req, res) => {
    try {
        const {userId, basketArr, comment, data, deliveryId, paymentId, state} = req.body

        const user = await User.findOne({_id: userId})
        user.password = undefined

        //deliveryId и paymentId заменить на название, когда добавлю их в базу???
        const newOrder = {
            user: user,
            productsArr: basketArr,
            clientComment: comment,
            data: data,
            deliveryId: deliveryId,
            paymentId: paymentId,
            state: state
        }
        const order = new Order(newOrder)
        await order.save()


        res.status(201).json({message: `Заказ добавлен`})
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так'})
    }
})

router.post(
    '/changeOrder',
    async (req, res) => {
    try {
        const {orderId, state, orderComment} = req.body

        await Order.findOneAndUpdate({_id: orderId}, {
            state: state,
            comment: orderComment
        })

        res.status(201).json({message: `Заказ обновлен`})
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так'})
    }
})

router.get(
    '/getOrderList',
    async (req, res) => {
    try {
        const orederList = await Order.find().lean()

        res.status(201).json(orederList)
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так'})
    }
})


module.exports = router;
