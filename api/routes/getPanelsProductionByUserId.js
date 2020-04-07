const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const panelSchema = Joi.object({
    id: Joi.string().guid().required(),
    date: Joi.date().format('YYYY-MM-DD').required(),
    production: Joi.number().required(),
});

module.exports = {
    method: 'GET',
    path: '/api/panels/production/{time_period}/{user_id}',
    handler: async (req, toolkit) => {
        switch (req.params.time_period) {
            case "week":
                panelsCount = await db.count().from('history_daily_1').where('user_id', req.params.user_id).andWhere('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2019-12-08 00:00:00').then(result => {
                    return result[0];
                });

                return await db.select('id', 'date', db.raw('SUM(?? + ?? + ??) AS ??', ['from_gen_to_consumer', 'from_gen_to_grid', 'from_gen_to_batt', 'production'])).from('history_daily_1').where('user_id', req.params.user_id).andWhere('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2019-12-08 00:00:00').groupBy('id', 'date').orderBy('date')
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
                    });
                break;
            case "month":
                panelsCount = await db.count().from('history_daily_1').where('user_id', req.params.user_id).andWhere('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2020-01-01 00:00:00').then(result => {
                    return result[0];
                });

                return await db.select('id', 'date', db.raw('SUM(?? + ?? + ??) AS ??', ['from_gen_to_consumer', 'from_gen_to_grid', 'from_gen_to_batt', 'production'])).from('history_daily_1').where('user_id', req.params.user_id).andWhere('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2020-01-01 00:00:00').groupBy('id', 'date').orderBy('date')
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
                    });
                break;
            case "total":
                panelsCount = await db.count().from('history_daily_1').where('user_id', req.params.user_id).then(result => {
                    return result[0];
                });

                return await db.select('id', 'date', db.raw('SUM(?? + ?? + ??) AS ??', ['from_gen_to_consumer', 'from_gen_to_grid', 'from_gen_to_batt', 'production'])).from('history_daily_1').where('user_id', req.params.user_id).groupBy('id', 'date').orderBy('date')
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
                    });
                break;
        }
    },
    options: {
        description: 'Get panels production by time period and user id',
        notes: 'Returns panels production as an array of objects',
        tags: ['api'],
        validate: {
            params: Joi.object().keys({
                time_period: Joi.string().required(),
                user_id: Joi.number().min(1).required()
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