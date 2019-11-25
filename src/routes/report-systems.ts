import * as express from 'express';
import * as moment from 'moment';
require("request");
import ReportSystemModel from '../models/report-system';
const router = express.Router();

const reportSystemModel = new ReportSystemModel();



router.get('/', async (req, res, next) => {
    const db: any = req.db;
    try {
        const rs: any = await reportSystemModel.list(db);
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
        const rs: any = await reportSystemModel.getReportInfo(db, reportId);
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
        const rs: any = await reportSystemModel.listParameter(db);
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
        const rs: any = await reportSystemModel.saveHeader(db, header);
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
        const rs: any = await reportSystemModel.saveDetail(db, detail);
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
        await reportSystemModel.remove(db, reportId);
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
        rs = await reportSystemModel.generateReport(reportId);
    }
    if (length >= 1) {
        const p1_name = req.query.p1_name;
        const p1_value = req.query.p1_value;
        if (length == 1) {
            // const rs = await reportSystemModel.generateReport(db, reportId,);
        }
    }
    if (length >= 2) {
        const p2_name = req.query.p2_name;
        const p2_value = req.query.p2_value;
    }
    if (length >= 3) {
        const p3_name = req.query.p3_name;
        const p3_value = req.query.p3_value;
    }
    if (length >= 4) {
        const p4_name = req.query.p4_name;
        const p4_value = req.query.p4_value;
    }
    if (length >= 5) {
        const p5_name = req.query.p5_name;
        const p5_value = req.query.p5_value;
    }
    try {
        if (rs.ok) {
            console.log(rs);

            res.sendFile(process.env.REPORT_PDF + '/' + rs.fileName);
        } else {
            res.send(rs);
        }
        // const rs = await reportSystemModel.getReportInfo(db, reportId);
        // 1546850165349.html

        // res.send(rs)

    } catch (error) {
        res.send({ ok: false, error: error.message });
    } finally {
        db.destroy();
    }
});
export default router;