const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const panelSchema = Joi.object({
    ratio: Joi.number().required()
});

module.exports = {
    method: 'GET',
    path: '/api/panels/production/ratio/{time_period}/{user_id}',
    handler: async (req, toolkit) => {
        switch (req.params.time_period) {
            case "week":
                subquery = db.select('date', db.raw('SUM(?? + ??) / SUM(?? + ?? + ??) * 100 AS ??', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid', 'ratio'])).from('history_daily_1').where('user_id', req.params.user_id).andWhere('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2019-12-08 00:00:00').having(db.raw('SUM(?? + ?? + ??) > 0', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid'])).groupBy('date');

                return await db.raw('SELECT AVG(ratio) AS ratio FROM(??) AS subquery', subquery)
                    .then(result => {
                        ratio = result.rows[0].ratio

                        result = [
                            {
                                ratio: ratio
                            }
                        ];

                        return toolkit.response({
                            statusCode: 200,
                            message: 'Successful',
                            errors: null,
                            meta: {
                                count: 1
                            },
                            data: {
                                result
                            }
                        }).code(200);
                    })
                break;
            case "month":
                subquery = db.select('date', db.raw('SUM(?? + ??) / SUM(?? + ?? + ??) * 100 AS ??', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid', 'ratio'])).from('history_daily_1').where('user_id', req.params.user_id).andWhere('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2020-01-01 00:00:00').having(db.raw('SUM(?? + ?? + ??) > 0', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid'])).groupBy('date');

                return await db.raw('SELECT AVG(ratio) AS ratio FROM(??) AS subquery', subquery)
                    .then(result => {
                        ratio = result.rows[0].ratio

                        result = [
                            {
                                ratio: ratio
                            }
                        ];

                        return toolkit.response({
                            statusCode: 200,
                            message: 'Successful',
                            errors: null,
                            meta: {
                                count: 1
                            },
                            data: {
                                result
                            }
                        }).code(200);
                    })
                break;
            case "total":
                subquery = db.select('date', db.raw('SUM(?? + ??) / SUM(?? + ?? + ??) * 100 AS ??', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid', 'ratio'])).from('history_daily_1').where('user_id', req.params.user_id).having(db.raw('SUM(?? + ?? + ??) > 0', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid'])).groupBy('date');

                return await db.raw('SELECT AVG(ratio) AS ratio FROM(??) AS subquery', subquery)
                    .then(result => {
                        ratio = result.rows[0].ratio

                        result = [
                            {
                                ratio: ratio
                            }
                        ];

                        return toolkit.response({
                            statusCode: 200,
                            message: 'Successful',
                            errors: null,
                            meta: {
                                count: 1
                            },
                            data: {
                                result
                            }
                        }).code(200);
                    })
                break;
        }
    },
    options: {
        description: 'Get panels production ratio by time period and user id',
        notes: 'Returns production ratio',
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