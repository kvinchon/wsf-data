const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const panelSchema = Joi.object({
    date: Joi.date().required(),
    production: Joi.number().required(),
    consumption: Joi.number().required()
});

module.exports = {
    method: 'GET',
    path: '/api/panels/{time_period}',
    handler: async (req, toolkit) => {
        var count, subquery, query;

        // Query building
        switch (req.params.time_period) {
            case "week":
                count = db.countDistinct('date').from('history_daily_1').where('date', '>=', '2019-12-25').andWhere('date', '<', '2020-01-01');
                subquery = db.select('id', 'date', db.raw('SUM(?? + ?? + ??) AS ??', ['from_gen_to_consumer', 'from_gen_to_grid', 'from_gen_to_batt', 'production']), db.raw('SUM(?? + ??) AS ??', ['from_gen_to_consumer', 'from_gen_to_batt', 'consumption'])).from('history_daily_1').where('date', '>=', '2019-12-25').andWhere('date', '<', '2020-01-01').groupBy('id', 'date').orderBy('date');
                break;
            case "month":
                count = db.countDistinct('date').from('history_daily_1').where('date', '>=', '2019-12-01').andWhere('date', '<', '2020-01-01');
                subquery = db.select('id', 'date', db.raw('SUM(?? + ?? + ??) AS ??', ['from_gen_to_consumer', 'from_gen_to_grid', 'from_gen_to_batt', 'production']), db.raw('SUM(?? + ??) AS ??', ['from_gen_to_consumer', 'from_gen_to_batt', 'consumption'])).from('history_daily_1').where('date', '>=', '2019-12-01').andWhere('date', '<', '2020-01-01').groupBy('id', 'date').orderBy('date');
                break;
            case "total":
                count = db.countDistinct('date').from('history_daily_1');
                subquery = db.select('id', 'date', db.raw('SUM(?? + ?? + ??) AS ??', ['from_gen_to_consumer', 'from_gen_to_grid', 'from_gen_to_batt', 'production']), db.raw('SUM(?? + ??) AS ??', ['from_gen_to_consumer', 'from_gen_to_batt', 'consumption'])).from('history_daily_1').groupBy('id', 'date').orderBy('date');
                break;
        }

        query = db.select('date', db.raw('ROUND(AVG(production)::numeric, 2)::float AS production, ROUND(AVG(consumption)::numeric, 2)::float AS consumption FROM(??) AS subquery', subquery)).groupBy('date');

        var panelsCount = await count.then(result => {
            return result[0];
        });

        panelsCount.count = parseInt(panelsCount.count, 10);

        // Query execution and response building
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
        description: 'Get panels production and consumption by time period',
        notes: 'Returns panels production and consumption as an array of objects',
        tags: ['api'],
        validate: {
            // Input validation
            params: Joi.object().keys({
                time_period: Joi.string().required().description('the period of time taken into account (week, month or total)')
            })
        },
        response: {
            // Output validation
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