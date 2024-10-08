package middleware

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

var jwtSecret = []byte("your_secret_key")

// AuthMiddleware checks the JWT token in the Authorization header
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Obtener el token de la cabecera Authorization
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		// El token JWT suele tener el formato "Bearer {token}"
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Bearer token required"})
			c.Abort()
			return
		}

		// Validar y parsear el token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return jwtSecret, nil
		})

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			c.Abort()
			return
		}

		// Verificar si el token es válido
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			// Verificar el campo de expiración
			if exp, ok := claims["exp"].(float64); ok {
				if time.Now().Unix() > int64(exp) {
					c.JSON(http.StatusUnauthorized, gin.H{"error": "token expired"})
					c.Abort()
					return
				}
			}

			// Verificar si el campo 'username' existe y no está vacío
			if username, ok := claims["username"].(string); !ok || username == "" {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token: username missing"})
				c.Abort()
				return
			}

			// Añadir las claims al contexto para que los siguientes handlers puedan acceder a ellas
			c.Set("userClaims", claims)

			// Continuar con el siguiente middleware/handler
			c.Next()
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token claims"})
			c.Abort()
			return
		}
	}
}
