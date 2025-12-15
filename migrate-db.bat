@echo off
echo ========================================
echo MongoDB Migration Script
echo ========================================
echo.

set SOURCE_URI=mongodb+srv://azar:izGKEBQ4n4kAgsXo@3i-smarthome.mj57pex.mongodb.net/career-hq
set DEST_URI=mongodb+srv://azar_db_user:dhN2rZMDgHgxJ2M6@cluster0.6ytaamy.mongodb.net/new-career-hq
set DUMP_DIR=mongodb-dump

echo Step 1: Dumping data from source cluster...
echo Source: career-hq database
echo.

mongodump --uri="%SOURCE_URI%" --out="%DUMP_DIR%"

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Dump failed!
    pause
    exit /b 1
)

echo.
echo Dump completed successfully!
echo.
echo Step 2: Restoring data to destination cluster...
echo Destination: new-career-hq database
echo.

mongorestore --uri="%DEST_URI%" "%DUMP_DIR%/career-hq" --nsFrom="career-hq.*" --nsTo="new-career-hq.*"

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Restore failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Migration completed successfully!
echo ========================================
echo All data has been copied from career-hq to new-career-hq
echo.
pause
