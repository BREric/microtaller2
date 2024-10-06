const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('supertest');
const assert = require('assert');
const Ajv = require('ajv');
const ajv = new Ajv();
require('ajv-formats')(ajv);
const apiURL = require('../support/supertestConfig');
const apiSchema = require('../../schemas/apiResponsesSchema.json');

let response;
let authToken;

// Step 1: Actualizar la información del usuario autenticado
Given('Soy un usuario autenticado', async function () {
    const loginResponse = await request(apiURL)
        .post('/login')
        .send({ username: 'Jhonatan', password: '123456' });

    authToken = loginResponse.body.token;

    const uniqueValue = Date.now().toString();
    this.userData = {
        username: 'Jhonatan',
        email: `Jhonatanv${uniqueValue}@example.com`
    };
});

When('invoco el servicio de actualización del usuario', async function () {
    response = await request(apiURL)
        .put('/update_user')
        .set('Authorization', `Bearer ${authToken}`)
        .send(this.userData);
});

Then('un código de estado {int}', function (expectedStatusCode) {
    assert.strictEqual(response.status, expectedStatusCode);

    // Validar la respuesta cuando el código es 204 (No Content)
    if (expectedStatusCode === 204) {
        const valid = ajv.validate(apiSchema.properties.NoContentResponse, response.body);
        assert.strictEqual(valid, true, 'La respuesta no coincide con el esquema JSON');
        if (!valid) {
            console.log('Errores de validación:', ajv.errors);
        }
    }
});

// Step 2: Intentar actualizar una cuenta que no es la mía
Given('Soy un usuario autenticado pero ingreso a una cuenta que no es mía', async function () {
    const loginResponse = await request(apiURL)
        .post('/login')
        .send({ username: 'Jhonatan', password: '123456' });

    authToken = loginResponse.body.token;
    this.otherUserData = {
        username: 'anotherUser',
        email: 'anotheremail@example.com'
    };
});

When('realizo la solicitud de actualización de un usuario diferente al mío', async function () {
    response = await request(apiURL)
        .put('/update_user')
        .set('Authorization', `Bearer ${authToken}`)
        .send(this.otherUserData);
});

Then('obtengo un código de estado 403 que indica que no tengo permisos', function () {
    assert.strictEqual(response.status, 403);

    // Validar la estructura de la respuesta de error con JSON Schema
    const valid = ajv.validate(apiSchema.properties.ErrorResponse, response.body);
    assert.strictEqual(valid, true, 'La respuesta de error no coincide con el esquema JSON');
    if (!valid) {
        console.log('Errores de validación:', ajv.errors);
    }
});

// Step 3: Intentar actualizar la información del usuario sin autenticar
Given('Soy un usuario no autenticado', function () {
    // No se necesita configurar userData aquí
});

When('realizo la solicitud de actualización del usuario', async function () {
    response = await request(apiURL)
        .put('/update_user')  // Intentando actualizar sin token
        .send({ username: 'Jhonatan', email: 'Jhonatanv2@example.com' }); // Enviamos datos
});

Then('obtengo un código de estado 401', function () {
    assert.strictEqual(response.status, 401);
    // Validar la estructura de la respuesta de error con JSON Schema
    const valid = ajv.validate(apiSchema.properties.UnauthorizedResponse, response.body);
    assert.strictEqual(valid, true, 'La respuesta de error no coincide con el esquema JSON');
    if (!valid) {
        console.log('Errores de validación:', ajv.errors);
    }
});
