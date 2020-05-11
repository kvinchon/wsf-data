const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const userSchema = Joi.object({
    status: Joi.string().required(),
    total: Joi.number().required(),
    new: Joi.number().required()
});

module.exports = {
    method: 'GET',
    path: '/api/users/status/{status}',
    handler: async (req, toolkit) => {
        var count, subquery, query;

        // Query building
        switch (req.params.status) {
            case "lead":
                count = db.countDistinct('status').from('users').where('status', 'lead');
                subquery = db.select('status', db.raw('COUNT(*)::int as new'), ).from('users').where('status', 'lead').andWhere('created_on', '>=', '2019-12-01').andWhere('created_on', '<', '2020-01-01').groupBy('status');
                query = db.raw("SELECT u.status, COUNT(*)::int as total, sq.new FROM(??) AS sq, users AS u WHERE u.status = 'lead' GROUP BY u.status, sq.new", subquery);
                break;
            case "prospect":
                count = db.countDistinct('status').from('users').where('status', 'prospect');
                subquery = db.select('status', db.raw('COUNT(*)::int as new'), ).from('users').where('status', 'prospect').andWhere('created_on', '>=', '2019-12-01').andWhere('created_on', '<', '2020-01-01').groupBy('status');
                query = db.raw("SELECT u.status, COUNT(*)::int as total, sq.new FROM(??) AS sq, users AS u WHERE u.status = 'prospect' GROUP BY u.status, sq.new", subquery);
                break;
            case "client":
                count = db.countDistinct('status').from('users').where('status', 'client');
                subquery = db.select('status', db.raw('COUNT(*)::int as new'), ).from('users').where('status', 'client').andWhere('created_on', '>=', '2019-12-01').andWhere('created_on', '<', '2020-01-01').groupBy('status');
                query = db.raw("SELECT u.status, COUNT(*)::int as total, sq.new FROM(??) AS sq, users AS u WHERE u.status = 'client' GROUP BY u.status, sq.new", subquery);
                break;
        }

        var statusCount = await count.then(result => {
            return result[0];
        });

        statusCount.count = parseInt(statusCount.count, 10);

        // Query execution and response building
        return await query
            .then(result => {
                result = result.rows;

                return toolkit.response({
                    statusCode: 200,
                    message: 'Successful',
                    errors: null,
                    meta: statusCount,
                    data: {
                        result
                    }
                }).code(200);
            });
    },
    options: {
        description: 'Get number of users by status',
        notes: 'Returns number of users',
        tags: ['api'],
        validate: {
            // Input validation
            params: Joi.object().keys({
                status: Joi.string().required().description('the user status (lead, prospect or client)')
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