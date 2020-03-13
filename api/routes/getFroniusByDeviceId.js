const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const froniusSchema = Joi.object({
    timestamp: Joi.date().timestamp().required(),
    device_type: Joi.string().required(),
    var_name: Joi.string().required(),
    value: Joi.number().required(),
    unit: Joi.string().required(),
    provider: Joi.string().required(),
    device_id: Joi.string().guid().required(),
    year: Joi.date().format('YYYY').required(),
    month: Joi.date().format(['M', 'MM']).required(),
    id: Joi.number().required()
});

module.exports = {
    method: 'GET',
    path: '/api/fronius/{device_id}/{var_name}',
    handler: async (req, toolkit) => {
        froniusCount = await db.count().from('history_fronius_1').where('device_id', req.params.device_id).andWhere('var_name', req.params.var_name).then(result => {
            return result[0];
        });
        
        return await db.select().from('history_fronius_1').where('device_id', req.params.device_id).andWhere('var_name', req.params.var_name).andWhere('value', '>', 0).andWhere('timestamp', '>=', '2019-12-18 00:00:00').andWhere('timestamp', '<', '2019-12-19 00:00:00').orderBy('timestamp')
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
        })
    },
    options: {
        description: 'Get fronius history by device_id and var_name',
        notes: 'Returns fronius history as an array of objects',
        tags: ['api'],
        validate: {
            params: Joi.object().keys({
                device_id: Joi.string().guid().required(),
                var_name: Joi.string().required()
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