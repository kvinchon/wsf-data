const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const panelSchema = Joi.object({
    id: Joi.string().guid().required(),
    ratio: Joi.number().required()
});

module.exports = {
    method: 'GET',
    path: '/api/fronius/overview/ratio/{device_id}',
    handler: async (req, toolkit) => {
        
                subquery = db.select('timestamp', db.raw('SUM(?? + ??) / SUM(?? + ?? + ??) * 100 AS ??', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid', 'ratio'])).from('history_daily_1').where('id', req.params.device_id).andWhere('date', '>=', '2019-10-01 00:00:00').andWhere('date', '<', '2019-10-08 00:00:00').groupBy('date');

                return await db.raw('SELECT AVG(ratio) AS ratio FROM(??) AS subquery', subquery)
                    .then(result => {
                        ratio = result.rows[0].ratio

                        return toolkit.response({
                            statusCode: 200,
                            message: 'Successful',
                            errors: null,
                            meta: {
                                count: 1
                            },
                            data: {
                                ratio
                            }
                        }).code(200);
                    })
        }
    },
    options: {
        description: 'Get panels ratio by device_id',
        notes: 'Returns average self-consumption rate',
        tags: ['api'],
        validate: {
            params: Joi.object().keys({
                time_period: Joi.string().required(),
                device_id: Joi.string().guid().required()
            })
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
                    result: Joi.array().items(panelSchema)
                }).required()
            }),
            failAction: 'log'
        }
    }
}