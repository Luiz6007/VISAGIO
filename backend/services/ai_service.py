import os, json
import urllib.request
class VisagismAIService:
 def analyze(self,image_data,client_id=None):
  key=os.getenv('GEMINI_API_KEY')
  if not key: raise RuntimeError('GEMINI_API_KEY não configurada')
  prompt='Analise esta foto para visagismo. Responda SOMENTE JSON com face_shape (string), symmetry (number 0-100), recommendations com cabelo, sobrancelha e maquiagem. Não faça diagnóstico médico.'
  payload={'contents':[{'parts':[{'text':prompt},{'inline_data':{'mime_type':'image/jpeg','data':image_data.split(',',1)[-1]}}]}]}
  req=urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={key}',data=json.dumps(payload).encode(),headers={'Content-Type':'application/json'})
  with urllib.request.urlopen(req,timeout=60) as res: raw=json.loads(res.read())
  text=raw['candidates'][0]['content']['parts'][0]['text'].replace('```json','').replace('```','').strip()
  return json.loads(text)
