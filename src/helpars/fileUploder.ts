import multer from "multer"
import path from "path"
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary';
import { ICloudinaryResponse, IFile } from "../app/interface/file";


cloudinary.config({
    cloud_name: 'danfna34l',
    api_key: '388493785718437',
    api_secret: 'Bot2AH7fRfcKTYW8Rs2uDZZsoSE'
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'uploads'))
    },
    filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.random();
    cb(null, unique + "-" + file.originalname);
  }
})

console.log("multer", storage)

const upload = multer({ storage: storage })

const uploadToCloudinary = async (file: IFile): Promise<ICloudinaryResponse | undefined> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path,
            (error: Error, result: ICloudinaryResponse) => {
                fs.unlinkSync(file.path)
                if (error) {
                    reject(error)
                }
                else {
                    resolve(result)
                }
            })
    })
};

export const fileUploader = {
    upload,
    uploadToCloudinary
}