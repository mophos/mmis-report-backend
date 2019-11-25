import * as Knex from 'knex';
const request = require("request");
export default class ReportSystemModel {

  list(knex: Knex) {
    return knex('i_report_systems')
      .where('is_deleted', 'N');
  }
  listParameter(knex: Knex) {
    return knex('i_report_system_parameters');
  }
  saveHeader(knex: Knex, data) {
    return knex('i_report_systems')
      .insert(data);
  }
  saveDetail(knex: Knex, data) {
    return knex('i_report_system_details')
      .insert(data);
  }

  remove(knex: Knex, reportId) {
    return knex('i_report_systems')
      .update({ 'is_deleted': 'Y' })
      .where('report_id', reportId);
  }

  getReportInfo(knex: Knex, reportId) {
    return knex('i_report_systems as r')
      .select('r.report_id', 'r.report_name', 'r.report_detail', 'r.file_name',
        'r.path', 'r.is_parameter', 'r.is_deleted', 'rd.report_detail_id',
        'rd.parameter_name', 'rd.parameter_type', 'rp.parameter_name as parameter_type_name')
      .leftJoin('i_report_details as rd', 'r.report_id', 'rd.report_id')
      .leftJoin('i_report_parameters as rp', 'rd.parameter_type', 'rp.parameter_id')
      .where('r.report_id', reportId);
  }

  generateReport(reportId) {
    return new Promise((resolve: any, reject: any) => {
      var options = {
        method: 'GET',
        url: `http://localhost:8080/api/report?id=${reportId}`,
        agentOptions: {
          rejectUnauthorized: false
        },
        headers:
        {
          'postman-token': 'c63b4187-f395-a969-dd57-19018273670b',
          'cache-control': 'no-cache',
          'content-type': 'application/json'
        },
        json: true
      };

      request(options, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });

  }
}