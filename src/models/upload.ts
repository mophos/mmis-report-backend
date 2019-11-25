import * as Knex from 'knex';

export default class UploadModel {

  savefile(knex: Knex, data, path, reportId) {
    return knex('i_reports')
      .update({ 'path': path, 'file_name': data.filename })
      .where('report_id', reportId)
  }


}