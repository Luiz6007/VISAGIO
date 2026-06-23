from flask import Flask, jsonify
from controllers.health_controller import health_blueprint


def create_app() -> Flask:
    app = Flask(__name__)

    app.register_blueprint(health_blueprint, url_prefix="/api")

    @app.errorhandler(404)
    def resource_not_found(error):
        return jsonify({
            "success": False,
            "message": "Recurso não encontrado."
        }), 404

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)
