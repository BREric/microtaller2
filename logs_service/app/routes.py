from flask import Blueprint, request, jsonify
from .models import LogModel

log_blueprint = Blueprint('log_blueprint', __name__)

# Asumiendo que tenemos la base de datos ya inicializada en el objeto `db`
logs_model = LogModel(db)

@log_blueprint.route('/logs', methods=['POST'])
def create_log():
    data = request.get_json()
    required_fields = ["app_name", "log_type", "module", "summary", "description"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    log_id = logs_model.create_log(
        data['app_name'], data['log_type'], data['module'], data['summary'], data['description']
    )
    return jsonify({"message": "Log created", "log_id": log_id}), 201

@log_blueprint.route('/logs', methods=['GET'])
def get_logs():
    filters = {
        "app_name": request.args.get("app_name"),
        "log_type": request.args.get("log_type"),
        "start_date": request.args.get("start_date"),
        "end_date": request.args.get("end_date"),
    }
    page = int(request.args.get("page", 0))
    page_size = int(request.args.get("page_size", 10))

    logs = logs_model.get_logs(filters, page, page_size)
    return jsonify(logs), 200
