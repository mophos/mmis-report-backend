import * as express from 'express';
import * as moment from 'moment';
require("request");
import ReportModel from '../models/report';
const router = express.Router();

const reportModel = new ReportModel();



router.get('/', async (req, res, next) => {
    const db: any = req.db;
    try {
        const rs: any = await reportModel.list(db);
        res.send({ ok: true, rows: rs });
    } catch (error) {
        res.send({ ok: false, error: error.message });
    } finally {
        db.destroy();
    }
});

router.get('/info', async (req, res, next) => {
    const db: any = req.db;
    const reportId = req.query.reportId;
    try {
        const rs: any = await reportModel.getReportInfo(db, reportId);
        res.send({ ok: true, rows: rs });
    } catch (error) {
        res.send({ ok: false, error: error.message });
    } finally {
        db.destroy();
    }
});

router.get('/parameter', async (req, res, next) => {
    const db: any = req.db;
    try {
        const rs: any = await reportModel.listParameter(db);
        res.send({ ok: true, rows: rs });
    } catch (error) {
        res.send({ ok: false, error: error.message });
    } finally {
        db.destroy();
    }
});

router.post('/header', async (req, res, next) => {
    const db: any = req.db;
    const header = req.body.header;
    try {
        const rs: any = await reportModel.saveHeader(db, header);
        res.send({ ok: true, rows: rs });
    } catch (error) {
        res.send({ ok: false, error: error.message });
    } finally {
        db.destroy();
    }
});

router.post('/detail', async (req, res, next) => {
    const db: any = req.db;
    const detail = req.body.detail;
    try {
        const rs: any = await reportModel.saveDetail(db, detail);
        res.send({ ok: true, rows: rs });
    } catch (error) {
        res.send({ ok: false, error: error.message });
    } finally {
        db.destroy();
    }
});

router.delete('/', async (req, res, next) => {
    const db: any = req.db;
    const reportId = req.query.reportId;
    try {
        await reportModel.remove(db, reportId);
        res.send({ ok: true });
    } catch (error) {
        res.send({ ok: false, error: error.message });
    } finally {
        db.destroy();
    }
});

router.get('/preview', async (req, res, next) => {
    const db: any = req.db;
    const reportId = req.query.reportId;
    try {
        const rs = await reportModel.getReportInfo(db, reportId);
        // 1546850165349.html



        res.sendFile('/Users/tan/moph/ireport/html/sample.pdf');
        // res.send({ ok: true });
    } catch (error) {
        res.send({ ok: false, error: error.message });
    } finally {
        db.destroy();
    }
});
export default router;