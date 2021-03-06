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
    const length = req.query.length;

    let rs: any;
    if (length == 0) {
        rs = await reportModel.generateReport(reportId);
    } else {
        const data: any = {};
        data.id = reportId;
        if (length >= 1) {
            data.p1_name = req.query.p1_name;
            data.p1_value = req.query.p1_value;
        }
        if (length >= 2) {
            data.p2_name = req.query.p2_name;
            data.p2_value = req.query.p2_value;
        }
        if (length >= 3) {
            data.p3_name = req.query.p3_name;
            data.p3_value = req.query.p3_value;
        }
        if (length >= 4) {
            data.p4_name = req.query.p4_name;
            data.p4_value = req.query.p4_value;
        }
        if (length >= 5) {
            data.p5_name = req.query.p5_name;
            data.p5_value = req.query.p5_value;
        }
        rs = await reportModel.generateReportParameter(reportId, data);

    }
    try {
        console.log('rs', rs);
        if (rs.ok) {
            console.log(rs);
            res.sendFile(process.env.REPORT_PDF + '/' + rs.fileName);
        } else {
            res.send(rs);
        }
        // const rs = await reportModel.getReportInfo(db, reportId);
        // 1546850165349.html

        // res.send(rs)

    } catch (error) {
        console.log(error);

        res.send({ ok: false, error: error.message });
    } finally {
        db.destroy();
    }
});
export default router;