import * as Knex from 'knex';

export default class UploadModel {

  savefile(knex: Knex, data, reportId) {
    return knex('i_report')
      .update({ 'path': data.path, 'file_name': data.filename })
      .where('report_id', reportId)
  }


}