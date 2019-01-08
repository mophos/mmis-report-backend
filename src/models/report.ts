import * as Knex from 'knex';

export default class ReportModel {

  list(knex: Knex) {
    return knex('i_report');
  }
  listParameter(knex: Knex) {
    return knex('i_report_parameter');
  }


}