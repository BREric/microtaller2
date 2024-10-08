const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('supertest');
const assert = require('assert');
const Ajv = require('ajv');
const ajv = new Ajv();
require('ajv-formats')(ajv);
const apiURL = require('../support/supertestConfig');
const apiSchema = require('../schemas/apiResponsesSchema.json');

let response;
let token;

// Scenario 1: Yo como usuario autenticado quiero una lista con la información de otros usuarios
Given('Soy un usuario autenticado y listar los usuarios', async function () {
    // Realizamos login para obtener el token de autenticación
    const loginResponse = await request(apiURL)
        .post('/login')
        .send({
            username: 'Jhonatan',
            password: '123456'
        });

    assert.strictEqual(loginResponse.statusCode, 200);
    token = loginResponse.body.token;  // Guardamos el token de autenticación
});

When('realizo una solicitud GET a users seguido de page=1&limit=20', async function () {
    response = await request(apiURL)
        .get('/users?page=1&limit=20')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
});

Then('obtengo una lista con la información de otros usuarios', function () {
    assert(Array.isArray(response.body), 'La respuesta no es una lista de usuarios.');
    assert(response.body.length > 0, 'La lista de usuarios está vacía.');

    // Validar la estructura de la lista de usuarios con JSON Schema
    const valid = ajv.validate(apiSchema.properties.GetUsersResponse, response.body);
    assert.strictEqual(valid, true, 'La respuesta no coincide con el esquema JSON');
    if (!valid) {
        console.log('Errores de validación:', ajv.errors);
    }
});

Then('obtengo un código de estado 200 que me indica que la solicitud fue exitosa', function () {
    assert.strictEqual(response.statusCode, 200);
});

// Scenario 2: Como usuario sin autenticarse intento obtener una lista con la información de otros usuarios
Given('No estoy autenticado', function () {
    token = null;  // No asignamos token para simular que no estamos autenticados
});

When('hago una solicitud GET a users seguido de page=1&limit=20', async function () {
    response = await request(apiURL)
        .get('/users?page=1&limit=20')
        .set('Accept', 'application/json');
});

Then('obtengo un codigo de estado 401', function () {
    assert.strictEqual(response.statusCode, 401, `Expected status code 401 but got ${response.statusCode}`);
});

Then('un mensaje que indique que no tengo autorización', function () {

    // Validar la estructura de la respuesta de error con JSON Schema
    const valid = ajv.validate(apiSchema.properties.UnauthorizedResponse, response.body);
    assert.strictEqual(valid, true, 'La respuesta de error no coincide con el esquema JSON');
    if (!valid) {
        console.log('Errores de validación:', ajv.errors);
    }

    assert(
        response.body.error && response.body.error.includes('Authorization header required') ||
        response.body.message && response.body.message.includes('Authorization header required'),
        'El mensaje no indica que faltan credenciales válidas.'
    );
});
