from ..models import db, Analysis
class AnalysisRepository:
 def list(self, owner, client_id=None):
  q=Analysis.query.filter_by(owner_id=owner)
  if client_id: q=q.filter_by(client_id=client_id)
  return q.order_by(Analysis.date.desc()).all()
 def get(self, owner, ident): return Analysis.query.filter_by(owner_id=owner,id=ident).first()
 def save(self,obj): db.session.add(obj); db.session.commit(); return obj
 def delete(self,obj): db.session.delete(obj); db.session.commit()
 def report(self,owner): return {'total':Analysis.query.filter_by(owner_id=owner).count()}
