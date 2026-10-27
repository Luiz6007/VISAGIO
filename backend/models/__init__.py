from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()
def now(): return datetime.now(timezone.utc)
class User(db.Model):
 __tablename__='users'; id=db.Column(db.String(40),primary_key=True); email=db.Column(db.String(180),unique=True,nullable=False); password_hash=db.Column(db.String(255),nullable=False); full_name=db.Column(db.String(120)); account_type=db.Column(db.String(30),default='cliente'); onboarded=db.Column(db.Boolean,default=False)
class Client(db.Model):
 __tablename__='clients'; id=db.Column(db.Integer, primary_key=True); owner_id=db.Column(db.String(80), nullable=False, index=True); name=db.Column(db.String(120), nullable=False); phone=db.Column(db.String(40)); last_visit_date=db.Column(db.Date); created_at=db.Column(db.DateTime, default=now); updated_at=db.Column(db.DateTime, default=now, onupdate=now)
 def to_dict(self): return {'id':str(self.id),'nome':self.name,'telefone':self.phone or '','last_visit_date':self.last_visit_date.isoformat() if self.last_visit_date else None}
class Appointment(db.Model):
 __tablename__='appointments'; id=db.Column(db.Integer, primary_key=True); owner_id=db.Column(db.String(80), nullable=False, index=True); client_id=db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False); date=db.Column(db.Date, nullable=False); time=db.Column(db.String(5), nullable=False); service=db.Column(db.String(120), nullable=False); status=db.Column(db.String(20), default='Pendente'); created_at=db.Column(db.DateTime, default=now); client=db.relationship('Client')
 def to_dict(self): return {'id':str(self.id),'client_id':str(self.client_id),'date':self.date.isoformat(),'time':self.time,'service':self.service,'status':self.status}
class Analysis(db.Model):
 __tablename__='analyses'; id=db.Column(db.Integer, primary_key=True); owner_id=db.Column(db.String(80), nullable=False, index=True); client_id=db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False); image_url=db.Column(db.Text); face_shape=db.Column(db.String(50), nullable=False); symmetry=db.Column(db.Float, nullable=False); recommendations=db.Column(db.JSON, default=dict); date=db.Column(db.Date, nullable=False); created_at=db.Column(db.DateTime, default=now)
 def to_dict(self): return {'id':str(self.id),'client_id':str(self.client_id),'image_url':self.image_url or '','face_shape':self.face_shape,'symmetry':self.symmetry,'recommendations':self.recommendations or {},'date':self.date.isoformat()}
