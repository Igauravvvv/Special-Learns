import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import ContactForm from './ContactForm.jsx';

export default function EnrollmentDialog({ open, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const dialog = ref.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, [open]);
  return <dialog ref={ref} className="enrollment-dialog" aria-labelledby="enrollment-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) { const rect = ref.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); } }}>
    <button type="button" className="enrollment-dialog__close" onClick={onClose} aria-label="Close enquiry form"><X size={20} /></button>
    <p className="eyebrow eyebrow--plain">Your next step starts here</p><h2 id="enrollment-title">Let’s find your course.</h2><p className="enrollment-dialog__intro">Leave your details. We’ll help with the course, fees and a batch that fits your day.</p>
    {open && <ContactForm compact source="hero" />}
  </dialog>;
}
