from datetime import date
from ..models import Client
from ..repositories.client_repository import ClientRepository
class ClientService:
 def __init__(self): self.repo=ClientRepository()
 def list(self,o): return [x.to_dict() for x in self.repo.list(o)]
 def create(self,o,d):
  if not d.get('name','').strip(): raise ValueError('Nome é obrigatório')
  return self.repo.save(Client(owner_id=o,name=d['name'].strip(),phone=d.get('phone'))).to_dict()
 def update(self,o,i,d):
  x=self.repo.get(o,i)
  if not x: return None
  x.name=d.get('name',x.name).strip(); x.phone=d.get('phone',x.phone); return self.repo.save(x).to_dict()
 def delete(self,o,i):
  x=self.repo.get(o,i)
  if not x:return False
  self.repo.delete(x); return True
