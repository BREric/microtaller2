package main

import (
	"log"
	"net/http"

	"app/core/handlers"
	"app/core/middleware"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	// Ruta para servir el archivo openAPI.json
	router.StaticFile("/openapi.json", "./openAPI.json")

	// Ruta para cargar la interfaz de Swagger UI desde la CDN
	router.GET("/swagger", func(c *gin.Context) {
		c.Data(http.StatusOK, "text/html; charset=utf-8", []byte(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Swagger UI</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.3/swagger-ui.css">
            </head>
            <body>
                <div id="swagger-ui"></div>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.3/swagger-ui-bundle.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.3/swagger-ui-standalone-preset.js"></script>
                <script>
                    window.onload = function() {
                        const ui = SwaggerUIBundle({
                            url: "/openapi.json", 
                            dom_id: '#swagger-ui',
                            presets: [
                                SwaggerUIBundle.presets.apis,
                                SwaggerUIStandalonePreset
                            ],
                            layout: "StandaloneLayout"
                        });
                    }
                </script>
            </body>
            </html>
        `))
	})

	// Rutas públicas
	public := router.Group("/")
	{
		public.POST("/login", gin.WrapF(handlers.Login))
		public.POST("/forgot_password", gin.WrapF(handlers.ForgotPassword))
		public.POST("/reset_password", gin.WrapF(handlers.ResetPassword))
		public.POST("/users", gin.WrapF(handlers.CreateUser))
		//url:=ginSwagger.URL("http://localhost")
	}

	// Rutas autenticadas (se aplica middleware)
	authenticated := router.Group("/")
	authenticated.Use(middleware.AuthMiddleware())
	{
		authenticated.GET("/users/:id", gin.WrapF(handlers.GetUserByID))
		authenticated.DELETE("/users/:id", gin.WrapF(handlers.DeleteUserByID))
		authenticated.PUT("/update_user", gin.WrapF(handlers.UpdateUser))
		authenticated.POST("/change_password", gin.WrapF(handlers.ChangePassword))
		authenticated.GET("/users", gin.WrapF(handlers.GetUsers))
	}

	// Iniciar el servidor
	log.Println("Server starting on :8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
