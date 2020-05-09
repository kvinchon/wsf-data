const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const userSchema = Joi.object({
    intervention: Joi.string().allow(null),
    id: Joi.number().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required(),
    typology: Joi.string().allow(null),
    status: Joi.string().required(),
    created_on: Joi.date().required(),
    zipcode: Joi.string(),
    city: Joi.string(),
    surface: Joi.number(),
    nb_people: Joi.number(),
    nb_panels: Joi.number(),
    household_type: Joi.string(),
    total_interventions: Joi.number(),
    daily_consumption: Joi.number()
});

module.exports = {
    method: 'GET',
    path: '/api/users/{user_id?}',
    handler: async (req, toolkit) => {
        var count, subquery, query;

        // Query building
        if (req.params.user_id) {
            count = db.count().from('users').where('id', req.params.user_id);
            subquery = db.select('id', 'date', db.raw('SUM(?? + ?? + ??) as consumption', ['from_gen_to_consumer', 'from_gen_to_batt', 'from_grid_to_consumer'])).from('history_daily_1').where('user_id', req.params.user_id).groupBy('id', 'date').orderBy('date');
            query = db.raw("SELECT u.*, COUNT(DISTINCT ui.date)::int as total_interventions, ROUND(AVG(sq.consumption)::numeric / 1000, 1)::float as daily_consumption FROM (??) as sq, users u INNER JOIN users_intervention ui ON u.id = ui.user_id WHERE u.id = ?? AND ui.date < '2019-12-01' GROUP BY u.id LIMIT ?? OFFSET ??", [subquery, req.params.user_id, req.query.limit, req.query.offset]);
        }
        else {
            count = db.count().from('users');
            subquery = db.raw("SELECT ui.status as st, u.first_name, u.last_name, u.email, u.typology, u.status, u.id, u.created_on FROM users u LEFT JOIN users_intervention ui ON u.id = ui.user_id WHERE ui.status IN ('urgent', 'à venir') OR ui.status IS NULL GROUP BY st, u.first_name, u.last_name, u.email, u.typology, u.status, u.id, u.created_on");
            query = db.raw("SELECT MAX(sq.st) as intervention, sq.first_name, sq.last_name, sq.email, sq.typology, sq.status, sq.id, sq.created_on FROM (??) as sq GROUP BY sq.first_name, sq.last_name, sq.email, sq.typology, sq.status, sq.id, sq.created_on ORDER BY sq.created_on DESC LIMIT ?? OFFSET ??", [subquery, req.query.limit, req.query.offset]);
        }

        var usersCount = await count.then(result => {
            return result[0];
        });

        usersCount.count = parseInt(usersCount.count, 10);

        // Query execution and response building 
        return await query.then(result => {
            if (result.rows) {
                result = result.rows;
            }
            
            return toolkit.response({
                statusCode: 200,
                message: 'Successful',
                errors: null,
                meta: usersCount,
                data: {
                    result
                }
            }).code(200);
        })
    },
    options: {
        description: 'Get users',
        notes: 'Returns users as an array of objects',
        tags: ['api'],
        validate: {
            // Input validation
            params: Joi.object().keys({
                user_id: Joi.number().min(1).description('the user ID (optional)')
            }),
            // Query parameters
            query: Joi.object().keys({
                limit: Joi.number().integer().min(1).max(100).default(20),
                offset: Joi.number().integer().min(0).default(0)
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
                    result: Joi.array().items(userSchema)
                })
            })
        }
    }
}