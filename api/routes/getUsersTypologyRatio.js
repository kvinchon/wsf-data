const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const userSchema = Joi.object({
    typology: Joi.string().required(),
    ratio: Joi.string().required()
});

module.exports = {
    method: 'GET',
    path: '/api/users/typology',
    handler: async (req, toolkit) => {
        count = await db.countDistinct('typology').from('users').whereNotNull('typology').then(result => {
            return result[0];
        });

        return await db.select('typology', db.raw('COUNT(*) as ratio')).from('users').whereNotNull('typology').groupBy('typology')
            .then(result => {
                return toolkit.response({
                    statusCode: 200,
                    message: 'Successful',
                    errors: null,
                    meta: count,
                    data: {
                        result
                    }
                }).code(200);
            });
    },
    options: {
        description: 'Get users typology ratio',
        notes: 'Returns typology ratio',
        tags: ['api'],
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