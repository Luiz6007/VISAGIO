from datetime import date
from ..models import Analysis
from ..repositories.analysis_repository import AnalysisRepository
class AnalysisService:
 def __init__(self):self.repo=AnalysisRepository()
 def list(self,o,c=None):return [x.to_dict() for x in self.repo.list(o,c)]
 def create(self,o,d):
  if not d.get('face_shape'):raise ValueError('Formato do rosto é obrigatório')
  x=Analysis(owner_id=o,client_id=int(d['client_id']),image_url=d.get('image_url'),face_shape=d['face_shape'],symmetry=float(d.get('symmetry',0)),recommendations=d.get('recommendations',{}),date=date.fromisoformat(d.get('date',date.today().isoformat())));return self.repo.save(x).to_dict()
 def delete(self,o,i):
  x=self.repo.get(o,i)
  if not x:return False
  self.repo.delete(x);return True
 def report(self,o):return self.repo.report(o)
