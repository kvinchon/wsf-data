require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

(async () => {
    const server = await new Hapi.Server({
        host: 'localhost',
        port: 3000,
        routes: {
            cors: true
        }
    });

    const swaggerOptions = {
        info: {
                title: 'API Documentation',
                version: Pack.version,
            },
        };

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    try {
        await server.start();
        console.log('Server running at:', server.info.uri);
    } catch(err) {
        console.log(err);
	}
    
    server.route(require('./routes/getUsers'));
    server.route(require('./routes/getUsersByStatus'));
    server.route(require('./routes/getUsersRatio'));
    server.route(require('./routes/getPanels'));
    server.route(require('./routes/getPanelsProductionRatio'));
    server.route(require('./routes/getPanelsConsumptionRatio'));
    server.route(require('./routes/getFronius'));
    server.route(require('./routes/getEquipmentRatio'));
    server.route(require('./routes/getInterventionsRatio'));
    server.route(require('./routes/getUserInterventions'));
    server.route(require('./routes/getPanelsProductionEvolution'));
    server.route(require('./routes/getPanelsConsumptionEvolution'));
    server.route(require('./routes/getAdvisorNotifications'));
    server.route(require('./routes/getAdvisorObjectives'));
    server.route(require('./routes/getAdvisorAppointments'));
})();