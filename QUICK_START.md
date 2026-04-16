# ⚡ QUICK START CHECKLIST

## Current Status
- ❌ Node.js: **NOT INSTALLED**
- ❌ Dependencies: **NOT INSTALLED** (waiting for Node.js)
- ❌ App Server: **NOT RUNNING**

---

## What You Need To Do RIGHT NOW

### Step 1️⃣: Install Node.js (5 minutes)

**Download from**: https://nodejs.org/  
**Choose**: LTS version (v20.x or v22.x)  
**Install**: Run the `.msi` file, click Next → Next → Install  
**IMPORTANT**: Restart your computer after installation

### Step 2️⃣: Verify Installation (1 minute)

Open a NEW PowerShell and type:
```powershell
node --version
npm --version
```

Both should show version numbers (not errors).

### Step 3️⃣: Install Project Dependencies (2-5 minutes)

```powershell
cd "c:\Users\ADMIN\Documents\rock-wise-insight-main"
npm install
```

Wait for it to complete (you'll see a success message).

### Step 4️⃣: Start the App (30 seconds)

```powershell
npm run dev
```

You should see:
```
➜  Local:   http://localhost:8080/
```

### Step 5️⃣: Open Your Browser

Go to: **http://localhost:8080**

---

## Available Commands

Once Node.js is installed:

```powershell
npm run dev              # 🚀 Start development server
npm run build            # 📦 Build for production
npm test                 # ✅ Run tests
npm run lint             # 🔍 Check code quality
npm run preview          # 👁️ Preview production build
```

---

## When You're Ready

Once you've installed Node.js and restarted your computer:

1. Tell me "Node.js is installed"
2. I'll run `npm install` for you
3. I'll start `npm run dev`
4. Your app will be ready! 🚀

---

## 🆘 If Something Goes Wrong

**Common Issues & Fixes:**

| Problem | Solution |
|---------|----------|
| "node is not recognized" | Restart PowerShell and computer |
| "npm: command not found" | Node.js not fully installed, restart |
| "EACCES permission denied" | Close other terminals, try again |
| "Port 8080 in use" | Use `npm run dev -- --port 3000` |

---

## 📍 Project Location

```
c:\Users\ADMIN\Documents\rock-wise-insight-main\
├── src/
│   ├── pages/MachineSpecsPage.tsx ✅ REFACTORED
│   ├── components/
│   ├── context/
│   └── ...
├── package.json
├── vite.config.ts
└── ...
```

---

**I'm waiting for you to install Node.js. Once done, just let me know and I'll complete the setup! 🚀**
