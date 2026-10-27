const API = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";
type User = { id: string; email?: string };
const token = () => localStorage.getItem("provai_token");
const req = (path: string, init: RequestInit = {}) => fetch(`${API}${path}`, { ...init, headers: { "Content-Type": "application/json", ...(token() ? { Authorization: `Bearer ${token()}` } : {}), ...(init.headers || {}) } });
export const supabase = {
 auth: {
  async signUp({ email, password, options }: any) { const r=await req('/auth/signup',{method:'POST',body:JSON.stringify({email,password,...(options?.data||{})})}); const x=await r.json(); if(x.session)localStorage.setItem('provai_token',x.session.access_token); return {data:x,error:r.ok?null:{message:x.error}}; },
  async signInWithPassword({ email, password }: any) { const r=await req('/auth/login',{method:'POST',body:JSON.stringify({email,password})}); const x=await r.json(); if(x.session)localStorage.setItem('provai_token',x.session.access_token); return {data:x,error:r.ok?null:{message:x.error}}; },
  async getUser(){const r=await req('/auth/me');const x=await r.json();return {data:{user:x.user as User|null},error:null};},
  async getSession(){const r=await req('/auth/me');const x=await r.json();return {data:{session:x.user?{access_token:token(),user:x.user}:null},error:null};},
  async signOut(){localStorage.removeItem('provai_token');await req('/auth/logout',{method:'POST'});return {error:null};},
  async resetPasswordForEmail(){return {error:null};}, async updateUser(){return {error:null};},
  onAuthStateChange(cb:any){return {data:{subscription:{unsubscribe(){}}}};}
 },
 from(){ return { select(){return this;}, eq(){return this;}, maybeSingle:async()=>({data:null,error:null}), update(){return this;}, insert:async()=>({data:null,error:null}) }; }
};

