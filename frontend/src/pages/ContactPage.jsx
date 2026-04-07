import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Mail, Send, CheckCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ContactPage = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await axios.post(`${API}/contact`, formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t('contact.info.address'),
      content: 'Budapest, Klapka u. 4–6, 1134',
      link: 'https://maps.google.com/?q=Budapest+Klapka+utca+4-6+1134',
    },
    {
      icon: Phone,
      title: t('contact.info.phone'),
      content: '+36 20 359 9296',
      link: 'tel:+36203599296',
    },
    {
      icon: Clock,
      title: t('contact.info.hours'),
      content: language === 'hu' 
        ? 'H-P: 8:00 - 18:00\nSzo: 9:00 - 16:00\nV: Zárva'
        : 'Mon-Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 4:00 PM\nSun: Closed',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'hello@nani.cafe',
      link: 'mailto:hello@nani.cafe',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F6F0]" data-testid="contact-page">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="overline mb-4">{t('nav.contact')}</p>
            <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl lg:text-6xl text-[#1A1614] tracking-tight mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-[#2C2420]/70 max-w-xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-[#2C2420] mb-2 block">
                      {t('contact.form.name')}
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-white border-[#E5E0D8] focus:border-[#C07D5A] focus:ring-[#C07D5A]/20"
                      data-testid="contact-name-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[#2C2420] mb-2 block">
                      {t('contact.form.email')}
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-white border-[#E5E0D8] focus:border-[#C07D5A] focus:ring-[#C07D5A]/20"
                      data-testid="contact-email-input"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-[#2C2420] mb-2 block">
                    {t('contact.form.subject')}
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="bg-white border-[#E5E0D8] focus:border-[#C07D5A] focus:ring-[#C07D5A]/20"
                    data-testid="contact-subject-input"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-[#2C2420] mb-2 block">
                    {t('contact.form.message')}
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="bg-white border-[#E5E0D8] focus:border-[#C07D5A] focus:ring-[#C07D5A]/20 resize-none"
                    data-testid="contact-message-input"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-gold w-full py-4 flex items-center justify-center gap-2"
                  data-testid="contact-submit-btn"
                >
                  {status === 'loading' ? (
                    t('contact.form.sending')
                  ) : status === 'success' ? (
                    <>
                      <CheckCircle size={18} />
                      {t('contact.form.success')}
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      {t('contact.form.send')}
                    </>
                  )}
                </Button>

                {status === 'error' && (
                  <p className="text-red-500 text-sm text-center">
                    {t('contact.form.error')}
                  </p>
                )}
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-[#F5F0E8] rounded-sm flex items-center justify-center flex-shrink-0">
                    <info.icon size={20} className="text-[#C07D5A]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1A1614] mb-1">{info.title}</p>
                    {info.link ? (
                      <a
                        href={info.link}
                        target={info.link.startsWith('http') ? '_blank' : undefined}
                        rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-[#2C2420]/70 hover:text-[#C07D5A] transition-colors whitespace-pre-line"
                      >
                        {info.content}
                      </a>
                    ) : (
                      <p className="text-[#2C2420]/70 whitespace-pre-line">{info.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Map placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="aspect-video rounded-sm overflow-hidden mt-8"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2694.4!2d19.0523!3d47.5186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDMxJzA3LjAiTiAxOcKwMDMnMDguMyJF!5e0!3m2!1sen!2shu!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Café Nani Location"
                  className="grayscale"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
