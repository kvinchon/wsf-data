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
                title: 'Test API Documentation',
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

    server.route(require('./routes/getPanels'));
    server.route(require('./routes/getPanelsByDeviceId'));
    server.route(require('./routes/getPanelsProduction'));
    server.route(require('./routes/getPanelsProductionByUserId'));
    server.route(require('./routes/getPanelsOverviewConsumptionByDeviceId'));
    server.route(require('./routes/getPanelsProductionRatio'));
    server.route(require('./routes/getPanelsProductionRatioByUserId'));
    server.route(require('./routes/getPanelsConsumptionRatio'));
    server.route(require('./routes/getPanelsConsumptionRatioByUserId'));
    server.route(require('./routes/getPanelsConsumption'));
    server.route(require('./routes/getPanelsConsumptionByUserId'));
    server.route(require('./routes/getFronius'));
    server.route(require('./routes/getFroniusByDeviceId'));
    server.route(require('./routes/getFroniusOverviewProductionByDeviceId'));
    server.route(require('./routes/getUsers'));
})();