# 🌍 Next Earth — AI-Powered Climate Action Navigator

> **Next Earth** helps people — especially youth in climate-vulnerable regions — discover meaningful climate-action roles, learn new skills, and connect to real opportunities.  
> Built with **Next.js**, **OpenAI**, and live **climate-risk data (ASDI / NOAA)**, it’s your personal AI adviser for a greener, fairer future.

---

## 🚀 Features

### 🔹 Guided User Journey
1. **Start** — Learn the mission and choose how you want to make an impact.  
2. **Matches** — AI-powered recommendations for climate roles and training, based on your country, skills, and interests.  
3. **Insights** — Real-time climate news, learning opportunities, and regional alerts.  
4. **AI Adviser** — A conversational mentor that gives personalized advice, skill-growth tips, and local resources.

### 🔹 Key Highlights
- 🌱 **Reduced Inequalities + Climate Action** (UN SDG 10 & 13)  
- 🤖 **OpenAI-powered adviser** that explains *why* each role fits you  
- 🧭 **Dynamic matching engine** (skills × risk × equity boost)  
- 📰 **Live updates feed** with climate and sustainability news  
- 💎 **Modern dark-glass UI** with animations & responsive design  

---

## 🧠 Tech Stack

| Area | Tech |
|------|------|
| Frontend | Next.js 14 (App Router) + TypeScript + CSS Modules + Tailwind |
| Backend | Next.js API Routes (Node runtime) |
| AI Integration | OpenAI API (`gpt-4o-mini`) |
| Data | ASDI / NOAA risk data + curated `roles.json` |
| Hosting | Vercel |
| Version Control | Git + GitHub |

---

## ⚙️ Getting Started

### 1️⃣ Clone the repo
```bash
git clone https://github.com/menelao6/next-earth.git
cd next-earth 

2️⃣ Install dependencies
npm install

3️⃣ Set up environment variables

Create a .env.local file in the project root:

OPENAI_API_KEY=sk-your-openai-key
OPENAI_MODEL=gpt-4o-mini
NEWSDATA_API_KEY=

4️⃣ Run locally
npm run dev
