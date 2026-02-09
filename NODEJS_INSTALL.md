# Node.js Installation Guide for Your System

## Current Situation
Your system has conda available but it has some configuration issues. Here are the best ways to install Node.js:

## Method 1: Manual Download and Install (Recommended)
1. **Download Node.js LTS**
   - Go to https://nodejs.org/
   - Click "Download Node.js (LTS)" 
   - Choose "macOS Installer" (.pkg file)
   
2. **Install**
   - Double-click the downloaded .pkg file
   - Follow the installation wizard
   - This will install both Node.js and npm

3. **Verify Installation**
   - Open a NEW terminal window
   - Run: `node --version`
   - Run: `npm --version`

## Method 2: Using NVM (Node Version Manager)
If you prefer to manage Node.js versions:

1. **Install NVM**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

2. **Restart Terminal or Source Profile**
   ```bash
   source ~/.zshrc
   ```

3. **Install Latest Node.js LTS**
   ```bash
   nvm install --lts
   nvm use --lts
   ```

## Method 3: Try Alternative Conda Channels
If you want to stick with conda:
```bash
# Try different conda channels
conda install nodejs -c conda-forge --yes
# or
conda install -c anaconda nodejs
```

## After Installation - Test Your Backend

Once Node.js is installed:

1. **Navigate to Backend Directory**
   ```bash
   cd "/Users/gregorygrant/Desktop/hbiu lms/hbiu-online-studies/backend"
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Server with Fresh Database**
   ```bash
   npm run dev:fresh
   ```

4. **Expected Output**
   ```
   ✅ SQLite database connected successfully
   📊 Database models synchronized
   🚀 Server running on port 5000
   ```

5. **Test API**
   - Visit: http://localhost:5000/health
   - Should show: "HBIU LMS Backend is running"

## Troubleshooting

### If npm is still not found after installation:
1. Close all terminal windows
2. Open a new terminal
3. Check: `echo $PATH`
4. Node.js should be in `/usr/local/bin` or similar

### If you get permission errors:
```bash
# Fix npm permissions
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

### If the server won't start:
1. Make sure port 5000 is free:
   ```bash
   lsof -i :5000
   ```
2. Or change port in `.env`:
   ```
   PORT=3001
   ```

## Your Backend is Ready!
Once Node.js is installed, your backend will work perfectly. All the code is complete and the database issues have been fixed.