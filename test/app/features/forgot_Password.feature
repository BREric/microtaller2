Feature: La API permite a los usuarios restablecer su contraseña

    Scenario: Yo como usuario quiero restablecer mi contraseña
        Given Soy un usuario que ha olvidado su contraseña
        When invoco el servicio de restablecimiento de contraseña con mi email
        Then obtengo un mensaje que indica que se ha enviado un email con instrucciones para restablecer la contraseña
        And un código de estado 200 que indica que el correo fue enviado

    Scenario: Yo como usuario quiero restablecer mi contraseña pero no ingreso un email valido
        Given soy un usuario que ha olvidado su contraseña
        When invoco el servicio de restablecimiento de contraseña con un email que no existe
        Then obtengo un código de estado 404 indicando que el usuario no fue encontrado
