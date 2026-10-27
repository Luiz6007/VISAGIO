from datetime import date
from ..models import Appointment
from ..repositories.appointment_repository import AppointmentRepository
class AppointmentService:
 def __init__(self):self.repo=AppointmentRepository()
 def list(self,o,d=None):return [x.to_dict() for x in self.repo.list(o,date.fromisoformat(d) if d else None)]
 def create(self,o,d):
  x=Appointment(owner_id=o,client_id=int(d['client_id']),date=date.fromisoformat(d['date']),time=d['time'],service=d['service'],status=d.get('status','Pendente'));return self.repo.save(x).to_dict()
 def update_status(self,o,i,status):
  x=self.repo.get(o,i)
  if not x or status not in ('Pendente','Confirmado'):return None
  x.status=status;return self.repo.save(x).to_dict()
 def delete(self,o,i):
  x=self.repo.get(o,i)
  if not x:return False
  self.repo.delete(x);return True
