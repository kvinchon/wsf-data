const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const froniusSchema = Joi.object({
    timestamp: Joi.date().timestamp().required(),
    value: Joi.number().required(),
    source: Joi.string().required()
});

module.exports = {
    method: 'GET',
    path: '/api/fronius',
    handler: async (req, toolkit) => {
        var count, sq1, sq2, query;

        count = db.countDistinct('timestamp').from('history_fronius_1').where('var_name', 'production').andWhere('value', '>', 0).andWhere('timestamp', '>=', '2020-01-01 00:00:00').andWhere('timestamp', '<', '2020-01-02 00:00:00');
        sq1 = db.select('device_id', 'timestamp', db.raw('value AS production')).from('history_fronius_1').where('var_name', 'production').andWhere('value', '>', 0).andWhere('timestamp', '>=', '2020-01-01 00:00:00').andWhere('timestamp', '<', '2020-01-02 00:00:00');
        sq2 = db.select('device_id', 'timestamp', db.raw('value AS consumption')).from('history_fronius_1').where('var_name', 'FromGenToConsumer').andWhere('value', '>', 0).andWhere('timestamp', '>=', '2020-01-01 00:00:00').andWhere('timestamp', '<', '2020-01-02 00:00:00');
        query = db.raw("SELECT sq1.timestamp, ROUND(AVG(sq1.production)::numeric, 2)::float AS value, 'production' AS source FROM (??) AS sq1 GROUP BY sq1.timestamp, source UNION SELECT sq2.timestamp, ROUND(AVG(sq2.consumption)::numeric, 2)::float AS value, 'consumption' as source FROM (??) AS sq2 GROUP BY sq2.timestamp ORDER BY timestamp", [sq1, sq2]);

        var froniusCount = await count.then(result => {
            return result[0];
        });

        froniusCount.count = parseInt(froniusCount.count, 10);

        return await query
            .then(result => {
                if (result.rows) {
                    result = result.rows;
                }

                return toolkit.response({
                    statusCode: 200,
                    message: 'Successful',
                    errors: null,
                    meta: froniusCount,
                    data: {
                        result
                    }
                }).code(200);
            });
    },
    options: {
        description: 'Get fronius production and consumption',
        notes: 'Returns fronius production and consumption as an array of objects',
        tags: ['api'],
        response: {
            schema: Joi.object({
                statusCode: Joi.number().integer().required(),
                message: Joi.string().required(),
                errors: null,
                meta: Joi.object({
                    count: Joi.number().integer().required()
                }).required(),
                data: Joi.object({
                    result: Joi.array().items(froniusSchema)
                }).required()
            })
        }
    }
}