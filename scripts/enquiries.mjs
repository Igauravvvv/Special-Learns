/** Local staff inbox. Never exposed through an unauthenticated web endpoint. */
import 'dotenv/config';
import { readEnquiries } from '../server/store.js';
const items = await readEnquiries();
if (!items.length) console.log('No enquiries yet. New requests will appear here after they are saved.');
else console.table(items.slice(-50).reverse().map(item => ({
  Reference: item.id, Received: item.receivedAt, Status: item.status || 'new',
  Name: item.name, Contact: item.phone || item.email, Course: item.interest,
  Message: item.message || '—',
})));
