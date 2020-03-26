const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const panelSchema = Joi.object({
    id: Joi.string().guid().required(),
    date: Joi.date().format('YYYY-MM-DD').required(),
    production: Joi.number().required(),
    selfConsumption: Joi.number().required()
});

module.exports = {
    method: 'GET',
    path: '/api/panels/{device_id}',
    handler: async (req, toolkit) => {
        panelsCount = await db.count().from('history_daily_1').where('id', req.params.device_id).then(result => {
            return result[0];
        });

        return await db.select('id', 'date', db.raw('SUM(?? + ?? + ??) AS ??', ['from_gen_to_consumer', 'from_gen_to_grid', 'from_gen_to_batt', 'production']), db.raw('SUM(?? + ??) AS ??', ['from_gen_to_consumer', 'from_gen_to_batt', 'selfConsumption'])).from('history_daily_1').where('id', req.params.device_id).andWhere('date', '>=', '2019-10-01 00:00:00').andWhere('date', '<', '2019-11-01 00:00:00').groupBy('id', 'date')
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
        description: 'Get panels history by device_id',
        notes: 'Returns panels history as an array of objects',
        tags: ['api'],
        validate: {
            params: Joi.object().keys({
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
            })
        }
    }
}