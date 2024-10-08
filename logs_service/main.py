from flask import Flask
from app.routes import log_blueprint

app = Flask(__name__)

# Registro de los Blueprints
app.register_blueprint(log_blueprint)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
