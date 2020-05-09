const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const panelSchema = Joi.object({
    consumption: Joi.number().required(),
    evolution: Joi.number().required()
});

module.exports = {
    method: 'GET',
    path: '/api/panels/consumption/evolution/{time_period}/{user_id}',
    handler: async (req, toolkit) => {
        var sq1, sq2, sq3, query;

        // Query building
        switch (req.params.time_period) {
            case "today":
                sq1 = db.raw("SELECT SUM(?? + ?? + ??) AS ?? FROM history_daily_1 WHERE user_id = ?? AND date >= '2019-12-01' AND date < '2019-12-02'", ['from_gen_to_consumer', 'from_grid_to_consumer', 'from_gen_to_batt', 'consumption', req.params.user_id]);
                sq2 = db.raw("SELECT SUM(?? + ?? + ??) AS ?? FROM history_daily_1 WHERE user_id = ?? AND date >= '2019-11-30' AND date < '2019-12-01'", ['from_gen_to_consumer', 'from_grid_to_consumer', 'from_gen_to_batt', 'consumption_old', req.params.user_id]);
                sq3 = db.raw('SELECT SUM(consumption) / 1000 as consumption, SUM(consumption_old) / 1000 as consumption_old FROM (??) AS sq1, (??) AS sq2', [sq1, sq2]);
                query = db.raw('SELECT ROUND(sq3.consumption) as consumption, ROUND((sq3.consumption - sq3.consumption_old) / sq3.consumption_old * 100) as evolution FROM (??) AS sq3', sq3);
                break;
            case "week":
                sq1 = db.raw("SELECT SUM(?? + ?? + ??) AS ?? FROM history_daily_1 WHERE user_id = ?? AND date >= '2019-12-01' AND date < '2019-12-08'", ['from_gen_to_consumer', 'from_grid_to_consumer', 'from_gen_to_batt', 'consumption', req.params.user_id]);
                sq2 = db.raw("SELECT SUM(?? + ?? + ??) AS ?? FROM history_daily_1 WHERE user_id = ?? AND date >= '2019-11-24' AND date < '2019-12-01'", ['from_gen_to_consumer', 'from_grid_to_consumer', 'from_gen_to_batt', 'consumption_old', req.params.user_id]);
                sq3 = db.raw('SELECT SUM(consumption) / 1000 as consumption, SUM(consumption_old) / 1000 as consumption_old FROM (??) AS sq1, (??) AS sq2', [sq1, sq2]);
                query = db.raw('SELECT ROUND(sq3.consumption) as consumption, ROUND((sq3.consumption - sq3.consumption_old) / sq3.consumption_old * 100) as evolution FROM (??) AS sq3', sq3);
                break;
            case "month":
                sq1 = db.raw("SELECT SUM(?? + ?? + ??) AS ?? FROM history_daily_1 WHERE user_id = ?? AND date >= '2019-12-01' AND date < '2020-01-01'", ['from_gen_to_consumer', 'from_grid_to_consumer', 'from_gen_to_batt', 'consumption', req.params.user_id]);
                sq2 = db.raw("SELECT SUM(?? + ?? + ??) AS ?? FROM history_daily_1 WHERE user_id = ?? AND date >= '2019-11-01' AND date < '2019-12-01'", ['from_gen_to_consumer', 'from_grid_to_consumer', 'from_gen_to_batt', 'consumption_old', req.params.user_id]);
                sq3 = db.raw('SELECT SUM(consumption) / 1000 as consumption, SUM(consumption_old) / 1000 as consumption_old FROM (??) AS sq1, (??) AS sq2', [sq1, sq2]);
                query = db.raw('SELECT ROUND(sq3.consumption) as consumption, ROUND((sq3.consumption - sq3.consumption_old) / sq3.consumption_old * 100) as evolution FROM (??) AS sq3', sq3);
                break;
            case "total":
                sq1 = db.raw("SELECT SUM(?? + ?? + ??) AS ?? FROM history_daily_1 WHERE user_id = ??", ['from_gen_to_consumer', 'from_grid_to_consumer', 'from_gen_to_batt', 'consumption', req.params.user_id]);
                sq2 = db.raw("SELECT SUM(?? + ?? + ??) AS ?? FROM history_daily_1 WHERE user_id = ??", ['from_gen_to_consumer', 'from_grid_to_consumer', 'from_gen_to_batt', 'consumption_old', req.params.user_id]);
                sq3 = db.raw('SELECT SUM(consumption) / 1000 as consumption, SUM(consumption_old) / 1000 as consumption_old FROM (??) AS sq1, (??) AS sq2', [sq1, sq2]);
                query = db.raw('SELECT ROUND(sq3.consumption) as consumption, ROUND((sq3.consumption - sq3.consumption_old) / sq3.consumption_old * 100) as evolution FROM (??) AS sq3', sq3);
                break;
        }

        // Query execution and response building
        return await query
            .then(result => {
                result = result.rows;

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
            });
    },
    options: {
        description: 'Get panels consumption evolution by time period and user id',
        notes: 'Returns panels consumption evolution as an array of objects',
        tags: ['api'],
        validate: {
            // Input validation
            params: Joi.object().keys({
                time_period: Joi.string().required().description('the period of time taken into account (today, week, month or total)'),
                user_id: Joi.number().min(1).required().description('the user ID (optional)')
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