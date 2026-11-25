import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header.jsx'; import Categories from './Categories.jsx'; import Footer from './Footer.jsx';
import { useGallery } from '../context/GalleryContext.jsx';

export default function Login() {
  const { artists } = useGallery();
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [role,setRole]=useState('user');
  const [selectedArtist,setSelectedArtist]=useState('Mira Kapoor'); const navigate=useNavigate();
  const submit=e=>{e.preventDefault();
    if(role==='artist') {
      const artist=artists.find(a=>a.name===selectedArtist);
      const artistEmail=`artist.${selectedArtist.toLowerCase().replace(/[^a-z]+/g,'.').replace(/^\.|\.$/g,'')}@artora.com`;
      const valid=(email==='artist@artora.com' && password==='artist123') || (email===artistEmail && password==='artist123');
      if(valid && artist){localStorage.setItem('loggedIn','true');localStorage.setItem('loginType','artist');localStorage.setItem('currentUser',artist.name);localStorage.setItem('currentArtist',artist.name);navigate('/artist/requests');return;}
    }
    if(role==='admin' && email==='admin@artora.com' && password==='admin123'){localStorage.setItem('loggedIn','true');localStorage.setItem('loginType','admin');localStorage.setItem('currentUser','Administrator');navigate('/admin/dashboard');return;}
    const users=JSON.parse(localStorage.getItem('users')||'[]'); const found=users.find(u=>u.email===email&&u.password===password);
    if(role==='user' && found){localStorage.setItem('loggedIn','true');localStorage.setItem('loginType','user');localStorage.setItem('currentUser',found.name);localStorage.setItem('currentUserId',found.email);navigate('/user/dashboard');return;}
    if(role==='user' && email==='user@artora.com' && password==='user123'){localStorage.setItem('loggedIn','true');localStorage.setItem('loginType','user');localStorage.setItem('currentUser','Gallery User');localStorage.setItem('currentUserId','user@artora.com');navigate('/user/dashboard');return;}
    alert('Invalid email or password. Please check your login details.');
  };
  return <div className="container"><Header/><Categories/><main className="auth-section"><div className="auth-art"><p className="eyebrow">WELCOME TO ARTORA</p><h1>Art brings<br/><em>life to spaces.</em></h1><p>Sign in to discover, collect and celebrate art.</p></div><div className="auth-box"><p className="eyebrow">YOUR GALLERY ACCOUNT</p><h2>Login</h2><form onSubmit={submit}><label>Login as</label><select value={role} onChange={e=>setRole(e.target.value)}><option value="user">User</option><option value="artist">Artist</option><option value="admin">Admin</option></select>
    {role==='artist' && <><label>Artist account</label><select value={selectedArtist} onChange={e=>setSelectedArtist(e.target.value)}>{artists.map(a=><option key={a.id} value={a.name}>{a.name}</option>)}</select></>}
    <label>Email address</label><input type="email" placeholder="Enter your email" value={email} onChange={e=>setEmail(e.target.value)} required/><label>Password</label><input type="password" placeholder="Enter password" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="primary-button">Login</button></form><p className="auth-switch">New to Artora? <Link to="/signup">Create an account</Link></p><small className="demo-hint">Demo admin: admin@artora.com / admin123<br/>Demo user: user@artora.com / user123<br/>Demo artist accounts: select any artist; use artist@artora.com / artist123</small></div></main><Footer/></div>;
}
