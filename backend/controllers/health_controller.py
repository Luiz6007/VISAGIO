from flask import Blueprint, jsonify
from services.health_service import HealthService


health_blueprint = Blueprint("health", __name__)


@health_blueprint.get("/health")
def health_check():
    result = HealthService.check()
    return jsonify(result), 200
