# 🎨 HueForge

**AI-Powered Design System Generator**

Generate your complete design system — from **colour palettes** to **typography** to **UI components** — in just a few clicks. HueForge fuses creativity and AI to help developers and designers build beautiful, consistent interfaces instantly.

---

## 🚀 Features

### 🎨 Colour Palette
- Generate palettes from text prompts using AI  
- Preview gradient styles  
- Copy HEX codes or gradient strings  
- Save palettes to your account  

### ✍️ Typography
- Generate modern type systems (font family, weight, and scale)  
- Live preview of headings and paragraphs  
- Save and reuse your preferred typography styles  

### 🧩 Component Generator
- Enter a prompt like *“modern pricing card with glassmorphism”*  
- AI generates full React + Tailwind + Framer Motion + ShadCN component code  
- Auto-applies your saved palette and typography  
- **Design System Toggle** → Choose between:
  - **Your Own Design System:** Uses your saved colour palette and typography  
  - **AI Design System:** Lets the AI create a unique visual style from scratch  
- Supports **dark and light mode** with instant preview  
- Copy or save generated code  

### 💾 Saved Section
- View, edit, or delete your saved palettes, typographies, and components  
- Reuse them anytime  

### 🌗 Theme Mode
- Switch between dark and light preview modes instantly  
- Components automatically adapt to the selected theme  

### 🔐 Authentication
- Secure login/signup via **Clerk**  
- User-specific storage with **Prisma + PostgreSQL (Neon DB)**  

---

## 🧰 Tech Stack

| Category | Tools |
|-----------|-------|
| Frontend | **Next.js (App Router)**, **Tailwind CSS**, **ShadCN UI**, **Framer Motion** |
| Backend | **Next.js API Routes**, **Prisma**, **PostgreSQL (Neon DB)** |
| Auth | **Clerk** |
| AI | **OpenAI API** (component, palette & typography generation) |
| Language | **TypeScript** |
| Hosting | **Vercel / Netlify** |

---

## ⚙️ How It Works

1. **Sign In** – Log in securely using Clerk.  
2. **Generate Palette** – Create a palette from a mood or description.  
3. **Generate Typography** – Build a type system for your brand.  
4. **Generate Components** – Combine palette + typography + AI prompt to produce clean, production-ready UI.  
5. **Use the Toggle** –  
   - Turn **ON** → Generate components based on your saved design system.  
   - Turn **OFF** → Let AI freely design the UI for you.  
6. **Preview & Save** – View your design live in light or dark mode and save it for later use.  
7. **Copy & Deploy** – Copy the generated code directly into your project.
