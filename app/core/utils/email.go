package utils

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"log"

	"gopkg.in/gomail.v2"
)

var (
	smtpHost  = "smtp.gmail.com"
	smtpPort  = 587
	fromEmail = "mailfortestinguq@gmail.com"
	password  = "clkp xrrd bpzh cgzc"
)

func SendResetEmail(toEmail string, token string) error {
	log.Println("Enviando correo a:", toEmail)

	subject := "Password Reset Request"
	body := fmt.Sprintf("You requested a password reset. Please use the following link to reset your password: http://localhost:8080/reset_password?token=%s", token)

	m := gomail.NewMessage()
	m.SetHeader("From", fromEmail)
	m.SetHeader("To", toEmail)
	m.SetHeader("Subject", subject)
	m.SetBody("text/plain", body)

	d := gomail.NewDialer(smtpHost, smtpPort, fromEmail, password)

	if err := d.DialAndSend(m); err != nil {
		log.Println("Error al enviar el correo:", err)
		return err
	}

	log.Println("Correo enviado exitosamente a:", toEmail)
	return nil
}

func GenerateResetToken() (string, error) {
	log.Println("Generando token de restablecimiento de contraseña")

	bytes := make([]byte, 16)
	_, err := rand.Read(bytes)
	if err != nil {
		log.Println("Error al generar el token:", err)
		return "", err
	}

	token := hex.EncodeToString(bytes)
	log.Println("Token generado:", token)
	return token, nil
}
