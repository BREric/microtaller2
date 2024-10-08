Feature: La API permite a los usuarios obtener una lista de los usuarios existentes

  Scenario: Yo como usuario autenticado quiero una lista con la información de otros usuarios
    Given Soy un usuario autenticado y listar los usuarios
    When realizo una solicitud GET a users seguido de page=1&limit=20
    Then obtengo una lista con la información de otros usuarios
    And obtengo un código de estado 200 que me indica que la solicitud fue exitosa


  Scenario: Como usuario sin autenticarse intento obtener una lista con la información de otros usuarios
    Given No estoy autenticado
    When hago una solicitud GET a users seguido de page=1&limit=20
    Then obtengo un codigo de estado 401
    And un mensaje que indique que no tengo autorización