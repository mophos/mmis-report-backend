import * as express from 'express';
import * as moment from 'moment';

import ContractModel from '../models/contract';
const router = express.Router();

const contractModel = new ContractModel();

router.post('/', async (req, res, next) => {
  let db: any = req.db;
  let items: any = req.body.items;
  let contract: any = req.body.contract;

  if (items.length && contract) {
    try {
      // generate contract id
      let contractId = moment().add(1, 'm').format('x');
      let _contract: any = {};
      _contract.contract_id = contractId;
      _contract.create_date = moment().format('YYYY-MM-DD');
      _contract.start_date = contract.startDate;
      _contract.end_date = contract.endDate;
      _contract.bid_type_id = contract.bidTypeId;
      _contract.bgtype_id = contract.bgtypeId;
      _contract.labeler_id = contract.vendorId;
      _contract.status_id = contract.statusId;
      _contract.remark = contract.remark;
      _contract.contract_no = contract.contractNo;
      _contract.buyer_name = contract.buyerName;
      _contract.buyer_position = contract.buyerPosition;

      let _products = [];
      items.forEach(v => {
        let obj: any = {};
        obj.contract_id = contractId;
        obj.product_id = v.product_id;
        obj.qty = v.qty;
        obj.cost = v.cost;
        obj.unit_generic_id = v.unit_generic_id;
        _products.push(obj);
      });

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
      _contract.bgtype_id = contract.bgtypeId;
      _contract.labeler_id = contract.vendorId;
      _contract.status_id = contract.statusId;
      _contract.remark = contract.remark;
      _contract.contract_no = contract.contractNo;
      _contract.buyer_name = contract.buyerName;
      _contract.buyer_position = contract.buyerPosition;

      let _products = [];
      items.forEach(v => {
        let obj: any = {};
        obj.contract_id = contractId;
        obj.product_id = v.product_id;
        obj.qty = v.qty;
        obj.cost = v.cost;
        obj.unit_generic_id = v.unit_generic_id;
        _products.push(obj);
      });

      // save data
      await contractModel.updateContract(db, contractId, _contract);
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

router.get('/', async (req, res, next) => {
  let db = req.db;
  let limit = +req.query.limit || 20;
  let offset = +req.query.offset || 0;
  let query = req.query.query;

  let _query = query === 'undefined' || query === null ? '' : query;

  try {
    let rs: any = await contractModel.getList(db, _query, limit, offset);
    let rsTotal: any = await contractModel.getTotal(db, _query);
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

export default router;