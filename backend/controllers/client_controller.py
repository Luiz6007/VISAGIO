from flask import Blueprint,request,jsonify
from ..services.client_service import ClientService
clients_bp=Blueprint('clients',__name__); s=ClientService(); owner=lambda:request.headers.get('X-User-Id','demo-user')
@clients_bp.get('')
def list_clients(): return jsonify(s.list(owner()))
@clients_bp.post('')
def create_client():
 try:return jsonify(s.create(owner(),request.get_json() or {})),201
 except ValueError as e:return jsonify(error=str(e)),400
@clients_bp.patch('/<int:i>')
def update_client(i):
 x=s.update(owner(),i,request.get_json() or {});return (jsonify(x),200) if x else (jsonify(error='Cliente não encontrado'),404)
@clients_bp.delete('/<int:i>')
def delete_client(i):return (jsonify(deleted=True),200) if s.delete(owner(),i) else (jsonify(error='Cliente não encontrado'),404)
