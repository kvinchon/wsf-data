const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const userSchema = Joi.object({
    status: Joi.string().required(),
    total: Joi.string().required(),
    month: Joi.string().required()
});

module.exports = {
    method: 'GET',
    path: '/api/users/status/{status}',
    handler: async (req, toolkit) => {
        var count, subquery, query;
        switch (req.params.status) {
            case "lead":
                count = db.countDistinct('status').from('users').where('status', '=', 'lead');
                subquery = db.select('status', db.raw('COUNT(*) as month'), ).from('users').where('status', '=', 'lead').andWhere('created_on', '>=', '2020-04-01').andWhere('created_on', '<', '2020-05-01').groupBy('status');
                query = db.raw("SELECT u.status, COUNT(*) as total, sq.month FROM(??) AS sq, users AS u WHERE u.status = 'lead' GROUP BY u.status, sq.month", subquery);
                break;
            case "prospect":
                count = db.countDistinct('status').from('users').where('status', '=', 'prospect');
                subquery = db.select('status', db.raw('COUNT(*) as month'), ).from('users').where('status', '=', 'prospect').andWhere('created_on', '>=', '2020-04-01').andWhere('created_on', '<', '2020-05-01').groupBy('status');
                query = db.raw("SELECT u.status, COUNT(*) as total, sq.month FROM(??) AS sq, users AS u WHERE u.status = 'prospect' GROUP BY u.status, sq.month", subquery);
                break;
            case "client":
                count = db.countDistinct('status').from('users').where('status', '=', 'client');
                subquery = db.select('status', db.raw('COUNT(*) as month'), ).from('users').where('status', '=', 'client').andWhere('created_on', '>=', '2020-04-01').andWhere('created_on', '<', '2020-05-01').groupBy('status');
                query = db.raw("SELECT u.status, COUNT(*) as total, sq.month FROM(??) AS sq, users AS u WHERE u.status = 'client' GROUP BY u.status, sq.month", subquery);
                break;
        }

        var statusCount = await count.then(result => {
            return result[0];
        });

        return await query
            .then(result => {
                result = [{
                    status: result.rows[0].status,
                    total: result.rows[0].total,
                    month: result.rows[0].month,
                }];
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
            params: Joi.object().keys({
                status: Joi.string().required().description('the user status (lead, prospect or client)')
            })
        },
        response: {
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