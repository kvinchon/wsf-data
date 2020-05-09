const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const userSchema = Joi.object({
    label: Joi.string().required(),
    ratio: Joi.number().required()
});

module.exports = {
    method: 'GET',
    path: '/api/users/ratio/{filter}',
    handler: async (req, toolkit) => {
        var count, query;

        // Query building
        switch (req.params.filter) {
            case "typology":
                count = db.countDistinct('typology').from('users').whereNotNull('typology');
                query = db.select('typology as label', db.raw('COUNT(*)::int as ratio')).from('users').where('status', 'client').groupBy('typology');
                break;
            case "status":
                count = db.countDistinct('status').from('users');
                query = db.select('status as label', db.raw('COUNT(*)::int as ratio')).from('users').groupBy('status');
                break;
        }

        var filterCount = await count.then(result => {
            return result[0];
        });

        filterCount.count = parseInt(filterCount.count, 10);

        // Query execution and response building
        return await query
            .then(result => {
                return toolkit.response({
                    statusCode: 200,
                    message: 'Successful',
                    errors: null,
                    meta: filterCount,
                    data: {
                        result
                    }
                }).code(200);
            });
    },
    options: {
        description: 'Get users ratio by filter',
        notes: 'Returns users ratio',
        tags: ['api'],
        validate: {
            // Input validation
            params: Joi.object().keys({
                filter: Joi.string().required().description('the filter to which the ratio applies (typology or status)')
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