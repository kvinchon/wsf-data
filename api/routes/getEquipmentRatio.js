const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const db = require('../config/database');

const userSchema = Joi.object({
    equipment_type: Joi.string().required(),
    consumption: Joi.number().required(),
    equipment_ratio: Joi.number().required()
});

module.exports = {
    method: 'GET',
    path: '/api/equipment/ratio',
    handler: async (req, toolkit) => {
        var equipementCount = await db.count().from('equipment').then(result => {
            return result[0];
        });

        var subquery = db.select('equipment.type AS equipment_type', 'equipment.consumption AS consumption', db.raw('COUNT(*) AS nb_users')).from('users_equipment').innerJoin('users', 'users_equipment.users_id', 'users.id').innerJoin('equipment', 'users_equipment.equipment_id', 'equipment.id').groupBy('equipment.type', 'equipment.consumption');
        var query = db.raw("SELECT equipment_type, consumption, (nb_users / COUNT(*)::float * 100) AS equipment_ratio FROM (??) sq, users u WHERE u.status = 'client' GROUP BY equipment_type, consumption, nb_users ORDER BY equipment_ratio DESC", subquery);

        return await query
            .then(result => {
                result = result.rows;
                return toolkit.response({
                    statusCode: 200,
                    message: 'Successful',
                    errors: null,
                    meta: equipementCount,
                    data: {
                        result
                    }
                }).code(200);
            });
    },
    options: {
        description: 'Get equipment ratio',
        notes: 'Returns equipment ratio as an array of objects',
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