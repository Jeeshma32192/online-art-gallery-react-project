import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../components/PageLayout.jsx';
import { useGallery } from '../../context/GalleryContext.jsx';

export default function ArtworkDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { artworks, addToCart, toggleFavourite, favourites, viewingRequests, setViewingRequests } = useGallery();
  const art = artworks.find(a => a.id === Number(id));
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`artist-chat-${id}`)) || []; } catch { return []; }
  });
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [appointment, setAppointment] = useState(null);
  const [notice, setNotice] = useState('');

  if (!art) return <PageLayout><p>Artwork not found.</p></PageLayout>;

  function sendMessage(e) {
    e.preventDefault();
    if (!message.trim()) return;
    const updated = [...chat, { text: message.trim(), from: 'You', at: new Date().toLocaleString() }];
    setChat(updated);
    localStorage.setItem(`artist-chat-${id}`, JSON.stringify(updated));
    setMessage('');
    setNotice('Message saved. The artist can reply when artist messaging is connected to a server.');
  }

  function requestViewing(e) {
    e.preventDefault();
    if (!date || !time) return;
    const request = { id: Date.now(), artwork: art.title, artist: art.artist, date, time, status: 'Requested', user: localStorage.getItem('currentUser') || 'Gallery visitor', userId: localStorage.getItem('currentUserId') || localStorage.getItem('currentUser') || 'Gallery visitor' };
    setViewingRequests(old => [...old, request]);
    setAppointment(request);
    setNotice('Viewing request saved in this demo. The artist must confirm the appointment.');
  }

  return <PageLayout>
    <button className="back-button" onClick={() => nav(-1)}>← Back to gallery</button>
    <div className="detail-layout">
      <img src={art.image} alt={art.title}/>
      <div><p className="eyebrow">{art.category} ARTWORK</p><h1>{art.title}</h1>
        <h3>By {art.artist}</h3><p>{art.description}</p>
        <h2 className="detail-price">₹{Number(art.price).toLocaleString('en-IN')}</h2>
        <p className="availability">● {art.status || 'Available'}</p>
        <button className="primary-button" onClick={() => { addToCart(art.id); alert('Added to cart'); }}>Add to cart</button>{' '}
        <button className="outline-button" onClick={() => toggleFavourite(art.id)}>{favourites.includes(art.id) ? '♥ Saved' : '♡ Add to favourites'}</button>
      </div>
    </div>
    <section className="artist-connect">
      <p className="eyebrow">PERSONAL ART EXPERIENCE</p><h2>Connect with the Artist</h2>
      <p>Ask {art.artist} about this artwork, its price, or how it was created. You can also request to view it in person before buying.</p>
      <div className="connect-grid">
        <form className="connect-panel" onSubmit={sendMessage}>
          <h3>Chat about this painting</h3>
          <div className="chat-history">{chat.length ? chat.map((item,i)=><div className="chat-message" key={i}><b>{item.from}</b><p>{item.text}</p><small>{item.at}</small></div>) : <p className="chat-empty">No messages yet. Start the conversation with the artist.</p>}</div>
          <label htmlFor="artist-message">Your message</label>
          <textarea id="artist-message" rows="3" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Ask about the painting..." required />
          <button className="primary-button" type="submit">Send message</button>
        </form>
        <form className="connect-panel" onSubmit={requestViewing}>
          <h3>Request an in-person viewing</h3>
          <p>Choose a preferred date and time. Your request is not confirmed until the artist agrees.</p>
          <label htmlFor="view-date">Preferred date</label><input id="view-date" type="date" min={new Date().toISOString().slice(0,10)} value={date} onChange={e=>setDate(e.target.value)} required/>
          <label htmlFor="view-time">Preferred time</label><input id="view-time" type="time" value={time} onChange={e=>setTime(e.target.value)} required/>
          <button className="primary-button" type="submit">Request viewing</button>
          {appointment && <p className="appointment-status">Request: {appointment.date} at {appointment.time} — {appointment.status}</p>}
        </form>
      </div>
      {notice && <p className="connect-notice" role="status">{notice}</p>}
    </section>
  </PageLayout>;
}
