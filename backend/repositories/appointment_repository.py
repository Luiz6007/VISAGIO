from ..models import db, Appointment
class AppointmentRepository:
 def list(self, owner, date=None):
  q=Appointment.query.filter_by(owner_id=owner)
  if date: q=q.filter_by(date=date)
  return q.order_by(Appointment.date,Appointment.time).all()
 def get(self, owner, ident): return Appointment.query.filter_by(owner_id=owner,id=ident).first()
 def save(self, obj): db.session.add(obj); db.session.commit(); return obj
 def delete(self,obj): db.session.delete(obj); db.session.commit()
