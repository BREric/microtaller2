package main

import (
    "context"
    "fmt"
    "log"
    "os"
    "time"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
    mongoURI := os.Getenv("MONGO_URI")
    mongoDB := os.Getenv("MONGO_DB")

    if mongoURI == "" {
        log.Fatal("MONGO_URI environment variable is not set")
    }
    if mongoDB == "" {
        log.Fatal("MONGO_DB environment variable is not set")
    }

    clientOptions := options.Client().ApplyURI(mongoURI).SetAuth(options.Credential{
        Username: "admin",
        Password: "root123",
    })

    client, err := mongo.NewClient(clientOptions)
    if err != nil {
        log.Fatal(err)
    }

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    err = client.Connect(ctx)
    if err != nil {
        log.Fatal(err)
    }

    err = client.Ping(ctx, nil)
    if err != nil {
        log.Fatal(err)
    }

    collection := client.Database(mongoDB).Collection("users")

    users := []interface{}{
        bson.M{
            "username":  "testuser1",
            "email":     "testuser1@example.com",
            "password":  "password123",
            "created_at": primitive.NewDateTimeFromTime(time.Now()),
            "updated_at": primitive.NewDateTimeFromTime(time.Now()),
        },
        bson.M{
            "username":  "testuser2",
            "email":     "testuser2@example.com",
            "password":  "password456",
            "created_at": primitive.NewDateTimeFromTime(time.Now()),
            "updated_at": primitive.NewDateTimeFromTime(time.Now()),
        },
    }

    _, err = collection.InsertMany(ctx, users)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("Test users inserted successfully.")
}
