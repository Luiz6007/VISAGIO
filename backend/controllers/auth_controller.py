from flask import Blueprint,request,jsonify
from werkzeug.security import generate_password_hash,check_password_hash
from ..models import db,User
import secrets
bp=Blueprint('auth',__name__)
def current():
 token=request.headers.get('Authorization','').replace('Bearer ',''); return User.query.filter_by(id=token).first() if token else None
class AuthController:
 def signup(self):
  d=request.get_json() or {}; email=d.get('email','').lower().strip()
  if not email or len(d.get('password',''))<6:return jsonify(error='E-mail e senha válidos são obrigatórios'),400
  if User.query.filter_by(email=email).first():return jsonify(error='Usuário já cadastrado'),409
  u=User(id=secrets.token_urlsafe(18),email=email,password_hash=generate_password_hash(d['password']),full_name=d.get('full_name'),account_type=d.get('account_type','cliente'));db.session.add(u);db.session.commit();return jsonify(user={'id':u.id,'email':u.email},session={'access_token':u.id}),201
 def login(self):
  d=request.get_json() or {};u=User.query.filter_by(email=d.get('email','').lower().strip()).first()
  if not u or not check_password_hash(u.password_hash,d.get('password','')):return jsonify(error='Credenciais inválidas'),401
  return jsonify(user={'id':u.id,'email':u.email},session={'access_token':u.id})
controller=AuthController()
@bp.post('/signup')
def signup():return controller.signup()
@bp.post('/login')
def login():return controller.login()
@bp.get('/me')
def me():
 u=current();return jsonify(user={'id':u.id,'email':u.email} if u else None)
@bp.post('/logout')
def logout():return jsonify(ok=True)
