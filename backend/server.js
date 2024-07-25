import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from "./db.js"
import multer from 'multer'
import path from 'path'
import UserModel from './Schema.js'

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

app.post('/upload', async (req, res) => {
    const data = await UserModel.create(req.body)
    if (data) res.status(201).json(data)
})
app.get('/', async (req, res) => {
    const data = await UserModel.find()
    if (data) res.status(200).json(data)
})
app.put('/update/:id', async (req, res) => {
    const update = {}
    if (req.body.name) update.name = req.body.name
    if (req.body.detail) update.detail = req.body.detail
    if (req.body.image) update.image = req.body.image
    if (Object.keys(update).length === 0) {
        return res.status(400).send({ message: "fill atleast one field for update" })
    }
    const upd = await UserModel.findOneAndUpdate({ _id: req.params.id }, { $set: update }, { new: true })
    if (!upd) res.status(404).send("error in update")
    res.status(200).send(upd)
})
app.delete('/delete/:id', async (req, res) => {
    await UserModel.findByIdAndDelete({ _id: req.params.id })
})
const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`server running on ${port}`)
})