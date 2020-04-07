const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const froniusSchema = Joi.object({
    device_id: Joi.string().guid().required(),
    timestamp: Joi.date().timestamp().required(),
    sum: Joi.string().required(),
    source: Joi.string().required()
});

module.exports = {
    method: 'GET',
    path: '/api/fronius/overview/production/{device_id}',
    handler: async (req, toolkit) => {
        froniusCount = await db.count().from('history_fronius_1').where('device_id', req.params.device_id).andWhere('timestamp', '>=', '2019-10-01 00:00:00').andWhere('timestamp', '<', '2019-10-02 00:00:00').then(result => {
            return result[0];
        });
        
        return await db.select('device_id', 'timestamp', db.raw('SUM(??)', ['value']), db.raw(`'production' as "source"`)).from('history_fronius_1').where('device_id', req.params.device_id).andWhere('value', '>', 0).andWhere('timestamp', '>=', '2019-12-18 00:00:00').andWhere('timestamp', '<', '2019-12-19 00:00:00').groupBy('device_id', 'timestamp')
        .unionAll([
            db.select('device_id', 'timestamp', db.raw('SUM(??)', ['value']), db.raw(`'consommation' as "source"`)).from('history_fronius_1').where('device_id', req.params.device_id).andWhere('var_name', 'FromGenToConsumer').andWhere('value', '>', 0).andWhere('timestamp', '>=', '2019-12-18 00:00:00').andWhere('timestamp', '<', '2019-12-19 00:00:00').groupBy('device_id', 'timestamp')
        ], true)
        .then(result => {
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
        description: 'Get fronius production by device id',
        notes: 'Returns fronius production as an array of objects',
        tags: ['api'],
        validate: {
            params: Joi.object().keys({
                device_id: Joi.string().guid().required()
            }),
        },
        response: {
            schema: Joi.object({
                statusCode: Joi.number().integer().required(),
                message:  Joi.string().required(),
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