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
    path: '/api/interventions/{user_id}/{month?}',
    handler: async (req, toolkit) => {
        var count, query;

        // Query building
        if (req.params.month) {
            var dateStart, dateEnd, currentMonth, nextMonth;

            currentMonth = req.params.month;

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
        }
        else {
            count = db.count().from('users_intervention').where('user_id', req.params.user_id);
            query = db.select('intervention.name', 'intervention.nature', 'users_intervention.date', 'users_intervention.status').from('users_intervention').innerJoin('users', 'users_intervention.user_id', 'users.id').innerJoin('intervention', 'users_intervention.intervention_id', 'intervention.id').where('users.id', req.params.user_id).orderBy('users_intervention.date', 'desc');
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
        description: 'Get user interventions by user id and month (optional)',
        notes: 'Returns user interventions as an array of objects',
        tags: ['api'],
        validate: {
            // Input validation
            params: Joi.object().keys({
                user_id: Joi.number().min(1).required().description('the user ID'),
                month: Joi.number().min(1).max(12).description('the month from 1 to 12 (optional)')
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