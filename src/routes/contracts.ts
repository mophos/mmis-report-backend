import * as express from 'express';
import * as moment from 'moment';

import ContractModel from '../models/contract';
import { SerialModel } from '../models/serial';
const router = express.Router();

const contractModel = new ContractModel();
const serialModel = new SerialModel();

router.post('/', async (req, res, next) => {
  let db: any = req.db;
  let items: any = req.body.items;
  let contract: any = req.body.contract;

  if (items.length && contract) {
    try {
      // generate contract id
      let contractId = moment().add(1, 's').format('x');

      let _contract: any = {};
      _contract.contract_id = contractId;
      _contract.prepare_no = await serialModel.getSerial(db, 'CM');
      _contract.create_date = moment().format('YYYY-MM-DD');
      _contract.start_date = contract.startDate;
      _contract.end_date = contract.endDate;
      _contract.bid_type_id = contract.bidTypeId;
      _contract.bgtype_id = contract.bgTypeId;
      _contract.labeler_id = contract.vendorId;
      // _contract.status_id = contract.statusId;
      _contract.remark = contract.remark;
      _contract.contract_no = contract.contractNo;
      _contract.buyer_name = contract.buyerName;
      _contract.buyer_position = contract.buyerPosition;
      _contract.contract_status = contract.isApproved === 'Y' ? 'APPROVED' : 'PREPARE';

      let _products = [];
      let amount = 0;
      items.forEach(v => {
        let obj: any = {};
        amount += +v.cost * +v.qty;
        obj.contract_id = contractId;
        obj.product_id = v.product_id;
        obj.qty = v.qty;
        obj.cost = v.cost;
        obj.unit_generic_id = v.unit_generic_id;
        _products.push(obj);
      });

      _contract.amount = amount;
      // save data
      await contractModel.saveContract(db, _contract);
      await contractModel.saveContractDetail(db, _products);

      res.send({ ok: true });

    } catch (error) {
      res.send({ ok: false, error: error.message });
    } finally {
      db.destroy();
    }
  } else {
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' });
  }
});

router.put('/:contractId/edit', async (req, res, next) => {
  let db: any = req.db;
  let contractId: any = req.params.contractId;
  let items: any = req.body.items;
  let contract: any = req.body.contract;

  if (items.length && contract) {
    try {
      // generate contract id
      let _contract: any = {};
      _contract.create_date = moment().format('YYYY-MM-DD');
      _contract.start_date = contract.startDate;
      _contract.end_date = contract.endDate;
      _contract.bid_type_id = contract.bidTypeId;
      _contract.bgtype_id = contract.bgTypeId;
      _contract.labeler_id = contract.vendorId;
      // _contract.status_id = contract.statusId;
      _contract.remark = contract.remark;
      _contract.contract_no = contract.contractNo;
      _contract.buyer_name = contract.buyerName;
      _contract.buyer_position = contract.buyerPosition;
      _contract.last_updated = moment().format('YYYY-MM-DD HH:mm:ss');
      _contract.contract_status = contract.isApproved === 'Y' ? 'APPROVED' : 'PREPARE';

      let _products = [];
      let amount = 0;
      items.forEach(v => {
        let obj: any = {};
        amount += +v.cost * +v.qty;
        obj.contract_id = contractId;
        obj.product_id = v.product_id;
        obj.qty = v.qty;
        obj.cost = v.cost;
        obj.unit_generic_id = v.unit_generic_id;
        _products.push(obj);
      });

      // amount 
      _contract.amount = amount;
      // save contract data
      await contractModel.updateContract(db, contractId, _contract);
      // save product items
      await contractModel.removeContractDetail(db, contractId);
      await contractModel.saveContractDetail(db, _products);

      res.send({ ok: true });

    } catch (error) {
      res.send({ ok: false, error: error.message });
    } finally {
      db.destroy();
    }
  } else {
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' });
  }
});

router.put('/:contractId/approved', async (req, res, next) => {
  let db: any = req.db;
  let contractId: any = req.params.contractId;

  try {
    let _contract: any = {};
    _contract.contract_status = 'APPROVED';

    await contractModel.updateContract(db, contractId, _contract);
    res.send({ ok: true });

  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
});

router.get('/', async (req, res, next) => {
  let db = req.db;
  let limit = +req.query.limit || 20;
  let offset = +req.query.offset || 0;
  let query = req.query.query;
  let status = req.query.status || 'PREPARE';

  let _query = query === 'undefined' || query === null ? '' : query;
  let _status = status === 'undefined' || status === null ? 'PREPARE' : status;

  try {
    let rs: any = await contractModel.getList(db, _query, limit, offset, _status);
    let rsTotal: any = await contractModel.getTotal(db, _query, _status);
    res.send({ ok: true, rows: rs, total: rsTotal[0].total });
  } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
});

router.get('/products/items/:contractId', async (req, res, next) => {
  let db = req.db;
  let contractId = req.params.contractId;

  try {
    let rs: any = await contractModel.getContractItems(db, contractId);
    res.send({ ok: true, rows: rs });
  } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
});

router.get('/detail/:contractId', async (req, res, next) => {
  let db = req.db;
  let contractId = req.params.contractId;

  try {
    let rs: any = await contractModel.getContractDetail(db, contractId);
    res.send({ ok: true, detail: rs[0] });
  } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
});

router.delete('/:contractId/cancel', async (req, res, next) => {
  let db = req.db;
  let contractId = req.params.contractId;

  try {
    let rs: any = await contractModel.removeContract(db, contractId);
    res.send({ ok: true, detail: rs[0] });
  } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
});

export default router;