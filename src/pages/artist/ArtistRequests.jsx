import PageLayout from '../../components/PageLayout.jsx';
import { useGallery } from '../../context/GalleryContext.jsx';

export default function ArtistRequests() {
  const { viewingRequests, setViewingRequests } = useGallery();
  const artistName = localStorage.getItem('currentArtist') || localStorage.getItem('currentUser') || 'Mira Kapoor';
  const requests = viewingRequests.filter(r => r.artist === artistName);
  const update = (id, status) => setViewingRequests(old => old.map(r => r.id === id ? { ...r, status, respondedAt: new Date().toLocaleString() } : r));
  return <PageLayout>
    <div className="page-title"><p className="eyebrow">ARTIST SPACE</p><h1>Viewing requests</h1><p>Review customer requests for your artworks and accept or decline them. Decisions will appear in the customer’s request history.</p></div>
    <section className="admin-form"><h2>Requests for {artistName}</h2>
      {requests.length ? requests.slice().reverse().map(r => <article key={r.id} style={{borderBottom:'1px solid #ddd',padding:'16px 0'}}>
        <h3>{r.artwork}</h3><p>Customer: {r.user || 'Gallery visitor'}</p><p>Requested date and time: {r.date} at {r.time}</p><p>Status: <b>{r.status}</b></p>
        {r.status === 'Requested' && <><button className="small-action" onClick={() => update(r.id,'Accepted')}>Accept request</button> <button className="small-action danger" onClick={() => update(r.id,'Declined')}>Decline request</button></>}
        {r.respondedAt && <p><small>Responded: {r.respondedAt}</small></p>}
      </article>) : <p>No viewing requests for you yet. Requests for other artists are kept in their own artist accounts.</p>}
    </section>
  </PageLayout>;
}
