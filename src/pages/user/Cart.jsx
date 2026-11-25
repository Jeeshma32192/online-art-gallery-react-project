import { useState } from 'react';
import PageLayout from '../../components/PageLayout.jsx';
import { useGallery } from '../../context/GalleryContext.jsx';

const DELIVERY_FEE = 250;
export default function Cart() {
  const { artworks, cart, setCart, setOrders, setArtworks } = useGallery();
  const items = artworks.filter(a => cart.includes(a.id));
  const subtotal = items.reduce((sum, a) => sum + Number(a.price), 0);
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('UPI (demo)');
  const [notice, setNotice] = useState('');
  const unavailable = items.find(a => Number(a.stock ?? 5) < 1);
  const checkout = e => {
    e.preventDefault();
    if (!items.length || !address.trim() || unavailable) return;
    const now = new Date();
    const delivery = new Date(now); delivery.setDate(delivery.getDate() + 5);
    const order = { id: `ART-${Date.now()}`, date: now.toISOString(), items: items.map(a => ({ id:a.id, title:a.title, artist:a.artist, price:Number(a.price), image:a.image, quantity:1 })), subtotal, deliveryFee:DELIVERY_FEE, total:subtotal+DELIVERY_FEE, address:address.trim(), paymentMethod:payment, paymentStatus:'Demo payment recorded', status:'Order placed', deliveryEstimate:delivery.toLocaleDateString('en-IN'), refundStatus:'Not applicable' };
    setOrders(old => [order, ...old]);
    setArtworks(old => old.map(a => cart.includes(a.id) ? { ...a, stock: Math.max(0, Number(a.stock ?? 5) - 1), status: Number(a.stock ?? 5) <= 1 ? 'Sold out' : a.status } : a));
    setCart([]);
    setNotice(`Demo order placed. Order ID: ${order.id}. No real payment was processed.`);
  };
  return <PageLayout><div className="page-title"><p className="eyebrow">YOUR SELECTION</p><h1>Shopping cart</h1></div>
    {items.length ? <><div className="cart-list">{items.map(a=><div className="cart-item" key={a.id}><img src={a.image} alt={a.title}/><div><h3>{a.title}</h3><p>{a.artist}</p><b>₹{Number(a.price).toLocaleString('en-IN')}</b><p>Stock available: {a.stock ?? 5}</p></div><button className="remove-button" onClick={()=>setCart(cart.filter(id=>id!==a.id))}>Remove</button></div>)}</div>
    <form className="admin-form" onSubmit={checkout}><h2>Delivery and payment</h2><label>Delivery address<textarea rows="3" value={address} onChange={e=>setAddress(e.target.value)} placeholder="House/flat, street, city, state, PIN code" required/></label><label>Payment method<select value={payment} onChange={e=>setPayment(e.target.value)}><option>UPI (demo)</option><option>Card (demo)</option><option>Cash on delivery (demo)</option></select></label><p>Estimated delivery: within 5 days after order placement (demo estimate).</p><p>Delivery charge: ₹{DELIVERY_FEE.toLocaleString('en-IN')} per order</p>{unavailable&&<p role="alert">{unavailable.title} is out of stock. Please remove it or contact the gallery.</p>}<h2>Subtotal: ₹{subtotal.toLocaleString('en-IN')}</h2><h2>Total: ₹{(subtotal+DELIVERY_FEE).toLocaleString('en-IN')}</h2><button className="primary-button" disabled={!!unavailable}>Place demo order</button></form></> : <p className="empty-state">Your cart is empty. Discover an artwork you love.</p>}
    {notice&&<p role="status" className="connect-notice">{notice} Visit <a href="/user/orders">My Orders & Payment History</a> to view it anytime.</p>}
  </PageLayout>;
}
