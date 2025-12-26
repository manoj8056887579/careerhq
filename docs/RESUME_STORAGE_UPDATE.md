# Resume Storage Update - Local File System

## Changes Made

### 1. Created Resume Upload Utility (`src/lib/resume-upload-utils.ts`)
- **uploadResume()** - Saves resume files to `public/resumes/` folder
- **deleteResume()** - Removes resume files from disk
- **getResumeInfo()** - Extracts file metadata (name, extension, MIME type)
- **Unique filename generation** - Format: `{name}_{timestamp}_{random}.{ext}`
- **Automatic directory creation** - Creates `public/resumes/` if it doesn't exist

### 2. Updated Application API (`src/app/api/careers/applications/route.ts`)
- Changed from Cloudinary upload to local file system
- Uses `uploadResume()` instead of `handleImageUpload()`
- Stores file path (e.g., `/resumes/filename.pdf`) in database
- Validates file type and size before upload

### 3. Updated Application Delete API (`src/app/api/careers/applications/[id]/route.ts`)
- Changed from Cloudinary deletion to local file deletion
- Uses `deleteResume()` to remove files from disk
- Automatically cleans up files when application is deleted

### 4. Created Download API (`src/app/api/careers/applications/[id]/download/route.ts`)
- New endpoint: `GET /api/careers/applications/[id]/download`
- Reads resume file from disk
- Returns file with proper headers:
  - `Content-Type` - Correct MIME type (PDF/DOC/DOCX)
  - `Content-Disposition` - Forces download with clean filename
  - `Content-Length` - File size
- Filename format: `{ApplicantName}_Resume.{ext}`

### 5. Updated Admin Component (`src/components/admin/careers/admin-job-applications.tsx`)
- Changed download button to use new download API
- Fetches file as blob and triggers browser download
- Shows success/error toast notifications
- Automatic cleanup of blob URLs

### 6. Updated .gitignore
- Added `/public/resumes/` to ignore uploaded files
- Prevents sensitive resume files from being committed to git

### 7. Created Resumes Directory
- Created `public/resumes/.gitkeep` to track empty directory
- Directory is created automatically on first upload if missing

## File Storage Structure

```
public/
└── resumes/
    ├── .gitkeep                                    # Tracks directory in git
    ├── John_Doe_1735234567890_abc123.pdf          # Example resume
    ├── Jane_Smith_1735234598765_xyz789.docx       # Example resume
    └── ...                                         # More resumes
```

## Benefits

✅ **No External Dependencies** - No need for Cloudinary API keys
✅ **Faster Uploads** - Direct file system writes
✅ **Faster Downloads** - Direct file system reads
✅ **Cost Effective** - No cloud storage costs
✅ **Privacy** - Files stay on your server
✅ **Simple Backup** - Just backup the resumes folder
✅ **Easy Migration** - Copy folder to new server

## Security Considerations

⚠️ **File Validation** - Only PDF, DOC, DOCX allowed (5MB max)
⚠️ **Unique Filenames** - Prevents overwrites and conflicts
⚠️ **Git Ignored** - Resumes not committed to repository
⚠️ **Admin Only** - Only authenticated admins can download
⚠️ **Sanitized Names** - Special characters removed from filenames

## Download Flow

1. Admin clicks "Resume" button
2. Frontend calls `/api/careers/applications/[id]/download`
3. API validates application exists
4. API reads file from `public/resumes/`
5. API returns file with download headers
6. Browser downloads file with clean name
7. Frontend shows success notification

## Backup Recommendations

1. **Regular Backups** - Backup `public/resumes/` folder regularly
2. **Database Sync** - Ensure resume paths in DB match actual files
3. **Cleanup Script** - Periodically remove orphaned files
4. **Storage Monitoring** - Monitor disk space usage

## Migration from Cloudinary (if needed)

If you have existing resumes in Cloudinary:

1. Download all resumes from Cloudinary
2. Save them to `public/resumes/` with proper naming
3. Update `resumeId` field in database with new paths
4. Test downloads work correctly
5. Remove Cloudinary resumes

## Testing Checklist

- [x] Resume upload works
- [x] Resume download works
- [x] Resume deletion works
- [x] File validation works
- [x] Unique filenames generated
- [x] Directory auto-created
- [x] Git ignores resumes
- [x] Admin notifications work
- [x] Proper MIME types set
- [x] Clean download filenames
