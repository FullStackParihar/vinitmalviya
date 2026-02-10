from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
import os
from dotenv import load_dotenv

load_dotenv()

# Load env vars
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM = os.getenv("MAIL_FROM")
MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
MAIL_FROM_NAME = os.getenv("MAIL_FROM_NAME", "Ramdev Builders Website")

# Helper to check if email is configured
def is_email_configured():
    return bool(MAIL_USERNAME and MAIL_PASSWORD and MAIL_FROM)

if is_email_configured():
    conf = ConnectionConfig(
        MAIL_USERNAME=MAIL_USERNAME,
        MAIL_PASSWORD=MAIL_PASSWORD,
        MAIL_FROM=MAIL_FROM,
        MAIL_PORT=MAIL_PORT,
        MAIL_SERVER=MAIL_SERVER,
        MAIL_STARTTLS=True,
        MAIL_SSL_TLS=False,
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True
    )
else:
    conf = None

async def send_lead_notification(lead_data: dict):
    """
    Sends an email notification when a new lead is submitted.
    """
    if not conf:
        print("⚠️ Email notification SKIPPED: MAIL_USERNAME or MAIL_PASSWORD not set in .env")
        print(f"   Lead Data: {lead_data}")
        return

    html = f"""
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #2c3e50;">New Inquiry Received</h2>
        <p>You have a new lead from the website:</p>
        <hr style="border: 0; border-top: 1px solid #eee;">
        <p><strong>Name:</strong> {lead_data.get('name')}</p>
        <p><strong>Phone:</strong> <a href="tel:{lead_data.get('phone')}">{lead_data.get('phone')}</a></p>
        <p><strong>Email:</strong> {lead_data.get('email', 'N/A')}</p>
        <p><strong>Interest:</strong> {lead_data.get('interest')}</p>
        <br>
        <p style="font-size: 12px; color: #7f8c8d;">This is an automated message from Ramdev Builders System.</p>
    </div>
    """

    try:
        message = MessageSchema(
            subject=f"New Lead: {lead_data.get('name')} - {lead_data.get('interest')}",
            recipients=[MAIL_FROM],  # Send to the owner
            body=html,
            subtype=MessageType.html
        )

        fm = FastMail(conf)
        await fm.send_message(message)
        print(f"✅ Email notification sent to {MAIL_FROM}")
    except Exception as e:
        print(f"❌ Failed to send email: {e}")

async def send_test_email(to_email: str):
    if not conf:
        raise Exception("Email configuration missing in .env")
    
    message = MessageSchema(
        subject="Test Email from Ramdev Builders",
        recipients=[to_email],
        body="<h1>It Works!</h1><p>Your email service is correctly configured.</p>",
        subtype=MessageType.html
    )
    fm = FastMail(conf)
    await fm.send_message(message)
