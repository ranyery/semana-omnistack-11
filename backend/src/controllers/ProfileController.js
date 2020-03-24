const connection = require('../database/connection');

module.exports = {
  async index(req, res) {
    const fk_ong = req.headers.authorization;

    const incidents = await connection('incidents')
      .where('fk_ong', fk_ong)
      .select('*');

    return res.json(incidents);
  }
}