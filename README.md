# 🎨 Portfolio Builder

A modern, full-stack portfolio builder application that allows users to create beautiful, customizable portfolios with multiple professional templates.

## ✨ Features

- 🎯 **9 Professional Templates**: Choose from Developer, Tester, AI/ML Engineer, Data Analyst, Premium Dark, Minimal, Creative, Modern, and Compact templates
- 👤 **User Authentication**: Secure login and registration system
- 📝 **Easy Portfolio Management**: Add skills, projects, education, and experience
- 🖼️ **Profile Pictures**: Upload and manage profile images
- 📄 **Resume Generation**: Download your portfolio as a PDF resume
- 🔗 **Shareable Links**: Get a unique URL for your portfolio
- 🎨 **Responsive Design**: Works perfectly on all devices
- 🌙 **Modern UI**: Built with React, TailwindCSS, and shadcn/ui

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components
- **Wouter** - Routing
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **Drizzle ORM** - Database ORM
- **Passport.js** - Authentication
- **bcrypt** - Password hashing

### Additional Tools
- **Vite** - Build tool
- **jsPDF** - PDF generation
- **Groq SDK** - AI features

## 📦 Installation

1. **Clone the repository**:
```bash
git clone https://github.com/YOUR_USERNAME/portfolio-builder.git
cd portfolio-builder
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio_db
GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=development
```

4. **Set up the database**:
```bash
npm run db:push
```

5. **Start the development server**:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🎯 Usage

1. **Register an account** - Create your user account
2. **Edit your portfolio** - Add your information, skills, projects, education, and experience
3. **Choose a template** - Select from 9 professional templates
4. **Upload profile picture** - Add a professional photo
5. **Share your portfolio** - Get a unique URL to share with others
6. **Download resume** - Generate a PDF version of your portfolio

## 🎨 Available Templates

1. **Developer** - Clean, code-focused design
2. **Tester/QA** - Professional testing-oriented layout
3. **AI/ML Engineer** - Modern, tech-forward design
4. **Data Analyst** - Data-visualization friendly layout
5. **Premium Dark** - Sleek dark theme
6. **Minimal** - Clean and simple design
7. **Creative** - Bold and artistic layout
8. **Modern** - Contemporary professional design
9. **Compact** - Space-efficient layout

## 📁 Project Structure

```
portfolio-builder/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities and helpers
│   │   └── hooks/       # Custom React hooks
├── server/              # Backend Express application
│   ├── index.ts         # Server entry point
│   └── routes/          # API routes
├── shared/              # Shared code between client and server
│   └── schema.ts        # Database schema and types
├── script/              # Build scripts
└── package.json         # Dependencies and scripts
```

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Push database schema changes

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Render (recommended)
- Railway
- Vercel + Neon
- Replit

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [TailwindCSS](https://tailwindcss.com/)

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ by Meera
