const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const panelSchema = Joi.object({
    id: Joi.string().guid().required(),
    name: Joi.string().required(),
    street: Joi.string().required(),
    zipcode: Joi.number().integer().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    date: Joi.date().format('YYYY-MM-DD').required(),
    from_gen_to_consumer: Joi.number().required(),
    from_gen_to_batt: Joi.number().required(),
    from_gen_to_grid: Joi.number().required(),
    from_grid_to_consumer: Joi.number().required()
});

module.exports = {
    method: 'GET',
    path: '/api/panels',
    handler: async (req, toolkit) => {
        panelsCount = await db.count().from('history_daily_1').then(result => {
            return result[0];
        });
        
        return await db.select().from('history_daily_1').limit(req.query.limit).offset(req.query.offset)
        .then(result => {
            return toolkit.response({
                statusCode: 200,
                message: 'Successful',
                errors: null,
                meta: panelsCount,
                data: {
                    result
                }
            }).code(200);
        })
    },
    options: {
        description: 'Get panels history',
        notes: 'Returns panels history as an array of objects',
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
                    result: Joi.array().items(panelSchema)
                }).required()
            })
        }
    }
}