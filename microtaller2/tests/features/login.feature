Feature: La API debe permitir a los usuarios registrados iniciar sesión

    Scenario: Yo como usuario autenticado quiero autenticarme en el sistema
        Given soy un usuario registrado en el sistema
        When realizo una solicitud POST a login
        Then obtengo un token de autenticación
        And el código de estado debe ser 200

    Scenario: Intentar iniciar sesión con credenciales incorrectas
        Given No soy un usuario registrado en el sistema
        When se envía la solicitud de login con credenciales incorrectas
        Then obtengo un código de estado 401 indicando credenciales inválidas
