package config

import (
    "context"
    "log"
    "os"

    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

func ConnectDB() *mongo.Client {
    uri := os.Getenv("MONGO_URI")
    if uri == "" {
        log.Fatal("MONGO_URI environment variable not set")
    }

    clientOptions := options.Client().ApplyURI(uri)
    client, err := mongo.Connect(context.Background(), clientOptions)
    if err != nil {
        log.Fatal(err)
    }
    return client
}

func GetCollection(client *mongo.Client, collectionName string) *mongo.Collection {
    return client.Database("container-microtaller2").Collection(collectionName)
}