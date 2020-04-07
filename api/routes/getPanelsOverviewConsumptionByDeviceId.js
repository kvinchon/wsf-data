const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const panelSchema = Joi.object({
    panels: Joi.number().required(),
    battery: Joi.number().required(),
    grid: Joi.number().required()
});

module.exports = {
    method: 'GET',
    path: '/api/panels/overview/consumption/{time_period}/{device_id}',
    handler: async (req, toolkit) => {
        switch (req.params.time_period) {
            case "week":
                subquery = db.select('id', 'date', db.raw('SUM(??) / SUM(?? + ?? + ??) * 100 AS ??', ['from_gen_to_consumer', 'from_gen_to_consumer', 'from_gen_to_batt', 'from_grid_to_consumer', 'panels']), db.raw('SUM(??) / SUM(?? + ?? + ??) * 100 AS ??', ['from_gen_to_batt', 'from_gen_to_consumer', 'from_gen_to_batt', 'from_grid_to_consumer', 'battery']), db.raw('SUM(??) / SUM(?? + ?? + ??) * 100 AS ??', ['from_grid_to_consumer', 'from_gen_to_consumer', 'from_gen_to_batt', 'from_grid_to_consumer', 'grid'])).from('history_daily_1').where('id', req.params.device_id).andWhere('date', '>=', '2019-10-01 00:00:00').andWhere('date', '<', '2019-10-08 00:00:00').groupBy('id', 'date');

                return await db.raw('SELECT AVG(panels) AS panels, AVG(battery) AS battery, AVG(grid) AS grid FROM(??) AS subquery', subquery)
                    .then(result => {
                        panels = result.rows[0].panels;
                        battery = result.rows[0].battery;
                        grid = result.rows[0].grid;

                        result = [
                            {
                                panels: panels,
                                battery: battery,
                                grid: grid
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
                subquery = db.select('id', 'date', db.raw('SUM(??) / SUM(?? + ?? + ??) * 100 AS ??', ['from_gen_to_consumer', 'from_gen_to_consumer', 'from_gen_to_batt', 'from_grid_to_consumer', 'panels']), db.raw('SUM(??) / SUM(?? + ?? + ??) * 100 AS ??', ['from_gen_to_batt', 'from_gen_to_consumer', 'from_gen_to_batt', 'from_grid_to_consumer', 'battery']), db.raw('SUM(??) / SUM(?? + ?? + ??) * 100 AS ??', ['from_grid_to_consumer', 'from_gen_to_consumer', 'from_gen_to_batt', 'from_grid_to_consumer', 'grid'])).from('history_daily_1').where('id', req.params.device_id).andWhere('date', '>=', '2019-10-01 00:00:00').andWhere('date', '<', '2019-11-01 00:00:00').groupBy('id', 'date');

                return await db.raw('SELECT AVG(panels) AS panels, AVG(battery) AS battery, AVG(grid) AS grid FROM(??) AS subquery', subquery)
                    .then(result => {
                        panels = result.rows[0].panels;
                        battery = result.rows[0].battery;
                        grid = result.rows[0].grid;

                        result = [
                            {
                                panels: panels,
                                battery: battery,
                                grid: grid
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
                subquery = db.select('id', 'date', db.raw('SUM(??) / SUM(?? + ?? + ??) * 100 AS ??', ['from_gen_to_consumer', 'from_gen_to_consumer', 'from_gen_to_batt', 'from_grid_to_consumer', 'panels']), db.raw('SUM(??) / SUM(?? + ?? + ??) * 100 AS ??', ['from_gen_to_batt', 'from_gen_to_consumer', 'from_gen_to_batt', 'from_grid_to_consumer', 'battery']), db.raw('SUM(??) / SUM(?? + ?? + ??) * 100 AS ??', ['from_grid_to_consumer', 'from_gen_to_consumer', 'from_gen_to_batt', 'from_grid_to_consumer', 'grid'])).from('history_daily_1').where('id', req.params.device_id).groupBy('id', 'date');

                return await db.raw('SELECT AVG(panels) AS panels, AVG(battery) AS battery, AVG(grid) AS grid FROM(??) AS subquery', subquery)
                    .then(result => {
                        panels = result.rows[0].panels;
                        battery = result.rows[0].battery;
                        grid = result.rows[0].grid;

                        result = [
                            {
                                panels: panels,
                                battery: battery,
                                grid: grid
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
            })
        }
    }
}