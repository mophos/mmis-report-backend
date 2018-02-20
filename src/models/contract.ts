import * as Knex from 'knex';

export default class ContractModel {

  saveContract(db: Knex, contract: any) {
    return db('cm_contracts')
      .insert(contract);
  }

  updateContract(db: Knex, contractId: any, contract: any) {
    return db('cm_contracts')
      .where('contract_id', contractId)
      .update(contract);
  }

  removeContract(db: Knex, contractId: any) {
    return db('cm_contracts')
      .where('contract_id', contractId)
      .update({ contract_status: 'CANCEL' });
  }

  saveContractDetail(db: Knex, products: any) {
    return db('cm_contract_detail')
      .insert(products);
  }

  removeContractDetail(db: Knex, contractId: any) {
    return db('cm_contract_detail')
      .where('contract_id', contractId)
      .del();
  }

  getList(db: Knex, query: any, limit: number, offset: number, status: any = 'PREPARE') {

    let subQuery = db('cm_contract_detail as d')
      .select(db.raw('sum(qty*cost)'))
      .whereRaw('d.contract_id=cm.contract_id')
      .as('total_price');

    let sql = db('cm_contracts as cm')
      .select('cm.*', 'l.labeler_name', 'bg.bgtype_name', subQuery)
      .innerJoin('mm_labelers as l', 'l.labeler_id', 'cm.labeler_id')
      .innerJoin('bm_bgtype as bg', 'bg.bgtype_id', 'cm.bgtype_id')
      // .leftJoin('cm_status as cs', 'cs.status_id', 'cm.status_id')
      .orderBy('cm.prepare_no', 'desc');

    if (query) {
      let _query = `${query}%`;
      sql.where(w => {
        w.where('l.labeler_name', 'like', _query)
          .orWhere('cm.contract_no', query)
          .orWhere('cm.contract_id', query)
      });
    }

    if (status !== 'ALL') {
      sql.where('cm.contract_status', status);
    }

    sql.limit(limit)
    sql.offset(offset);

    return sql;
  }

  getTotal(db: Knex, query: any, status: any = 'PREPARE') {

    let sql = db('cm_contracts as cm')
      .select(db.raw('count(*) as total'))
      .innerJoin('mm_labelers as l', 'l.labeler_id', 'cm.labeler_id')
      .innerJoin('bm_bgtype as bg', 'bg.bgtype_id', 'cm.bgtype_id')
      // .leftJoin('cm_status as cs', 'cs.status_id', 'cm.status_id')
      .orderBy('cm.create_date');

    if (query) {
      let _query = `${query}%`;
      sql.where(w => {
        w.where('l.labeler_name', 'like', _query)
          .orWhere('cm.contract_no', query)
          .orWhere('cm.contract_id', query)
      });
    }

    if (status !== 'ALL') {
      sql.where('cm.contract_status', status);
    }

    return sql;

  }

  getContractItems(db: Knex, contractId: any) {
    return db('cm_contract_detail as cd')
      .select('cd.*', 'ug.qty as conversion_qty', 'u1.unit_name as from_unit_name',
        'u2.unit_name as to_unit_name', 'mp.product_name', 'mp.generic_id')
      .innerJoin('mm_products as mp', 'mp.product_id', 'cd.product_id')
      .innerJoin('mm_unit_generics as ug', 'ug.unit_generic_id', 'cd.unit_generic_id')
      .innerJoin('mm_units as u1', 'u1.unit_id', 'ug.from_unit_id')
      .innerJoin('mm_units as u2', 'u2.unit_id', 'ug.to_unit_id')
      .where('cd.contract_id', contractId)
      .orderBy('mp.product_name');
  }

  getContractDetail(db: Knex, contractId: any) {
    return db('cm_contracts as cm')
    .select('cm.*', 'l.labeler_name')  
      .where('cm.contract_id', contractId)
      .innerJoin('mm_labelers as l', 'l.labeler_id', 'cm.labeler_id')
      .limit(1);
  }

  checkProductInContract(db: Knex, productId: any) {
    `
    select count(*) as total
from cm_contract_detail as cd 
inner join cm_contracts as ct on ct.contract_id=cd.contract_id
where ct.contract_status<>'SUCCESS' and cd.product_id='50'
    `

    return db('cm_contract_detail as cd')
  }

}