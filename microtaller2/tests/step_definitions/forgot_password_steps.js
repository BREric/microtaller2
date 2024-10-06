const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('supertest');
const assert = require('assert');
const Ajv = require('ajv');
const ajv = new Ajv();
require('ajv-formats')(ajv);
const apiURL = require('../support/supertestConfig');
const apiSchema = require('../../schemas/apiResponsesSchema.json');

let response;
let email; // Para almacenar el correo del usuario temporal

// Scenario 1: Restablecer contraseña con email válido
Given('Soy un usuario que ha olvidado su contraseña', function () {
    email = 'jhonatanva.2003.jsev@gmail.com';  // Usamos un email válido, de un usuario registrado
});

When('invoco el servicio de restablecimiento de contraseña con mi email', async function () {
    response = await request(apiURL)
        .post('/forgot_password')
        .send({ email: email })
        .set('Accept', 'application/json');
});

Then('obtengo un mensaje que indica que se ha enviado un email con instrucciones para restablecer la contraseña', function () {
    assert.strictEqual(response.statusCode, 200, `Expected status code 200 but got ${response.statusCode}`);

    // Validar la estructura de la respuesta con JSON Schema
    const valid = ajv.validate(apiSchema.properties.SuccessResponse, response.body);
    assert.strictEqual(valid, true, 'La respuesta no coincide con el esquema JSON');
    if (!valid) {
        console.log('Errores de validación:', ajv.errors);
    }

    assert(response.body.message.includes('Se ha enviado un email con instrucciones'), 'No se recibió el mensaje esperado en la respuesta.');
});

Then('un código de estado 200 que indica que el correo fue enviado', function () {
    assert.strictEqual(response.statusCode, 200, `Expected status code 200 but got ${response.statusCode}`);
});

// Scenario 2: Restablecer contraseña con un email no válido
Given('soy un usuario que ha olvidado su contraseña', function () {
    email = 'nonexistentuser@example.com';  // Usamos un email no registrado en la base de datos
});

When('invoco el servicio de restablecimiento de contraseña con un email que no existe', async function () {
    response = await request(apiURL)
        .post('/forgot_password')
        .send({ email: email })
        .set('Accept', 'application/json');
});

Then('obtengo un código de estado 404 indicando que el usuario no fue encontrado', function () {
    assert.strictEqual(response.statusCode, 404, `Expected status code 404 but got ${response.statusCode}`);

    // Validar la estructura de la respuesta de error con JSON Schema
    const valid = ajv.validate(apiSchema.properties.ErrorResponse, response.body);
    assert.strictEqual(valid, true, 'La respuesta de error no coincide con el esquema JSON');
    if (!valid) {
        console.log('Errores de validación:', ajv.errors);
    }
});
