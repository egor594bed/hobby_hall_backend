const {Router} = require('express')
const multer = require('multer')
const path = require('path')
const Categories = require('../models/Categories')
const subCategories = require('../models/SubCategories')
const Goods = require('../models/Goods')
const User = require('../models/User')
const { Types } = require('mongoose')
const router = Router()

router.get(
    '/getCategory',
    async (req, res) => {
        
    try {
        const catalog = await Categories.find().lean()
        const sub = await subCategories.find().lean()

        catalog.map((elem) => {
            let arr = sub.filter(item => item.categoryId.toString() === elem._id.toString())
            elem["subCategories"] = arr
        })

        res.status(200).json({catalog: catalog})

    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так'})
    }
})

router.get(
    '/getGoodsFromId',
    async (req, res) => {
    try {

        // const goodsArr = await Goods.find({subCategoryId: Types.ObjectId(req.query.id)}).lean()
        // Переделать на нормальный запрос на БД
        const goodsArr = await Goods.find().lean()

        const activeCategoryGoods = goodsArr.filter((item) => item.subCategoryId.toString() == req.query.id)

        res.status(200).json({activeCategoryGoods: activeCategoryGoods})
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так'})
    }
})

router.get(
    '/getGoodsFromSearch',
    async (req, res) => {
    try {
        
        const goodsArr = await Goods.find({"name": {$regex: req.query.search, $options: "i"}}).lean()

        res.status(200).json({activeCategoryGoods: goodsArr})
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так'})
    }
})

router.get(
    '/getProduct',
    async (req, res) => {
    try {

        const product = await Goods.findOne({_id: req.query.id}).lean()

        res.status(200).json({product: product})
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так'})
    }
})


router.post(
    '/getBasketGoods',
    async (req, res) => {
    try {
        let resArr = []
        for (let i = 0; i < req.body.length; i++) {
            const goodsArr = await Goods.find({_id: req.body[i][0]}).lean()
            resArr.push(...goodsArr)
        }

        res.status(200).json({basketArr: resArr})
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так'})
    }
})

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'client/src/img/goodsImgs')
    },
    filename: function(req, file, cb) {   
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({storage, fileFilter})

router.post(
    '/setProduct',
    [
        upload.single('img')
    ],
    async (req, res) => {
    try {
        let {name, description, price, article, quantity, subCategory} = req.body
        const newProduct = {
            name,
            description,
            price: Number(price),
            article,
            imgName: req.file.filename,
            quantity: Number(quantity),
            subCategoryId: Types.ObjectId(subCategory)
        }

        const product = new Goods(newProduct)
        await product.save()

        res.status(201).json({message: `Товар добавлен: ${newProduct.name}`})
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так'})
    }
})

module.exports = router;
