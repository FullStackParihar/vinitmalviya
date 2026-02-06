Project Identity
Name: Malviya & Co. Portfolio

Industry: Architecture, Interior Design, & Construction Contracting

Objective: A high-end, high-conversion showcase website for a professional contractor/hardware dealer.

System Architecture
Frontend: React.js (Vite) + Tailwind CSS + Framer Motion.

Backend: FastAPI (Python) for AI features and Lead Management.

Database: MongoDB Atlas (Free Tier).

Asset Management: Cloudinary SDK (for high-res image delivery).

Integrations: Gemini API (AI Consultant), WhatsApp Business API (Direct Lead).

1. Visual Identity & UI/UX
Theme: Minimalist Luxury.

Color Palette:

Primary: #1A1A1B (Deep Charcoal - for text and headers)

Accent: #D4AF37 (Antique Gold - for buttons, borders, and highlights)

Background: #F9F9F7 (Bone White - for a clean canvas)

Typography: Serif for headings (Playfair Display) and Sans-serif for body (Inter/Montserrat).

Special Effects: - Smooth parallax scrolling.

Reveal-on-scroll animations using framer-motion.

2. Core Feature Specifications
A. Smart Hero Section
Dynamic slider showing "Finished Projects."

CTA: "Book a Site Visit" and "Explore Catalog."

B. Portfolio Masonry Grid
Filterable gallery: [All, Living Room, Kitchen, Office, Hardware Fittings].

Each project must include: Image, Title, Scope of Work (e.g., "Full Renovation"), and "Inquire about this style" button.

C. AI Interior Consultant (GenAI Integration)
Interface: Floating chat bubble.

Logic: Powered by Gemini. It should answer questions like "What hardware is best for a damp kitchen?" or "Estimate cost for 2BHK false ceiling."

Lead Capture: At the end of the AI chat, prompt for a phone number.

D. Hardware Showcase
A dedicated section for premium hardware (handles, hinges, smart locks).

"Request Wholesale Price" button that triggers a WhatsApp message.

3. Technical Implementation Roadmap
Phase 1: Foundation
Initialize Vite + React.

Configure tailwind.config.js with the Hex codes above.

Setup Folder Structure: /components, /hooks, /pages, /assets.

Phase 2: UI Development
Create a Layout wrapper with a Sticky Transparent Header.

Build the ProjectCard component with a hover-zoom effect.

Implement a "Before/After" slider component for renovation proof.

Phase 3: Backend & AI
Setup FastAPI with CORS middleware.

Create /chat route: Connect to google-generativeai library.

Create /leads route: Simple POST to MongoDB to store user inquiries.

4. Prompt for AI IDE Initialization
"Act as a Senior Full Stack Developer. I have provided project.md.

Start by initializing a React + Tailwind project.

Create the tailwind.config.js using the Primary/Accent/Background colors defined.

Generate a Responsive Navbar and a Hero section with a 'Luxurious' feel.

Use Framer Motion for a fade-in effect on all sections."