const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const userSchema = Joi.object({
    id: Joi.number().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    category: Joi.string().required(),
    date: Joi.date().required(),
    status: Joi.string().required(),
    care: Joi.string().required()
});

module.exports = {
    method: 'GET',
    path: '/api/notifications/{time_period}',
    handler: async (req, toolkit) => {
        var count, query;

        switch (req.params.time_period) {
            case "today":
                count = db.count().from('notification').where('date', '>=', '2019-12-31').andWhere('date', '<', '2020-01-01');
                query = db.raw("SELECT u.id, u.first_name, u.last_name, n.category, n.date, n.status, n.care FROM notification n INNER JOIN users u ON n.user_id = u.id WHERE n.date >= '2019-12-31' AND n.date < '2020-01-01' ORDER BY (case n.care when 'immédiatement' then 1 when 'dans la semaine' then 2 when 'durant le mois' then 3 end), n.date DESC");
                break;
            case "week":
                count = db.count().from('notification').where('date', '>=', '2019-12-25').andWhere('date', '<', '2020-01-01');
                query = db.raw("SELECT u.id, u.first_name, u.last_name, n.category, n.date, n.status, n.care FROM notification n INNER JOIN users u ON n.user_id = u.id WHERE n.date >= '2019-12-25' AND n.date < '2020-01-01' ORDER BY (case n.care when 'immédiatement' then 1 when 'dans la semaine' then 2 when 'durant le mois' then 3 end), n.date DESC");
                break;
            case "month":
                count = db.count().from('notification').where('date', '>=', '2019-12-01').andWhere('date', '<', '2020-01-01');
                query = db.raw("SELECT u.id, u.first_name, u.last_name, n.category, n.date, n.status, n.care FROM notification n INNER JOIN users u ON n.user_id = u.id WHERE n.date >= '2019-12-01' AND n.date < '2020-01-01' ORDER BY (case n.care when 'immédiatement' then 1 when 'dans la semaine' then 2 when 'durant le mois' then 3 end), n.date DESC");
                break;
            case "total":
                count = db.count().from('notification');
                query = db.raw("SELECT u.id, u.first_name, u.last_name, n.category, n.date, n.status, n.care FROM notification n INNER JOIN users u ON n.user_id = u.id ORDER BY (case n.care when 'immédiatement' then 1 when 'dans la semaine' then 2 when 'durant le mois' then 3 end), n.date DESC");
                break;
        }

        var notificationsCount = await count.then(result => {
            return result[0];
        });

        notificationsCount.count = parseInt(notificationsCount.count, 10);

        return await query
            .then(result => {
                result = result.rows;
                return toolkit.response({
                    statusCode: 200,
                    message: 'Successful',
                    errors: null,
                    meta: notificationsCount,
                    data: {
                        result
                    }
                }).code(200);
            });
    },
    options: {
        description: 'Get notifications by time period',
        notes: 'Returns notifications as an array of objects',
        tags: ['api'],
        validate: {
            params: Joi.object().keys({
                time_period: Joi.string().required().description('the period of time taken into account (today, week, month or total)')
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