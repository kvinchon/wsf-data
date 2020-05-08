const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const objectiveSchema = Joi.object({
    title: Joi.string().required(),
    category: Joi.string().required(),
    remaining: Joi.number().required(),
    deadline: Joi.date().allow(null),
    completed: Joi.string().required()
});

module.exports = {
    method: 'GET',
    path: '/api/objectives/{advisor_id}',
    handler: async (req, toolkit) => {
        var count, query;

        if (req.params.advisor_id) {
            count = db.count().from('advisor_objective').where('advisor_id', req.params.advisor_id);
            query = db.select('title', 'category', 'remaining', 'deadline', db.raw("CONCAT(completed * 100, '%') as completed")).from('advisor_objective').where('advisor_id', req.params.advisor_id).orderBy('completed', 'desc');
        }

        var objectivesCount = await count.then(result => {
            return result[0];
        });

        objectivesCount.count = parseInt(objectivesCount.count, 10);

        return await query
            .then(result => {
                return toolkit.response({
                    statusCode: 200,
                    message: 'Successful',
                    errors: null,
                    meta: objectivesCount,
                    data: {
                        result
                    }
                }).code(200);
            });
    },
    options: {
        description: 'Get objectives by advisor id',
        notes: 'Returns objectives as an array of objects',
        tags: ['api'],
        validate: {
            params: Joi.object().keys({
                advisor_id: Joi.number().required().description('the advisor ID')
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
                    result: Joi.array().items(objectiveSchema)
                }).required()
            })
        }
    }
}