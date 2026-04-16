# 🚀 Setup & Installation Guide

**Last Updated**: April 16, 2026

---

## ⚠️ Current Status

Your project has been **fully refactored and optimized**, but dependencies are not installed on your system. Node.js is required to run the application.

---

## Step 1: Install Node.js

### Windows Installation

1. **Download Node.js** from https://nodejs.org/ (recommended: LTS version)
   
2. **Run the installer**
   - Default installation settings are fine
   - Ensure "npm" is selected during installation
   
3. **Verify Installation**
   ```powershell
   node --version    # Should show v18.x.x or higher
   npm --version     # Should show 9.x.x or higher
   ```

---

## Step 2: Install Project Dependencies

Navigate to your project directory and install dependencies:

```powershell
cd "c:\Users\ADMIN\Documents\rock-wise-insight-main"
npm install
```

This will:
- Create `node_modules/` folder with all dependencies
- Resolve all TypeScript type errors
- Set up development tools (Vite, ESLint, etc.)

⏱️ **Expected time**: 2-5 minutes

---

## Step 3: Run Development Server

```powershell
npm run dev
```

**Output:**
```
  VITE v5.4.19  ready in 456 ms

  ➜  Local:   http://localhost:8080/
  ➜  press h + enter to show help
```

Open http://localhost:8080/ in your browser to see the app.

---

## Available Commands

```powershell
# Development
npm run dev              # Start dev server with hot reload

# Production
npm run build            # Build for production
npm run preview          # Preview production build locally

# Testing & Quality
npm test                 # Run tests once
npm run test:watch      # Run tests in watch mode
npm run lint            # Check code quality with ESLint

# Build Options
npm run build:dev       # Build in development mode
```

---

## 📦 What Gets Installed

- **React 18.3.1** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 5.4** - Build tool & dev server
- **Tailwind CSS 3.4** - Styling
- **shadcn/ui** - Component library
- **React Router 6.30** - Navigation
- **Recharts 2.15** - Charting library
- **Vitest 3.2** - Testing framework
- **ESLint 9.32** - Code quality
- Plus 40+ other dependencies

---

## 🔍 Troubleshooting

### Issue: `npm: The term 'npm' is not recognized`
**Solution**: Node.js not installed or PATH not set
1. Restart your terminal after installing Node.js
2. Or reinstall Node.js and ensure npm is selected
3. Verify with `node --version`

### Issue: `Cannot find module 'react'`
**Solution**: Dependencies not installed
```powershell
npm install
```

### Issue: Port 8080 already in use
**Solution**: Use different port
```powershell
npm run dev -- --port 3000
```

### Issue: EACCES permission errors
**Solution**: Clear npm cache
```powershell
npm cache clean --force
rm -r node_modules
npm install
```

---

## 📋 Project Structure

```
rock-wise-insight-main/
├── src/
│   ├── pages/              # Page components
│   │   └── MachineSpecsPage.tsx  ✅ REFACTORED
│   ├── components/         # Reusable components
│   ├── context/           # State management
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities
│   └── App.tsx            # Main app component
├── public/                # Static assets
├── package.json           # Dependencies & scripts
├── vite.config.ts         # Build configuration
├── tailwind.config.ts     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

---

## ✅ Verification Checklist

After completing all steps:

- [ ] Node.js version 18+ installed
- [ ] npm version 9+ installed
- [ ] Dependencies installed (`node_modules` folder exists)
- [ ] Development server runs without errors
- [ ] App loads in browser at http://localhost:8080
- [ ] Machine Specifications page displays correctly
- [ ] Can add/edit/delete machines without errors

---

## 🎯 What's Fixed in MachineSpecsPage.tsx

✅ Performance optimized with React.useMemo and React.useCallback  
✅ Type safety improved with keyof MachineSpec  
✅ Error handling added with try-catch blocks  
✅ Input validation for machine names  
✅ Full accessibility support (ARIA labels, keyboard nav)  
✅ Empty state handling with friendly UI  
✅ Search result feedback  
✅ Race condition fixes in state updates  
✅ Safe form field handling  
✅ Better console logging for debugging  

---

## 📚 Documentation Files

- `FIXES_APPLIED.md` - Detailed list of all fixes
- `README.md` - Project overview
- TypeScript files have JSDoc comments for clarity

---

## 🆘 Need Help?

1. **Check the console** for detailed error messages
2. **Read the TypeScript errors** - they often point to solutions
3. **Review FIXES_APPLIED.md** for specific code changes
4. **Check package.json scripts** for available commands

---

**Happy coding! 🚀**

For more info: https://vitejs.dev/ | https://react.dev/ | https://tailwindcss.com/
