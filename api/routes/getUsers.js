const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const userSchema = Joi.object({
    id: Joi.number().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required(),
    typology: Joi.string().allow(null),
    status: Joi.string().required(),
    created_on: Joi.date().timestamp().required(),
    zipcode: Joi.string(),
    city: Joi.string()
});

module.exports = {
    method: 'GET',
    path: '/api/users/{user_id?}',
    handler: async (req, toolkit) => {
        if (req.params.user_id) {
            var usersCount = await db.count().from('users').where('id', req.params.user_id).then(result => {
                return result[0];
            });

            if (usersCount.count > 0) {
                return await db.select().from('users').where('id', req.params.user_id).orderBy('id').limit(req.query.limit).offset(req.query.offset)
                .then(result => {
                    return toolkit.response({
                        statusCode: 200,
                        message: 'Successful',
                        errors: null,
                        meta: usersCount,
                        data: {
                            result
                        }
                    }).code(200);
                });
            }
            else {
                return toolkit.response({
                    statusCode: 404,
                    message: 'Not Found',
                    errors: 'User id does not exist'
                }).code(404);
            }
        }
        else {
            usersCount = await db.count().from('users').then(result => {
                return result[0];
            });

            return await db.select('first_name', 'last_name', 'email', 'typology', 'status', 'id', 'created_on').from('users').orderBy('id').limit(req.query.limit).offset(req.query.offset)
                .then(result => {
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
        }
    },
    options: {
        description: 'Get users',
        notes: 'Returns users as an array of objects',
        tags: ['api'],
        validate: {
            params: Joi.object().keys({
                user_id: Joi.number().min(1).description('the user ID (optional)')
            }),
            query: Joi.object().keys({
                limit: Joi.number().integer().min(1).max(100).default(20),
                offset: Joi.number().integer().min(0).default(0)
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
            }),
            failAction: 'log'
        }
    }
}