from flask import Blueprint,request,jsonify
from ..services.appointment_service import AppointmentService
appointments_bp=Blueprint('appointments',__name__);s=AppointmentService(); owner=lambda:request.headers.get('X-User-Id','demo-user')
@appointments_bp.get('')
def list_a():return jsonify(s.list(owner(),request.args.get('date')))
@appointments_bp.post('')
def create_a():
 try:return jsonify(s.create(owner(),request.get_json() or {})),201
 except (ValueError,KeyError) as e:return jsonify(error=str(e)),400
@appointments_bp.patch('/<int:i>/status')
def status(i):
 x=s.update_status(owner(),i,(request.get_json() or {}).get('status'));return (jsonify(x),200) if x else (jsonify(error='Agendamento inválido'),400)
@appointments_bp.delete('/<int:i>')
def delete_a(i):return (jsonify(deleted=True),200) if s.delete(owner(),i) else (jsonify(error='Agendamento não encontrado'),404)
