import * as express from 'express';
import * as moment from 'moment';

import ReportModel from '../models/report';
const router = express.Router();

const reportModel = new ReportModel();



router.get('/', async (req, res, next) => {
    let db: any = req.db;
    try {
        const rs: any = await reportModel.list(db);
        res.send({ ok: true, rows: rs });
    } catch (error) {
        res.send({ ok: false, error: error.message });
    } finally {
        db.destroy();
    }
});

router.get('/parameter', async (req, res, next) => {
    let db: any = req.db;
    try {
        const rs: any = await reportModel.listParameter(db);
        res.send({ ok: true, rows: rs });
    } catch (error) {
        res.send({ ok: false, error: error.message });
    } finally {
        db.destroy();
    }
});


export default router;