# app/__init__.py
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_pymongo import PyMongo
from pymongo import MongoClient

# Inicializa la aplicación de Flask
app = Flask(__name__)

# Configuración JWT
app.config["JWT_SECRET_KEY"] = "your_secret_key"
jwt = JWTManager(app)

# Configuración de la conexión a MongoDB usando Flask-PyMongo
app.config["MONGO_URI"] = "mongodb://localhost:27017/your_db"
mongo = PyMongo(app)

# Conexión a la base de datos usando PyMongo
client = MongoClient("mongodb://localhost:27017") 
db = client['logs_service']  # Variable `db` que apunta a la base de datos

# Importa y registra los blueprints o rutas
from .routes import log_blueprint
app.register_blueprint(log_blueprint)

# Inicialización de la app
def create_app():
    return app
