FROM golang:1.23-alpine

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
COPY openAPI.json /microservices/app/openAPI.json
RUN go mod download

COPY . ./

RUN go install github.com/swaggo/swag/cmd/swag@latest
RUN swag init


RUN go build -o /go-auth-api

EXPOSE 8080


CMD ["/go-auth-api"]
