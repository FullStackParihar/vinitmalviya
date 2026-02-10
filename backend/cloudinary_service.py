import cloudinary
import cloudinary.uploader
import shutil
import os
from fastapi import UploadFile

# Configure Cloudinary
# Assuming env vars are loaded in main.py or here
cloudinary.config( 
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"), 
  api_key = os.getenv("CLOUDINARY_API_KEY"), 
  api_secret = os.getenv("CLOUDINARY_API_SECRET"),
  secure = True
)

async def upload_image_to_cloudinary(file: UploadFile, folder: str = "ramdev_builders"):
    """
    Uploads a file to Cloudinary and returns the secure URL.
    Handles both images and videos.
    """
    
    # Cloudinary upload is synchronous, so we might need to run it in a threadpool 
    # if we wanted to be strictly non-blocking, but for simplicity we'll call it directly
    # or better, use `run_in_executor` if traffic is high.
    
    # For now, let's keep it simple. Cloudinary's python SDK handles it well.
    
    try:
        # Determine resource type
        resource_type = "auto" # automatically detect image vs video
        
        # Read file content - use run_in_executor for the blocking upload call to not freeze async loop
        # For small files, await file.read() is okay. For large files, this consumes RAM.
        # But cloudinary.uploader.upload expects a file-like object or content.
        
        content = await file.read()

        import asyncio
        from functools import partial
        
        loop = asyncio.get_running_loop()
        upload_result = await loop.run_in_executor(
            None, 
            partial(
                cloudinary.uploader.upload, 
                content, 
                folder=folder, 
                resource_type=resource_type
            )
        )
        
        # Return the secure URL
        return upload_result.get("secure_url")

    except Exception as e:
        print(f"Cloudinary Upload Error: {e}")
        return None
