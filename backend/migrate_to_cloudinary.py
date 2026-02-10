import asyncio
import os
import cloudinary
import cloudinary.uploader
from database import DB
from dotenv import load_dotenv

load_dotenv()

# Configure Cloudinary
cloudinary.config( 
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"), 
  api_key = os.getenv("CLOUDINARY_API_KEY"), 
  api_secret = os.getenv("CLOUDINARY_API_SECRET"),
  secure = True
)

async def migrate_images():
    print("🚀 Starting migration of local uploads to Cloudinary...")
    
    # Verify Cloudinary config
    if not os.getenv("CLOUDINARY_CLOUD_NAME"):
        print("❌ Cloudinary credentials missing in .env")
        return

    count = 0
    updated = 0
    errors = 0

    cursor = DB.portfolio.find()
    async for item in cursor:
        original_url = item.get("image_url", "")
        
        # Check if it's a local file (starts with /uploads/)
        if original_url.startswith("/uploads/"):
            filename = original_url.replace("/uploads/", "")
            file_path = os.path.join("uploads", filename)
            
            print(f"📦 Processing: {item.get('title')} ({filename})")
            
            if os.path.exists(file_path):
                try:
                    # Determine resource type based on extension just in case, or let Cloudinary auto-detect
                    # Cloudinary auto usually works well.
                    
                    print(f"   ⬆️  Uploading to Cloudinary...")
                    response = cloudinary.uploader.upload(
                        file_path, 
                        folder="ramdev_portfolio",
                        resource_type="auto"
                    )
                    
                    secure_url = response.get("secure_url")
                    
                    if secure_url:
                        # Update MongoDB document
                        await DB.portfolio.update_one(
                            {"_id": item["_id"]},
                            {"$set": {"image_url": secure_url}}
                        )
                        print(f"   ✅ Updated DB: {secure_url}")
                        updated += 1
                        
                        # Optional: Rename local file to indicate it's migrated
                        # os.rename(file_path, file_path + ".migrated")
                    else:
                        print("   ❌ Upload failed: No URL returned")
                        errors += 1
                        
                except Exception as e:
                    print(f"   ❌ Error uploading: {e}")
                    errors += 1
            else:
                print(f"   ⚠️  File not found locally: {file_path}")
                # Maybe update DB to mark as missing? Or leave as broken link?
                # Leaving as is for safety.
                errors += 1
        else:
            # Already migrated or external URL
            # print(f"   ⏭️  Skipping (already remote): {item.get('title')}")
            pass
            
        count += 1

    print("-" * 30)
    print(f"Migration Complete!")
    print(f"Total Items Scanned: {count}")
    print(f"Actually Migrated: {updated}")
    print(f"Errors/Missing Files: {errors}")

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(migrate_images())
