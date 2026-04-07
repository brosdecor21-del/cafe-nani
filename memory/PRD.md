# Café Nani - Product Requirements Document

## Project Overview
Luxury, ultra-modern, animated website for Café Nani - specialty coffee shop in Budapest.

## Original Problem Statement
Build a $3000+ looking website with:
- Bilingual support (HU/EN)
- Cinematic hero with animated hummingbird logo
- Coffee beans e-commerce section
- Contact form with email
- Reviews section
- Premium animations throughout

## Business Data
- **Name**: Café Nani
- **Location**: Budapest, Klapka u. 4–6, 1134
- **Phone**: +36 20 359 9296
- **Rating**: 4.8 ★ (69 reviews)
- **Website**: nani.cafe
- **Hours**: Mon-Fri 8:00-18:00, Sat 9:00-16:00

## User Personas
1. **Coffee Enthusiast** - Seeks premium specialty coffee experience
2. **Local Visitor** - Looking for quality café nearby
3. **Online Shopper** - Wants to purchase coffee beans online

## Core Requirements
- [x] Bilingual website (HU/EN) with language switcher
- [x] Animated hero section with hummingbird logo
- [x] Coffee collection with 3D tilt cards
- [x] Coffee beans shop section with cart
- [x] Contact form with email integration
- [x] Reviews section
- [x] About page with values
- [x] Menu page with category filters
- [x] Smooth scroll animations (Lenis)
- [x] Particle effects (tsparticles)
- [x] Responsive design

## Tech Stack
- **Frontend**: React 19, Tailwind CSS, Framer Motion, tsparticles, react-parallax-tilt
- **Backend**: FastAPI, MongoDB
- **Email**: Resend (placeholder key)
- **Fonts**: Cormorant Garamond + Outfit

## What's Been Implemented (Dec 2025)
### Phase 1 - MVP Complete ✓
- Full React frontend with 5 pages
- FastAPI backend with CRUD APIs
- MongoDB database with seeded data
- Language context (HU/EN)
- Premium animations and effects
- Contact form with Resend integration
- Shopping cart for coffee beans

### API Endpoints
- GET/POST /api/coffee-beans - Coffee beans CRUD
- GET/POST /api/reviews - Customer reviews
- GET/POST /api/menu - Menu items
- POST /api/contact - Contact form submission
- POST /api/seed - Seed initial data

## Prioritized Backlog

### P0 - Critical (None)
All core features implemented

### P1 - Important
- [ ] Real Resend API key integration
- [ ] Payment integration (Stripe) for bean purchases
- [ ] Order management system

### P2 - Nice to Have
- [ ] Admin panel for content management
- [ ] Email newsletter subscription
- [ ] Reservation/booking system
- [ ] Instagram feed integration

## Next Tasks
1. Add real Resend API key for email functionality
2. Implement Stripe payment for coffee bean orders
3. Build admin panel for managing products/reviews
