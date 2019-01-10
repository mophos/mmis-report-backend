import * as Knex from 'knex';

export default class ReportModel {

  list(knex: Knex) {
    return knex('i_report')
      .where('is_deleted', 'N');
  }
  listParameter(knex: Knex) {
    return knex('i_report_parameter');
  }
  saveHeader(knex: Knex, data) {
    return knex('i_report')
      .insert(data);
  }
  saveDetail(knex: Knex, data) {
    return knex('i_report_detail')
      .insert(data);
  }

  remove(knex: Knex, reportId) {
    return knex('i_report')
      .update({ 'is_deleted': 'Y' })
      .where('report_id', reportId);
  }

  getReportInfo(knex: Knex, reportId) {
    return knex('i_report as r')
      .select('r.report_id', 'r.report_name', 'r.report_detail', 'r.file_name',
        'r.path', 'r.is_parameter', 'r.is_deleted', 'rd.report_detail_id',
        'rd.parameter_name', 'rd.parameter_type', 'rp.parameter_name as parameter_type_name')
      .leftJoin('i_report_detail as rd', 'r.report_id', 'rd.report_id')
      .leftJoin('i_report_parameter as rp', 'rd.parameter_type', 'rp.parameter_id')
      .where('r.report_id', reportId);
  }

}