const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const appointmentsSchema = Joi.object({
    household: Joi.string().required(),
    method: Joi.string().required(),
    subject: Joi.string().required(),
    date: Joi.date().required()
});

module.exports = {
    method: 'GET',
    path: '/api/appointments/{advisor_id}/{today?}',
    handler: async (req, toolkit) => {
        var count, query;

        // Query building
        if (req.params.today) {
            count = db.count().from('advisor_appointment').where('advisor_id', req.params.advisor_id).andWhere('date', '2019-12-31');
            query = db.select('users.last_name as household', 'advisor_appointment.method', 'advisor_appointment.subject', 'advisor_appointment.date').from('advisor_appointment').innerJoin('users', 'advisor_appointment.user_id', 'users.id').where('advisor_appointment.advisor_id', req.params.advisor_id).andWhere('advisor_appointment.date', '2019-12-31').orderBy('advisor_appointment.date');
        }
        else {
            count = db.count().from('advisor_appointment').where('advisor_id', req.params.advisor_id);
            query = db.select('users.last_name as household', 'advisor_appointment.method', 'advisor_appointment.subject', 'advisor_appointment.date').from('advisor_appointment').innerJoin('users', 'advisor_appointment.user_id', 'users.id').where('advisor_appointment.advisor_id', req.params.advisor_id).andWhere('advisor_appointment.date', '>=', '2019-12-31 00:00:00').orderBy('advisor_appointment.date');
        
        }
        
        var appointmentsCount = await count.then(result => {
            return result[0];
        });

        appointmentsCount.count = parseInt(appointmentsCount.count, 10);

        // Query execution and response building
        return await query
            .then(result => {
                return toolkit.response({
                    statusCode: 200,
                    message: 'Successful',
                    errors: null,
                    meta: appointmentsCount,
                    data: {
                        result
                    }
                }).code(200);
            });
    },
    options: {
        description: 'Get appointments by advisor id and today (optional)',
        notes: 'Returns appointments as an array of objects',
        tags: ['api'],
        validate: {
            // Input validation
            params: Joi.object().keys({
                advisor_id: Joi.number().required().description('the advisor ID'),
                today: Joi.string().description('A string equal to today (optional)')
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
                    result: Joi.array().items(appointmentsSchema)
                }).required()
            })
        }
    }
}