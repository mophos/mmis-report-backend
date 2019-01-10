import * as express from 'express';
import UploadModel from '../models/upload';
const router = express.Router();

const uploadModel = new UploadModel();

import * as path from 'path';
import * as fse from 'fs-extra';
import * as multer from 'multer';

// const uploadDir = 'public/uploads';
const uploadDir = process.env.REPORT_DATA;
fse.ensureDirSync(uploadDir);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        let _ext = path.extname(file.originalname);
        cb(null, Date.now() + _ext)
    }
})

let upload = multer({ storage: storage })


router.post('/', upload.any(), async (req, res, next) => {
    try {
        const db = req.db;
        const files = req.files;
        const reportId = req.body.reportId;
        await uploadModel.savefile(db, files[0], reportId);
        res.send({ ok: true, rows: files });
    } catch (error) {
        res.send({ ok: false, error: error });
    }
    // let docs: any = [];
    // console.log(files);

    // files.forEach(v => {
    //     let obj = {
    //         path: v.path,
    //         file_name: v.filename
    //     };
    //     docs.push(obj);
    // });

    // if (docs.length) {
    //     uploadModel.savefile(db, docs, reportId)
    //         .then((ids) => {
    //             res.send({ ok: true, files: docs });
    //         })
    //         .catch((error) => {
    //             res.send({ ok: false, error: error.message });
    //         })
    //         .finally(() => {
    //             db.destroy();
    //         });
    // } else {
    //     res.send({ ok: false, error: 'No file upload!' });
    // }
});


export default router;