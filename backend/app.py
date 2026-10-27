from flask import Flask
from flask_cors import CORS
from .models import db
from .controllers.client_controller import clients_bp
from .controllers.appointment_controller import appointments_bp
from .controllers.analysis_controller import analyses_bp
from .controllers.auth_controller import bp as auth_bp

def create_app():
    app = Flask(__name__)
    app.config.from_mapping(
        SQLALCHEMY_DATABASE_URI=__import__('os').environ.get('DATABASE_URL', 'sqlite:///provai.db'),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )
    CORS(app, resources={r'/api/*': {'origins': '*'}})
    db.init_app(app)
    with app.app_context(): db.create_all()
    app.register_blueprint(clients_bp, url_prefix='/api/clients')
    app.register_blueprint(appointments_bp, url_prefix='/api/appointments')
    app.register_blueprint(analyses_bp, url_prefix='/api/analyses')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    @app.get('/api/health')
    def health(): return {'status': 'ok', 'service': 'provai-api'}
    return app

app = create_app()




