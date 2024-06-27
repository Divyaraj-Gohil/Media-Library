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

app.post('/upload', upload.single('image'), (req, res) => {
    UserModel.create({ name: req.body.name, detail: req.body.detail, image: req.file.filename })
        .then(result => res.json(result))
        .catch(err => console.log(err))
})
app.get('/', (req, res) => {
    UserModel.find()
        .then(result => res.status(200).send(result))
        .catch(err => console.log(err))
})
app.put('/update/:id', upload.single('image'), async (req, res) => {
    const old = await UserModel.findById({ _id: req.params.id })
    const upd = await UserModel.findOneAndUpdate({ _id: req.params.id }, { $set: { name: req.body.name, detail: req.body.detail, image: req.file.filename } }, { new: true })
    res.send(upd)
    try {
        const imgpath = `./public/images/${old.image}`
        await fs.promises.unlink(imgpath)
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