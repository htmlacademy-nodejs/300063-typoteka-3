'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../db`);
const {ECategoryFieldName} = require(`../../models`);
const {logger} = require(`../../utils`);


class ApiCategory {
  constructor() {
    this.put = this.put.bind(this);
    this.delete = this.delete.bind(this);
  }

  async put(req, res) {
    const {categoryId: id} = req.params;
    const {title} = req.body;
    const categories = await db.Category.update({title}, {
      where: {
        id,
      },
    });
    res.status(HttpCodes.OK).send(categories);
    logger.endRequest(req, res);
  }

  async delete(req, res) {
    const {categoryId: id} = req.params;
    await db.Category.destroy({
      where: {
        [ECategoryFieldName.ID]: id,
      },
    });
    res.status(HttpCodes.NO_CONTENT).send();
    logger.endRequest(req, res);
  }
}

module.exports = ApiCategory;
