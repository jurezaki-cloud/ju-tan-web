@echo off
title JU-TAN Localhost Restart

echo ====================================
echo      JU-TAN LOCALHOST RESTART
echo ====================================

echo.
echo [1/4] Ustavljam Node procese...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo [2/4] Brisem Next.js cache...
if exist .next rmdir /S /Q .next

echo.
echo [3/4] Namestim odvisnosti...
call npm install

echo.
echo [4/4] Zaganjam razvojni streznik...
npm run dev

pause
