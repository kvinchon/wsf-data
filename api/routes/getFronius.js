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
    path: '/api/fronius',
    handler: async (req, toolkit) => {
        froniusCount = await db.count().from('history_fronius_1').then(result => {
            return result[0];
        });
        
        return await db.select().from('history_fronius_1').limit(req.query.limit).offset(req.query.offset)
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
        description: 'Get fronius history',
        notes: 'Returns fronius history as an array of objects',
        tags: ['api'],
        validate: {
            query: Joi.object().keys({
                limit: Joi.number().integer().min(1).max(100).default(20),
                offset: Joi.number().integer().min(0).default(0)
            })
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