import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from "./db.js"
import multer from 'multer'
import path from 'path'
import UserModel from './Schema.js'
import fs from 'fs'

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json())
app.use(express.static('public'))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

app.post('/upload', upload.single('image'), async (req, res) => {
    const { name, detail } = req.body
    const data = await UserModel.create({ name: name, detail: detail, image: req.file.filename })
    if (data) res.status(201).json(data)
})
app.get('/', async (req, res) => {
    const data = await UserModel.find()
    if (data) res.status(200).json(data)
})
app.put('/update/:id', upload.single('image'), async (req, res) => {
    const update = {}
    if (req.body.name) update.name = req.body.name
    if (req.body.detail) update.name = req.body.detail
    if (req.file) update.image = req.file.filename
    if (Object.keys(update).length === 0 && !req.file) {
        return res.status(400).send({ message: "fill atleast one field for update" })
    }
    const old = await UserModel.findById({ _id: req.params.id })
    const upd = await UserModel.findOneAndUpdate({ _id: req.params.id }, { $set: update }, { new: true })
    if (!upd) res.status(404).send("error in update")
    res.status(200).send(upd)
    try {
        if (update.image) {
            const imgpath = `./public/images/${old.image}`
            await fs.promises.unlink(imgpath)
        }
    } catch (error) {

    }

})
app.delete('/delete/:id', async (req, res) => {
    const del = await UserModel.findByIdAndDelete({ _id: req.params.id })
    try {
        const imgpath = `./public/images/${del.image}`
        await fs.promises.unlink(imgpath)
    } catch (error) {

    }
})
const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`server running on ${port}`)
})