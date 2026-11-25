import PageLayout from '../../components/PageLayout.jsx';
import { useGallery } from '../../context/GalleryContext.jsx';

export default function ViewingRequestHistory() {
  const { viewingRequests } = useGallery();
  const userId = localStorage.getItem('currentUserId');
  const userName = localStorage.getItem('currentUser') || 'Gallery visitor';
  const mine = viewingRequests.filter(r => userId ? (r.userId === userId || (!r.userId && r.user === userName)) : (r.userId || r.user) === userName);
  return <PageLayout>
    <div className="page-title"><p className="eyebrow">YOUR ARTORA ACCOUNT</p><h1>My viewing request history</h1><p>Your requests stay saved here so you can check them whenever you return to your account.</p></div>
    <section className="admin-form"><h2>All my requests</h2>
      {mine.length ? mine.slice().reverse().map(r => <article key={r.id} style={{borderBottom:'1px solid #ddd',padding:'16px 0'}}>
        <h3>{r.artwork}</h3><p>Artist: {r.artist}</p><p>Requested: {r.date} at {r.time}</p><p>Status: <b>{r.status}</b></p>
        {r.status === 'Requested' && <p>The artist has not responded yet.</p>}
        {r.status === 'Accepted' && <p>The artist accepted your request. Please contact the artist to confirm the final details.</p>}
        {r.status === 'Declined' && <p>The artist declined this request. You can submit another request with a different date.</p>}
      </article>) : <p>You have not made any viewing requests yet.</p>}
    </section>
  </PageLayout>;
}
