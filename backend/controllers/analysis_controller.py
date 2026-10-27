from flask import Blueprint,request,jsonify
from ..services.analysis_service import AnalysisService
from ..services.ai_service import VisagismAIService
analyses_bp=Blueprint('analyses',__name__);s=AnalysisService(); ai=VisagismAIService(); owner=lambda:request.headers.get('X-User-Id','demo-user')
@analyses_bp.get('')
def list_n():return jsonify(s.list(owner(),request.args.get('client_id')))
@analyses_bp.post('')
def create_n():
 try:return jsonify(s.create(owner(),request.get_json() or {})),201
 except (ValueError,KeyError) as e:return jsonify(error=str(e)),400
@analyses_bp.get('/report')
def report():return jsonify(s.report(owner()))
@analyses_bp.delete('/<int:i>')
def delete_n(i):return (jsonify(deleted=True),200) if s.delete(owner(),i) else (jsonify(error='Análise não encontrada'),404)

@analyses_bp.post('/generate')
def generate():
 try: return jsonify(ai.analyze((request.get_json() or {}).get('image_url')))
 except Exception as e: return jsonify(error=str(e)), 503

