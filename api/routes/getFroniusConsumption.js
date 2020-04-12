const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const froniusSchema = Joi.object({
    timestamp: Joi.date().timestamp().required(),
    consumption: Joi.string().required()
});

module.exports = {
    method: 'GET',
    path: '/api/fronius/consumption/{user_id?}',
    handler: async (req, toolkit) => {
        var count, query;

        if (req.params.user_id) {
            count = db.count().from('history_fronius_1').where('user_id', req.params.user_id).andWhere('var_name', 'FromGenToConsumer').andWhere('value', '>', 0).andWhere('timestamp', '>=', '2020-01-01 00:00:00').andWhere('timestamp', '<', '2020-01-02 00:00:00');
            query = db.select('timestamp', db.raw('value AS consumption')).from('history_fronius_1').where('user_id', req.params.user_id).andWhere('var_name', 'FromGenToConsumer').andWhere('value', '>', 0).andWhere('timestamp', '>=', '2020-01-01 00:00:00').andWhere('timestamp', '<', '2020-01-02 00:00:00').orderBy('timestamp')
        }
        else {
            var subquery;
            count = db.countDistinct('timestamp').from('history_fronius_1').where('var_name', 'FromGenToConsumer').andWhere('value', '>', 0).andWhere('timestamp', '>=', '2020-01-01 00:00:00').andWhere('timestamp', '<', '2020-01-02 00:00:00');
            subquery = db.select('device_id', 'timestamp', db.raw('value AS consumption')).from('history_fronius_1').where('var_name', 'FromGenToConsumer').andWhere('value', '>', 0).andWhere('timestamp', '>=', '2020-01-01 00:00:00').andWhere('timestamp', '<', '2020-01-02 00:00:00');
            query = db.raw('SELECT timestamp, AVG(consumption) AS consumption FROM (??) AS sq GROUP BY timestamp', subquery);
        }

        var froniusCount = await count.then(result => {
            return result[0];
        });

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
        description: 'Get fronius consumption by user id (optional)',
        notes: 'Returns fronius consumption as an array of objects',
        tags: ['api'],
        validate: {
            params: Joi.object().keys({
                user_id: Joi.number().min(1).allow(null).description('the user ID (optional)')
            }),
        },
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