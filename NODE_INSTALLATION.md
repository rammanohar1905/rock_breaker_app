# Node.js Installation Guide for Windows

**Status**: ❌ Node.js NOT detected on system  
**Date**: April 16, 2026

---

## 🚨 IMPORTANT: Node.js is Required

Your system currently **does not have Node.js installed**. This is required to run the project.

---

## ✅ Installation Options

### **Option 1: Official Node.js Installer (RECOMMENDED)**

1. **Download Node.js LTS**
   - Go to: https://nodejs.org/
   - Download: **LTS (Long Term Support)** version
   - Current LTS: v20.x or higher

2. **Run the Installer**
   - Double-click the downloaded `.msi` file
   - Follow the wizard (click Next, Next, Install)
   - **Default options are fine** - keep them selected
   - Installation typically takes 2-3 minutes

3. **Restart Your Computer**
   - **IMPORTANT**: Restart after installation for PATH updates
   - This ensures your terminal can find `node` and `npm`

4. **Verify Installation**
   ```powershell
   node --version      # Should show v20.x.x or higher
   npm --version       # Should show 10.x.x or higher
   ```

---

### **Option 2: Chocolatey (If Installed)**

If you have Chocolatey package manager:

```powershell
choco install nodejs
```

Restart PowerShell and verify:
```powershell
node --version
npm --version
```

---

### **Option 3: Windows Package Manager (winget)**

If Windows 11 or newer with winget:

```powershell
winget install OpenJS.NodeJS
```

Restart PowerShell and verify:
```powershell
node --version
npm --version
```

---

## ❌ If Installation Fails

**Common Issues:**

1. **"Access Denied" during installation**
   - Run installer as Administrator
   - Right-click installer → "Run as administrator"

2. **PATH not updating after restart**
   - Close and reopen PowerShell completely
   - Or restart your computer

3. **Still "command not found"**
   - Check System Environment Variables:
     - Press `Win + X`, select "System"
     - Click "Advanced system settings"
     - Click "Environment Variables"
     - Look for `nodejs` in PATH
     - If missing, restart computer

---

## ✅ After Installation: Project Setup

Once Node.js is installed and verified:

```powershell
# Navigate to project
cd "c:\Users\ADMIN\Documents\rock-wise-insight-main"

# Install all dependencies (one-time)
npm install

# Start development server
npm run dev
```

---

## 📋 Verification Steps

After each installation step, verify:

```powershell
# Check Node version
node --version
# Expected: v18.x.x or higher (v20.x or v22.x recommended)

# Check npm version
npm --version
# Expected: 9.x.x or higher (10.x recommended)

# Check npm registry (should return a long registry URL)
npm config get registry
# Expected: https://registry.npmjs.org/
```

---

## 🎯 Once Node.js is Installed

After successful installation and restart, run:

```powershell
# Go to project folder
cd "c:\Users\ADMIN\Documents\rock-wise-insight-main"

# Install dependencies
npm install

# Start the app
npm run dev
```

Then open: **http://localhost:8080** in your browser

---

## 💡 Pro Tips

- **Don't use administrator PowerShell** for npm commands (unless installing globally)
- **Close and reopen PowerShell** after installation
- **Restart your computer** after Node.js installation for best results
- If port 8080 is in use, use: `npm run dev -- --port 3000`

---

## ⚠️ What NOT to Do

❌ Don't try to run `npm install` without Node.js installed  
❌ Don't manually edit PATH variables (installer does this)  
❌ Don't skip the restart step  
❌ Don't use the old Node.js versions (use v18+ or v20+)  

---

## 🔗 Quick Links

- Node.js Official: https://nodejs.org/
- npm Documentation: https://docs.npmjs.com/
- Chocolatey: https://chocolatey.org/
- Windows Package Manager: https://learn.microsoft.com/en-us/windows/package-manager/

---

## 📞 Need Help?

After installing Node.js:

1. **Restart PowerShell completely**
2. **Navigate to project**: `cd "c:\Users\ADMIN\Documents\rock-wise-insight-main"`
3. **Run**: `npm install`
4. **Then**: `npm run dev`

If you still get errors, check:
- Node version: `node --version` (should be v18+)
- npm version: `npm --version` (should be v9+)
- No special characters in folder path ✓

---

**Next Steps:**
1. Download and install Node.js from https://nodejs.org/
2. Restart your computer
3. Come back here and I'll help with `npm install` and running the app

---

*I'll be ready to help as soon as Node.js is installed!*
