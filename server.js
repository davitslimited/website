import express from 'express';
import cors from 'cors';
import path from 'path';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import fs from 'fs';
import rateLimit from 'express-rate-limit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many contact form submissions. Please try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Configure SMTP transporter
let transporter = null;

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: parseInt(process.env.SMTP_PORT) === 465, // true for port 465, false for 587
    requireTLS: parseInt(process.env.SMTP_PORT) === 587, // force TLS for port 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false
    }
  });
  
  console.log('SMTP configured for:', process.env.SMTP_HOST);
  console.log('SMTP port:', parseInt(process.env.SMTP_PORT) || 587);
  console.log('SMTP user:', process.env.SMTP_USER);
  
  // Test the connection
  transporter.verify((error, success) => {
    if (error) {
      console.error('SMTP connection test failed:', error.message);
    } else {
      console.log('SMTP connection test successful');
    }
  });
} else {
  console.warn('Warning: SMTP credentials not set. Email functionality will not work.');
  console.warn('Required: SMTP_HOST, SMTP_USER, SMTP_PASS');
}

// Contact form endpoint with rate limiting
app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, serviceType, message } = req.body;
    const apiKey = req.headers['x-api-key'] || req.body.apiKey;

    // Validate API key
    const expectedApiKey = process.env.API_KEY;
    if (!expectedApiKey) {
      return res.status(500).json({
        success: false,
        message: 'API configuration error. Please contact support.'
      });
    }
    
    if (!apiKey || apiKey !== expectedApiKey) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid API key'
      });
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !serviceType || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Brand colors - using Davit's Limited golden brand color
    const brandColor = '#D4A017'; // hsl(43, 74%, 49%) converted to hex
    const brandColorLight = '#F5E6A3'; // Lighter version for backgrounds
    
    // Prepare admin notification email
    const adminSubject = `New Contact Form Submission - ${serviceType}`;
    const adminTextContent = `
      New Response from Contact Form:
      
      Name: ${firstName} ${lastName}
      Email: ${email}
      Phone: ${phone}
      Service Type: ${serviceType}
      
      Message:
      ${message}
      
      Submitted at: ${new Date().toLocaleString()}
    `;

    const adminHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, ${brandColor} 0%, #B8860B 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">DAVIT'S LIMITED</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">New Contact Form Submission</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px 20px;">
            <div style="background-color: ${brandColorLight}; padding: 25px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid ${brandColor};">
              <h2 style="color: ${brandColor}; margin: 0 0 20px 0; font-size: 20px;">Contact Information</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333; width: 120px;">Name:</td>
                  <td style="padding: 8px 0; color: #555;">${firstName} ${lastName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: ${brandColor}; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">Phone:</td>
                  <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: ${brandColor}; text-decoration: none;">${phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">Service:</td>
                  <td style="padding: 8px 0; color: #555; text-transform: capitalize;">${serviceType}</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: #ffffff; padding: 25px; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Message</h3>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; line-height: 1.6; color: #555; white-space: pre-wrap; border-left: 3px solid ${brandColor};">${message}</div>
            </div>
            
            <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e0e0e0;">
              <p style="margin: 0; font-size: 14px; color: #666;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #333; padding: 20px; text-align: center;">
            <p style="color: #ffffff; margin: 0; font-size: 14px;">DAVIT'S LIMITED - Professional Security Solutions</p>
            <p style="color: #999; margin: 5px 0 0 0; font-size: 12px;">This email was generated automatically from your website contact form.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Prepare customer confirmation email
    const customerSubject = 'Thank You for Contacting Davit\'s Limited - We\'ll Be In Touch Soon!';
    const customerTextContent = `
      Dear ${firstName} ${lastName},
      
      Thank you for contacting Davit's Limited. We have received your inquiry regarding ${serviceType} services.
      
      Here's a summary of what you submitted:
      
      Your Message:
      ${message}
      
      Service Type: ${serviceType}
      Contact Email: ${email}
      Contact Phone: ${phone}
      
      Our team will review your inquiry and respond within 2 hours during business hours.
      
      If you have any urgent security concerns, please call us directly at +1 (555) 123-4567.
      
      Best regards,
      The Davit's Limited Team
      Professional Security Solutions
    `;

    const customerHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank You - Davit's Limited</title>
          <style>
            @media only screen and (max-width: 600px) {
              .email-container { width: 100% !important; margin: 0 !important; }
              .email-content { padding: 20px 15px !important; }
              .email-header { padding: 30px 15px !important; }
              .message-box { padding: 15px !important; }
              .cta-button { padding: 10px 20px !important; font-size: 14px !important; }
              h1 { font-size: 24px !important; }
              h2 { font-size: 20px !important; }
              .table-cell { display: block !important; width: 100% !important; padding: 4px 0 !important; }
              .table-label { font-weight: bold !important; margin-bottom: 2px !important; }
            }
          </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-text-size-adjust: 100%;">
        <div class="email-container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          <!-- Header with Logo -->
          <div class="email-header" style="background: linear-gradient(135deg, ${brandColor} 0%, #B8860B 100%); padding: 40px 20px; text-align: center; position: relative;">
            <!-- Logo/Shield Icon -->
            <div style="margin-bottom: 15px;">
              <div style="display: inline-block; width: 60px; height: 60px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid rgba(255, 255, 255, 0.3);">
                <div style="width: 30px; height: 30px; border: 3px solid #ffffff; border-radius: 4px; position: relative;">
                  <div style="width: 8px; height: 8px; background-color: #ffffff; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>
                </div>
              </div>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">DAVIT'S LIMITED</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px; font-weight: 300;">Professional Security Solutions</p>
          </div>
          
          <!-- Content -->
          <div class="email-content" style="padding: 40px 25px;">
            <!-- Welcome Message -->
            <div style="margin-bottom: 35px;">
              <h2 style="color: ${brandColor}; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">Thank You for Your Inquiry!</h2>
              <p style="color: #555; font-size: 16px; margin: 0; line-height: 1.5;">Dear <strong style="color: ${brandColor};">${firstName} ${lastName}</strong>,</p>
            </div>
            
            <!-- Status Message -->
            <div style="background: linear-gradient(135deg, ${brandColorLight} 0%, #FDF6E3 100%); padding: 25px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid ${brandColor}; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
              <p style="color: #333; margin: 0 0 10px 0; line-height: 1.6; font-size: 16px;">✅ We have received your inquiry regarding <strong style="color: ${brandColor}; text-transform: capitalize;">${serviceType}</strong> services.</p>
              <p style="color: #555; margin: 0; line-height: 1.6;">Our security specialists will review your message and respond within <strong style="color: ${brandColor};">2 hours</strong> during business hours.</p>
            </div>
            
            <!-- Message Summary -->
            <div style="background-color: #ffffff; padding: 25px; border: 1px solid #e8e8e8; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);">
              <h3 style="color: #333; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; padding-bottom: 10px; border-bottom: 2px solid ${brandColor};">Your Inquiry Details</h3>
              
              <!-- Contact Information -->
              <div style="margin-bottom: 25px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td class="table-cell table-label" style="padding: 8px 0; font-weight: 600; color: #333; width: 140px; vertical-align: top;">Service Type:</td>
                    <td class="table-cell" style="padding: 8px 0; color: #555; text-transform: capitalize; font-weight: 500;">${serviceType}</td>
                  </tr>
                  <tr>
                    <td class="table-cell table-label" style="padding: 8px 0; font-weight: 600; color: #333; vertical-align: top;">Contact Email:</td>
                    <td class="table-cell" style="padding: 8px 0; color: #555;">${email}</td>
                  </tr>
                  <tr>
                    <td class="table-cell table-label" style="padding: 8px 0; font-weight: 600; color: #333; vertical-align: top;">Contact Phone:</td>
                    <td class="table-cell" style="padding: 8px 0; color: #555;">${phone}</td>
                  </tr>
                </table>
              </div>
              
              <!-- Message Content -->
              <div>
                <h4 style="color: #333; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">Your Message:</h4>
                <div class="message-box" style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; line-height: 1.7; color: #555; white-space: pre-wrap; border-left: 4px solid ${brandColor}; text-align: left; font-size: 15px;">${message}</div>
              </div>
            </div>
            
            <!-- Call to Action -->
            <div style="background: linear-gradient(135deg, #333 0%, #444 100%); padding: 30px 25px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
              <div style="margin-bottom: 15px;">
                <div style="display: inline-block; width: 40px; height: 40px; background-color: ${brandColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 20px; height: 14px; border-left: 3px solid #ffffff; border-bottom: 3px solid #ffffff; transform: rotate(-45deg); margin-top: -3px;"></div>
                </div>
              </div>
              <h3 style="color: ${brandColor}; margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">Need Immediate Assistance?</h3>
              <p style="color: #ffffff; margin: 0 0 18px 0; line-height: 1.5;">For urgent security concerns, call us directly:</p>
              <a href="tel:+15551234567" class="cta-button" style="display: inline-block; background: linear-gradient(135deg, ${brandColor} 0%, #B8860B 100%); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(212, 160, 23, 0.3); transition: all 0.3s ease;">📞 +1 (555) 123-4567</a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #1a1a1a; padding: 30px 25px; text-align: center; border-top: 3px solid ${brandColor};">
            <div style="margin-bottom: 15px;">
              <div style="display: inline-block; width: 40px; height: 40px; background-color: rgba(212, 160, 23, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid rgba(212, 160, 23, 0.3);">
                <div style="width: 20px; height: 20px; border: 2px solid ${brandColor}; border-radius: 3px; position: relative;">
                  <div style="width: 6px; height: 6px; background-color: ${brandColor}; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>
                </div>
              </div>
            </div>
            <p style="color: #ffffff; margin: 0 0 8px 0; font-size: 18px; font-weight: bold; letter-spacing: 0.5px;">DAVIT'S LIMITED</p>
            <p style="color: ${brandColor}; margin: 0 0 15px 0; font-size: 14px; font-weight: 500;">Professional Security Solutions Since 2018</p>
            <div style="border-top: 1px solid #333; padding-top: 15px; margin-top: 15px;">
              <p style="color: #888; margin: 0; font-size: 12px; line-height: 1.4;">Thank you for choosing Davit's Limited for your security needs.<br>This email was sent in response to your inquiry on our website.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email configuration
    const recipientEmail = process.env.RECIPIENT_EMAIL || 'info@davitslimited.com';
    const senderEmail = process.env.SMTP_USER;
    const fromName = 'Davit\'s Limited';

    // Admin notification email
    const adminMailOptions = {
      from: `"${fromName}" <${senderEmail}>`,
      to: recipientEmail,
      subject: adminSubject,
      text: adminTextContent,
      html: adminHtmlContent,
    };

    // Customer confirmation email
    const customerMailOptions = {
      from: `"${fromName}" <${senderEmail}>`,
      to: email,
      subject: customerSubject,
      text: customerTextContent,
      html: customerHtmlContent,
    };

    // Send both emails via SMTP
    if (transporter) {
      try {
        // Send admin notification email
        await transporter.sendMail(adminMailOptions);
        console.log('Admin notification email sent successfully');
        
        // Send customer confirmation email
        await transporter.sendMail(customerMailOptions);
        console.log('Customer confirmation email sent successfully');
        
        res.json({
          success: true,
          message: 'Message sent successfully! We will respond within 2 hours. Please check your email for confirmation.'
        });
      } catch (emailError) {
        console.error('Error sending emails:', emailError);
        // Still return success to user since we received their message
        res.json({
          success: true,
          message: 'Message received successfully! We will respond within 2 hours.'
        });
      }
    } else {
      console.log('Email service not configured - Contact form submission received');
      
      res.status(503).json({
        success: false,
        message: 'Email service is not configured. Please try again later.'
      });
    }

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    // Check if it's an SMTP error
    if (error.code) {
      console.error('SMTP error code:', error.code);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Development vs Production setup
if (process.env.NODE_ENV === 'production') {
  // Serve static files in production
  app.use(express.static('dist/public'));
  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist/public/index.html'));
  });
} else {
  // Use Vite dev server in development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    configFile: path.resolve(__dirname, 'vite.config.ts'),
  });
  
  app.use(vite.middlewares);
  
  // Handle all non-API, non-asset routes to serve index.html for SPA (AFTER vite middlewares)
  app.get('*', async (req, res, next) => {
    // Skip if this is an API route
    if (req.originalUrl.startsWith('/api/')) {
      return next();
    }
    
    // Skip if this is a static asset (has file extension or starts with special paths)
    if (req.originalUrl.match(/\.(js|mjs|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i) ||
        req.originalUrl.startsWith('/@') ||
        req.originalUrl.startsWith('/src/')) {
      return next();
    }
    
    try {
      // Read index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, 'client/index.html'),
        'utf-8'
      );
      
      // Apply Vite HTML transforms (HMR, React refresh, etc.)
      template = await vite.transformIndexHtml(req.originalUrl, template);
      
      // Send the transformed HTML
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  });
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`SMTP configured: ${transporter ? 'Yes' : 'No'}`);
});