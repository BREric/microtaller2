Feature: La API permite a los usuarios actualizar su información

  Scenario: Yo como usuario quiero actualizar mi información con datos válidos
    Given Soy un usuario autenticado
    When invoco el servicio de actualización del usuario
    And un código de estado 204

  Scenario: Yo como usuario quiero actualizar una cuenta que no es la mía
    Given Soy un usuario autenticado pero ingreso a una cuenta que no es mía
    When realizo la solicitud de actualización de un usuario diferente al mío
    Then obtengo un código de estado 403 que indica que no tengo permisos

  Scenario: Yo como usuario sin autenticar quiero actualizar mi información
    Given Soy un usuario no autenticado
    When realizo la solicitud de actualización del usuario
    Then obtengo un código de estado 401
