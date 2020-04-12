const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const panelSchema = Joi.object({
    date: Joi.date().format('YYYY-MM-DD').required(),
    consumption: Joi.number().required(),
});

module.exports = {
    method: 'GET',
    path: '/api/panels/consumption/{time_period}/{user_id?}',
    handler: async (req, toolkit) => {
        var count, query;

        if (req.params.user_id) {
            switch (req.params.time_period) {
                case "week":
                    count = db.count().from('history_daily_1').where('user_id', req.params.user_id).andWhere('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2019-12-08 00:00:00');
                    query = db.select('date', db.raw('SUM(?? + ?? + ??) AS ??', ['from_gen_to_consumer', 'from_grid_to_consumer', 'from_gen_to_batt', 'consumption'])).from('history_daily_1').where('user_id', req.params.user_id).andWhere('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2019-12-08 00:00:00').groupBy('date').orderBy('date');
                    break;
                case "month":
                    count = db.count().from('history_daily_1').where('user_id', req.params.user_id).andWhere('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2020-01-01 00:00:00');
                    query = db.select('date', db.raw('SUM(?? + ?? + ??) AS ??', ['from_gen_to_consumer', 'from_grid_to_consumer', 'from_gen_to_batt', 'consumption'])).from('history_daily_1').where('user_id', req.params.user_id).andWhere('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2020-01-01 00:00:00').groupBy('date').orderBy('date');
                    break;
                case "total":
                    count = db.count().from('history_daily_1').where('user_id', req.params.user_id);
                    query = db.select('date', db.raw('SUM(?? + ?? + ??) AS ??', ['from_gen_to_consumer', 'from_grid_to_consumer', 'from_gen_to_batt', 'consumption'])).from('history_daily_1').where('user_id', req.params.user_id).groupBy('date').orderBy('date');
                    break;
            }
        }
        else {
            var subquery;

            switch (req.params.time_period) {
                case "week":
                    count = db.countDistinct('date').from('history_daily_1').where('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2019-12-08 00:00:00');
                    subquery = db.select('id', 'date', db.raw('SUM(?? + ?? + ??) AS ??', ['from_gen_to_consumer', 'from_grid_to_consumer', 'from_gen_to_batt', 'consumption'])).from('history_daily_1').where('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2019-12-08 00:00:00').groupBy('id', 'date').orderBy('date');
                    break;
                case "month":
                    count = db.countDistinct('date').from('history_daily_1').where('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2020-01-01 00:00:00');
                    subquery = db.select('id', 'date', db.raw('SUM(?? + ?? + ??) AS ??', ['from_gen_to_consumer', 'from_grid_to_consumer', 'from_gen_to_batt', 'consumption'])).from('history_daily_1').where('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2020-01-01 00:00:00').groupBy('id', 'date').orderBy('date');
                    break;
                case "total":
                    count = db.countDistinct('date').from('history_daily_1');
                    subquery = db.select('id', 'date', db.raw('SUM(?? + ?? + ??) AS ??', ['from_gen_to_consumer', 'from_grid_to_consumer', 'from_gen_to_batt', 'consumption'])).from('history_daily_1').groupBy('id', 'date').orderBy('date');
                    break;
            }

            query = db.select('date', db.raw('AVG(consumption) AS consumption FROM(??) AS subquery', subquery)).groupBy('date');
        }

        var panelsCount = await count.then(result => {
            return result[0];
        });

        return await query
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
    },
    options: {
        description: 'Get panels consumption by time period and user id (optional)',
        notes: 'Returns panels consumption as an array of objects',
        tags: ['api'],
        validate: {
            params: Joi.object().keys({
                time_period: Joi.string().required(),
                user_id: Joi.number().min(1).allow(null)
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