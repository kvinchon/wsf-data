const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const panelSchema = Joi.object({
    date: Joi.date().format('YYYY-MM-DD').required(),
    consumption: Joi.number().required()
});

module.exports = {
    method: 'GET',
    path: '/api/panels/consumption/{time_period}',
    handler: async (req, toolkit) => {
        switch (req.params.time_period) {
            case "week":
                panelsCount = await db.countDistinct('date').from('history_daily_1').where('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2019-12-08 00:00:00').then(result => {
                    return result[0];
                });

                subquery = db.select('id', 'date', db.raw('SUM(?? + ?? + ??) AS ??', ['from_gen_to_consumer', 'from_grid_to_consumer', 'from_gen_to_batt', 'consumption'])).from('history_daily_1').where('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2019-12-08 00:00:00').groupBy('id', 'date').orderBy('date');
                
                return await db.select('date', db.raw('AVG(consumption) AS consumption FROM(??) AS subquery', subquery)).groupBy('date')
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
                panelsCount = await db.countDistinct('date').from('history_daily_1').where('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2020-01-01 00:00:00').then(result => {
                    return result[0];
                });

                subquery = db.select('id', 'date', db.raw('SUM(?? + ?? + ??) AS ??', ['from_gen_to_consumer', 'from_grid_to_consumer', 'from_gen_to_batt', 'consumption'])).from('history_daily_1').where('date', '>=', '2019-12-01 00:00:00').andWhere('date', '<', '2020-01-01 00:00:00').groupBy('id', 'date').orderBy('date');
                
                return await db.select('date', db.raw('AVG(consumption) AS consumption FROM(??) AS subquery', subquery)).groupBy('date')
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
                panelsCount = await db.countDistinct('date').from('history_daily_1').then(result => {
                    return result[0];
                });

                subquery = db.select('id', 'date', db.raw('SUM(?? + ?? + ??) AS ??', ['from_gen_to_consumer', 'from_grid_to_consumer', 'from_gen_to_batt', 'consumption'])).from('history_daily_1').groupBy('id', 'date').orderBy('date');
                
                return await db.select('date', db.raw('AVG(consumption) AS consumption FROM(??) AS subquery', subquery)).groupBy('date')
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
        description: 'Get panels consumption by time period',
        notes: 'Returns panels consumption as an array of objects',
        tags: ['api'],
        validate: {
            params: Joi.object().keys({
                time_period: Joi.string().required(),
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