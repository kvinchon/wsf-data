const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const interventionSchema = Joi.object({
    name: Joi.string().required(),
    nature: Joi.string().required(),
    date: Joi.date().required(),
    status: Joi.string().required()
});

module.exports = {
    method: 'GET',
    path: '/api/interventions/{time_period}/{user_id}',
    handler: async (req, toolkit) => {
        var count, query;

        switch (req.params.time_period) {
            case "today":
                count = db.count().from('users_intervention').where('user_id', req.params.user_id).andWhere('date', '2019-12-31');
                query = db.select('intervention.name', 'intervention.nature', 'users_intervention.date', 'users_intervention.status').from('users_intervention').innerJoin('users', 'users_intervention.user_id', 'users.id').innerJoin('intervention', 'users_intervention.intervention_id', 'intervention.id').where('users.id', req.params.user_id).andWhere('users_intervention.date', '2019-12-31').orderBy('users_intervention.date', 'desc');
                break;
            case "week":
                count = db.count().from('users_intervention').where('user_id', req.params.user_id).andWhere('date', '>=', '2019-12-25').andWhere('date', '<', '2020-01-01');
                query = db.select('intervention.name', 'intervention.nature', 'users_intervention.date', 'users_intervention.status').from('users_intervention').innerJoin('users', 'users_intervention.user_id', 'users.id').innerJoin('intervention', 'users_intervention.intervention_id', 'intervention.id').where('users.id', req.params.user_id).andWhere('users_intervention.date', '>=', '2019-12-25').andWhere('users_intervention.date', '<', '2020-01-01').orderBy('users_intervention.date', 'desc');
                break;
            case "month":
                count = db.count().from('users_intervention').where('user_id', req.params.user_id).andWhere('date', '>=', '2019-12-01').andWhere('date', '<', '2020-01-01');
                query = db.select('intervention.name', 'intervention.nature', 'users_intervention.date', 'users_intervention.status').from('users_intervention').innerJoin('users', 'users_intervention.user_id', 'users.id').innerJoin('intervention', 'users_intervention.intervention_id', 'intervention.id').where('users.id', req.params.user_id).andWhere('users_intervention.date', '>=', '2019-12-01').andWhere('users_intervention.date', '<', '2020-01-01').orderBy('users_intervention.date', 'desc');
                break;
            case "total":
                count = db.count().from('users_intervention').where('user_id', req.params.user_id);
                query = db.select('intervention.name', 'intervention.nature', 'users_intervention.date', 'users_intervention.status').from('users_intervention').innerJoin('users', 'users_intervention.user_id', 'users.id').innerJoin('intervention', 'users_intervention.intervention_id', 'intervention.id').where('users.id', req.params.user_id).orderBy('users_intervention.date', 'desc');
                break;
            default:
                var dateStart, dateEnd, currentMonth, nextMonth;
                currentMonth = parseInt(req.params.time_period, 10);

                // If December, next month is January
                if (currentMonth === 12) {
                    nextMonth = '01';
                    dateEnd = '2020-' + nextMonth + '-01';
                }
                else {
                    nextMonth = currentMonth + 1;
                    // Month construction in the format "2-digit"
                    if (currentMonth < 10) {
                        currentMonth = '0' + currentMonth.toString();
                        if (currentMonth < 9) {
                            nextMonth = '0' + nextMonth.toString();
                        }
                    }
                    dateEnd = '2019-' + nextMonth + '-01';
                }

                dateStart = '2019-' + currentMonth + '-01';
                count = db.count().from('users_intervention').where('user_id', req.params.user_id).andWhere('date', '>=', dateStart).andWhere('date', '<', dateEnd);
                query = db.select('intervention.name', 'intervention.nature', 'users_intervention.date', 'users_intervention.status').from('users_intervention').innerJoin('users', 'users_intervention.user_id', 'users.id').innerJoin('intervention', 'users_intervention.intervention_id', 'intervention.id').where('users.id', req.params.user_id).andWhere('users_intervention.date', '>=', dateStart).andWhere('users_intervention.date', '<', dateEnd).orderBy('users_intervention.date', 'desc');
                break;
        }

        var interventionCount = await count.then(result => {
            return result[0];
        });

        interventionCount.count = parseInt(interventionCount.count, 10);

        // Query execution and response building
        return await query
            .then(result => {
                return toolkit.response({
                    statusCode: 200,
                    message: 'Successful',
                    errors: null,
                    meta: interventionCount,
                    data: {
                        result
                    }
                }).code(200);
            });
    },
    options: {
        description: 'Get user interventions by time period and user id',
        notes: 'Returns user interventions as an array of objects',
        tags: ['api'],
        validate: {
            // Input validation
            params: Joi.object().keys({
                time_period: Joi.string().required().description('the period of time taken into account (today, week, month, total) or a specific month from 1 to 12'),
                user_id: Joi.number().min(1).required().description('the user ID')
            })
        },
        response: {
            // Output validation
            schema: Joi.object({
                statusCode: Joi.number().integer().required(),
                message: Joi.string().required(),
                errors: Joi.string().allow(null),
                meta: Joi.object({
                    count: Joi.number().integer().required()
                }),
                data: Joi.object({
                    result: Joi.array().items(interventionSchema)
                })
            })
        }
    }
}