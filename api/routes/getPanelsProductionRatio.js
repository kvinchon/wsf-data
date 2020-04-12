const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const panelSchema = Joi.object({
    ratio: Joi.number().required()
});

module.exports = {
    method: 'GET',
    path: '/api/panels/production/ratio/{time_period}/{user_id?}',
    handler: async (req, toolkit) => {
        var subquery;
        if (req.params.user_id) {
            switch (req.params.time_period) {
                case "today":
                    subquery = db.select('id', 'date', db.raw('SUM(?? + ??) / SUM(?? + ?? + ??) * 100 AS ??', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid', 'ratio'])).from('history_daily_1').where('user_id', req.params.user_id).andWhere('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2019-12-02 00:00:00').having(db.raw('SUM(?? + ?? + ??) > 0', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid'])).groupBy('id', 'date');
                    break;
                case "week":
                    subquery = db.select('id', 'date', db.raw('SUM(?? + ??) / SUM(?? + ?? + ??) * 100 AS ??', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid', 'ratio'])).from('history_daily_1').where('user_id', req.params.user_id).andWhere('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2019-12-08 00:00:00').having(db.raw('SUM(?? + ?? + ??) > 0', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid'])).groupBy('id', 'date');
                    break;
                case "month":
                    subquery = db.select('id', 'date', db.raw('SUM(?? + ??) / SUM(?? + ?? + ??) * 100 AS ??', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid', 'ratio'])).from('history_daily_1').where('user_id', req.params.user_id).andWhere('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2020-01-01 00:00:00').having(db.raw('SUM(?? + ?? + ??) > 0', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid'])).groupBy('id', 'date');
                    break;
                case "total":
                    subquery = db.select('id', 'date', db.raw('SUM(?? + ??) / SUM(?? + ?? + ??) * 100 AS ??', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid', 'ratio'])).from('history_daily_1').where('user_id', req.params.user_id).having(db.raw('SUM(?? + ?? + ??) > 0', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid'])).groupBy('id', 'date');
                    break;
            }
        }
        else {
            switch (req.params.time_period) {
                case "today":
                    subquery = db.select('id', 'date', db.raw('SUM(?? + ??) / SUM(?? + ?? + ??) * 100 AS ??', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid', 'ratio'])).from('history_daily_1').where('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2019-12-02 00:00:00').having(db.raw('SUM(?? + ?? + ??) > 0', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid'])).groupBy('id', 'date');
                    break;
                case "week":
                    subquery = db.select('id', 'date', db.raw('SUM(?? + ??) / SUM(?? + ?? + ??) * 100 AS ??', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid', 'ratio'])).from('history_daily_1').where('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2019-12-08 00:00:00').having(db.raw('SUM(?? + ?? + ??) > 0', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid'])).groupBy('id', 'date');
                    break;
                case "month":
                    subquery = db.select('id', 'date', db.raw('SUM(?? + ??) / SUM(?? + ?? + ??) * 100 AS ??', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid', 'ratio'])).from('history_daily_1').where('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2020-01-01 00:00:00').having(db.raw('SUM(?? + ?? + ??) > 0', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid'])).groupBy('id', 'date');
                    break;
                case "total":
                    subquery = db.select('id', 'date', db.raw('SUM(?? + ??) / SUM(?? + ?? + ??) * 100 AS ??', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid', 'ratio'])).from('history_daily_1').having(db.raw('SUM(?? + ?? + ??) > 0', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_gen_to_grid'])).groupBy('id', 'date');
                    break;
            }
        }

        return await db.raw('SELECT AVG(ratio) AS ratio FROM(??) AS subquery', subquery)
            .then(result => {
                result = [{
                    ratio: result.rows[0].ratio
                }];

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
    },
    options: {
        description: 'Get panels production ratio by time period and user id (optional)',
        notes: 'Returns production ratio',
        tags: ['api'],
        validate: {
            params: Joi.object().keys({
                time_period: Joi.string().required().description('the period of time taken into account (today, week, month or total)'),
                user_id: Joi.number().min(1).allow(null).description('the user ID (optional)')
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