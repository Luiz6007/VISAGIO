from ..models import db, Client
class ClientRepository:
 def list(self, owner): return Client.query.filter_by(owner_id=owner).order_by(Client.name).all()
 def get(self, owner, ident): return Client.query.filter_by(owner_id=owner,id=ident).first()
 def save(self, obj): db.session.add(obj); db.session.commit(); return obj
 def delete(self, obj): db.session.delete(obj); db.session.commit()
