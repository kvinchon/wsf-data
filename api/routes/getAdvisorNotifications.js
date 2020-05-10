const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const notificationSchema = Joi.object({
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
    path: '/api/notifications/{advisor_id}/{time_period}',
    handler: async (req, toolkit) => {
        var totalCount, criticalCount, query;

        // Query building
        switch (req.params.time_period) {
            case "today":
                totalCount = db.count().from('advisor_notification').where('advisor_id', req.params.advisor_id).andWhere('date', '>=', '2019-12-31').andWhere('date', '<', '2020-01-01');
                criticalCount = db.count().from('advisor_notification').where('advisor_id', req.params.advisor_id).andWhere('date', '>=', '2019-12-31').andWhere('date', '<', '2020-01-01').andWhere('status', 'urgent');
                query = db.raw("SELECT u.id, u.first_name, u.last_name, an.category, an.date, an.status, an.care FROM advisor_notification an INNER JOIN users u ON an.user_id = u.id WHERE an.advisor_id = ?? AND an.date >= '2019-12-31' AND an.date < '2020-01-01' ORDER BY (case an.care when 'immédiatement' then 1 when 'dans la semaine' then 2 when 'durant le mois' then 3 end), an.date DESC LIMIT ?? OFFSET ??", [req.params.advisor_id, req.query.limit, req.query.offset]);
                break;
            case "week":
                totalCount = db.count().from('advisor_notification').where('advisor_id', req.params.advisor_id).andWhere('date', '>=', '2019-12-25').andWhere('date', '<', '2020-01-01');
                criticalCount = db.count().from('advisor_notification').where('advisor_id', req.params.advisor_id).andWhere('date', '>=', '2019-12-25').andWhere('date', '<', '2020-01-01').andWhere('status', 'urgent');
                query = db.raw("SELECT u.id, u.first_name, u.last_name, an.category, an.date, an.status, an.care FROM advisor_notification an INNER JOIN users u ON an.user_id = u.id WHERE an.advisor_id = ?? AND an.date >= '2019-12-25' AND an.date < '2020-01-01' ORDER BY (case an.care when 'immédiatement' then 1 when 'dans la semaine' then 2 when 'durant le mois' then 3 end), an.date DESC LIMIT ?? OFFSET ??", [req.params.advisor_id, req.query.limit, req.query.offset]);
                break;
            case "month":
                totalCount = db.count().from('advisor_notification').where('advisor_id', req.params.advisor_id).andWhere('date', '>=', '2019-12-01').andWhere('date', '<', '2020-01-01');
                criticalCount = db.count().from('advisor_notification').where('advisor_id', req.params.advisor_id).andWhere('date', '>=', '2019-12-01').andWhere('date', '<', '2020-01-01').andWhere('status', 'urgent');
                query = db.raw("SELECT u.id, u.first_name, u.last_name, an.category, an.date, an.status, an.care FROM advisor_notification an INNER JOIN users u ON an.user_id = u.id WHERE an.advisor_id = ?? AND an.date >= '2019-12-01' AND an.date < '2020-01-01' ORDER BY (case an.care when 'immédiatement' then 1 when 'dans la semaine' then 2 when 'durant le mois' then 3 end), an.date DESC LIMIT ?? OFFSET ??", [req.params.advisor_id, req.query.limit, req.query.offset]);
                break;
            case "total":
                totalCount = db.count().from('advisor_notification').where('advisor_id', req.params.advisor_id);
                criticalCount = db.count().from('advisor_notification').where('advisor_id', req.params.advisor_id).andWhere('status', 'urgent');
                query = db.raw("SELECT u.id, u.first_name, u.last_name, an.category, an.date, an.status, an.care FROM advisor_notification an INNER JOIN users u ON an.user_id = u.id WHERE an.advisor_id = ?? ORDER BY (case an.care when 'immédiatement' then 1 when 'dans la semaine' then 2 when 'durant le mois' then 3 end), an.date DESC LIMIT ?? OFFSET ??", [req.params.advisor_id, req.query.limit, req.query.offset]);
                break;
        }

        totalCount = await totalCount.then(result => {
            return result[0];
        });
        criticalCount = await criticalCount.then(result => {
            return result[0];
        });

        totalCount.count = parseInt(totalCount.count, 10);
        criticalCount.count = parseInt(criticalCount.count, 10);

        var notificationsCount = {
            totalCount: totalCount.count,
            criticalCount: criticalCount.count,
        };

        // Query execution and response building
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
            // Input validation
            params: Joi.object().keys({
                advisor_id: Joi.number().required().description('the advisor ID'),
                time_period: Joi.string().required().description('the period of time taken into account (today, week, month or total)')
            }),
            // Query parameters
            query: Joi.object({
                limit: Joi.number().integer().min(1).max(100).default(5),
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
                    result: Joi.array().items(notificationSchema)
                })
            }),
            failAction: 'log'
        }
    }
}