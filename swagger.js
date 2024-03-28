const swaggerAutogen = require('swagger-autogen')();

const doc = {
    swagger: "2.0",
    info: {
        title: 'Bloocode Test API',
        description: 'API docs for Bloocode test',
    },
    host: 'localhost:9000/api/v1', 
    schemes: ['http', 'https'],
    tags: [
        {
            name: 'Employees Management',
            description: "Employees Management"
        },
        {
            name: 'Job-Role Management',
            description: "Job-Role Management"
        },
        {
            name: 'Users Management',
            description: "Users Management"
        },
    ],
    
};

const outputFile = './swagger-output.json';
const endpointsFiles = [
    './src/routers/index.ts',
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./dist/index.js');           // project's root file
})

