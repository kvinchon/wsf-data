const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const userSchema = Joi.object({
    intervention_type: Joi.string().required(),
    category: Joi.string().required(),
    intervention_ratio: Joi.number().required()
});

module.exports = {
    method: 'GET',
    path: '/api/interventions/ratio',
    handler: async (req, toolkit) => {
        var interventionsCount = await db.count().from('intervention').where('type', 'not like', 'installation').then(result => {
            return result[0];
        });

        interventionsCount.count = parseInt(interventionsCount.count, 10);

        var subquery = db.select('intervention.type AS intervention_type', 'intervention.category AS category', db.raw('COUNT(*) AS nb_interventions')).from('users_intervention').innerJoin('users', 'users_intervention.user_id', 'users.id').innerJoin('intervention', 'users_intervention.intervention_id', 'intervention.id').where('intervention.type', 'not like', 'installation').groupBy('intervention.type', 'intervention.category');
        var query = db.raw("SELECT intervention_type, category, ROUND((nb_interventions / COUNT(*)::float * 100)::numeric, 1)::float AS intervention_ratio FROM (??) sq, users_intervention ui GROUP BY intervention_type, category, nb_interventions ORDER BY intervention_ratio DESC", subquery);

        return await query
            .then(result => {
                result = result.rows;
                return toolkit.response({
                    statusCode: 200,
                    message: 'Successful',
                    errors: null,
                    meta: interventionsCount,
                    data: {
                        result
                    }
                }).code(200);
            });
    },
    options: {
        description: 'Get interventions ratio',
        notes: 'Returns interventions ratio as an array of objects',
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