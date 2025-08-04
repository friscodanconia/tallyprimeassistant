# 🏢 TallyPrime AI Assistant

An intelligent, AI-powered assistant designed specifically for TallyPrime accounting software users. This comprehensive assistant provides instant help, detailed simulations, and expert guidance for all your TallyPrime needs.

![TallyPrime Assistant](https://img.shields.io/badge/TallyPrime-AI%20Assistant-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=flat&logo=openai)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)

## ✨ Features

### 🤖 **AI-Powered Chat Interface**
- **GPT-4o Integration**: Advanced AI responses powered by OpenAI's latest model
- **Context-Aware Conversations**: Maintains conversation history and context
- **Natural Language Processing**: Ask questions in plain English about TallyPrime

### 🎯 **Quick Actions Simulator**
- **Authentic TallyPrime Simulations**: Generate detailed, step-by-step procedures
- **12+ Pre-built Actions**: Voucher creation, reports, balance sheets, invoices, and more
- **Interface-Accurate Output**: ASCII-style layouts that mirror actual TallyPrime screens
- **Realistic Sample Data**: Indian business context with GST numbers, HSN codes, and proper formatting

### 🔍 **Smart Knowledge Base**
- **67+ Comprehensive FAQs**: Covering all major TallyPrime topics
- **Vector-Powered Search**: Semantic search using AI embeddings
- **Hybrid Search System**: Combines keyword and semantic matching
- **Instant Answers**: Get immediate responses to common TallyPrime questions

### 🧠 **Memory & Personalization**
- **Conversation Memory**: Remembers your previous interactions
- **User Preferences**: Adapts to your workflow and preferences
- **Contextual Suggestions**: Smart prompts based on your usage patterns
- **Session Persistence**: Maintains context across browser sessions

### 🎨 **Premium Design**
- **Authentic TallyPrime Branding**: Official color schemes and design language
- **Mobile-Optimized**: Responsive design for desktop and mobile devices
- **Modern UI/UX**: Clean, professional interface with smooth animations
- **Accessibility**: WCAG compliant design for all users

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/friscodanconia/tallyprimeassistant.git
   cd tallyprimeassistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in the root directory
   echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Query** for state management and caching
- **Lucide React** for icons
- **Vite** for build tooling

### Backend
- **Express.js** with TypeScript
- **OpenAI API** (GPT-4o) for AI responses
- **Vector Search** using Transformers.js
- **In-memory Storage** for development
- **CORS** enabled for cross-origin requests

### AI & Search
- **OpenAI GPT-4o** for intelligent responses
- **Semantic Search** with embeddings
- **Vector Database** for FAQ matching
- **Hybrid Search Algorithm** (keyword + semantic)

## 📋 Available Quick Actions

| Action | Description |
|--------|-------------|
| 🧾 **Create Voucher** | Step-by-step voucher entry with GST calculations |
| 📊 **Day Book Report** | Daily transaction summaries and analysis |
| ⚖️ **Balance Sheet** | Financial position with assets and liabilities |
| 🧾 **Sales Invoice** | GST-compliant invoice generation |
| 📖 **Ledger Account** | Account transactions with running balances |
| 🎯 **Trial Balance** | Account balances verification |
| 👥 **Customer Master** | Customer information and outstanding balances |
| 📦 **Stock Summary** | Inventory levels and stock values |
| 💳 **Payment Voucher** | Payment recording with accounting entries |
| 📈 **Profit & Loss** | Revenue, expenses, and profit calculations |
| 🏢 **Company Info** | Company details and configuration |
| ⚙️ **Configuration** | TallyPrime settings and customization |

## 🎯 Key Capabilities

### **Authentic TallyPrime Simulations**
- **Interface-Accurate**: Simulations mirror actual TallyPrime screens
- **Step-by-Step Guidance**: Detailed navigation with menu paths
- **Function Key References**: F4 (Contra), F5 (Payment), F8 (Sales), etc.
- **Sample Data**: Realistic Indian business scenarios with proper GST formatting

### **Smart FAQ System**
- **Comprehensive Coverage**: Installation, configuration, vouchers, reports, GST, inventory
- **Instant Search**: Find answers in milliseconds
- **Contextual Results**: Relevant suggestions based on your query
- **Always Updated**: Continuously expanding knowledge base

### **AI-Powered Assistance**
- **Natural Conversations**: Ask questions in plain English
- **Context Awareness**: Understands your previous questions
- **Expert Knowledge**: Trained on TallyPrime best practices
- **Multilingual Support**: English with Hindi terminology support

## 🔧 Development

### **Project Structure**
```
tallyprimeassistant/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and API client
│   │   └── hooks/          # Custom React hooks
├── server/                 # Express backend
│   ├── services/           # Business logic
│   ├── data/               # Knowledge base
│   └── routes.ts           # API routes
├── shared/                 # Shared types and schemas
└── dist/                   # Production build
```

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run check        # TypeScript type checking
```

### **API Endpoints**
- `GET /api/messages` - Retrieve chat messages
- `POST /api/messages` - Send new message
- `POST /api/simulate` - Generate TallyPrime simulation
- `GET /api/faq` - Search FAQ database
- `DELETE /api/messages` - Clear chat history

## 🎨 Design Philosophy

### **Authentic TallyPrime Experience**
- **Official Branding**: Uses TallyPrime's signature blue gradient and design elements
- **Familiar Interface**: Mirrors TallyPrime's layout and navigation patterns
- **Professional Polish**: Enterprise-grade UI suitable for business environments

### **User-Centric Design**
- **Intuitive Navigation**: Easy-to-find features and clear information hierarchy
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Accessibility First**: Screen reader compatible and keyboard navigable

## 🚀 Deployment

### **Production Build**
```bash
npm run build
npm run start
```

### **Environment Variables**
```env
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=production
PORT=3000
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on:
- Code style and conventions
- Pull request process
- Issue reporting
- Feature requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TallyPrime** for the excellent accounting software that inspired this assistant
- **OpenAI** for providing the powerful GPT-4o API
- **React Community** for the amazing ecosystem and tools
- **All Contributors** who helped make this project better

## 📞 Support

For support, questions, or feature requests:
- 📧 Email: [your-email@domain.com]
- 🐛 Issues: [GitHub Issues](https://github.com/friscodanconia/tallyprimeassistant/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/friscodanconia/tallyprimeassistant/discussions)

---

**Made with ❤️ for the TallyPrime community**

*Empowering businesses with AI-powered accounting assistance*
