const connection = require('../database/connection');

module.exports = {
  async index(req, res) {
    const { page = 1 } = req.query;

    const [count] = await connection('incidents').count();
    
    const incidents = await connection('incidents')
      .join('ongs', 'ongs.id', '=', 'incidents.fk_ong')
      .limit(5)
      .offset((page - 1) * 5)
      .select([
        'incidents.*',
        'ongs.name',
        'ongs.email',
        'ongs.whatsapp',
        'ongs.city',
        'ongs.uf'
      ]);

    res.header('X-Total-Count', count['count(*)']);

    return res.json(incidents);
  },

  async create(req, res) {
    const { title, description, value } = req.body;
    const fk_ong = req.headers.authorization;

    const [id] = await connection('incidents').insert({
      title,
      description,
      value,
      fk_ong,
    });

    return res.json({ id });
  },

  async delete(req, res) {
    const { id } = req.params;
    const fk_ong = req.headers.authorization;

    const incident = await connection('incidents')
      .where('id', id)
      .select('fk_ong')
      .first();

    if (incident.fk_ong !== fk_ong) {
      return res.status(401).json({ error: "Operation not permitted." });
    }

    await connection('incidents').where('id', id).delete();

    return res.status(204).send();
  }
};