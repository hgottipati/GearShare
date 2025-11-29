# Open Graph Image Setup

This guide explains how to set up the Open Graph (OG) image for social media sharing.

## What is an OG Image?

When you share a link to your site on platforms like WhatsApp, Facebook, Twitter, LinkedIn, or Messages, they show a preview card with:
- A thumbnail image
- Title
- Description

This is controlled by Open Graph metadata tags.

## Current Setup

The metadata has been configured in `app/layout.tsx` with:
- Open Graph tags for Facebook, LinkedIn, etc.
- Twitter Card tags
- Proper image references

## Creating the OG Image

You need a **1200x630 pixel PNG image** at `public/og-image.png`.

### Option 1: Use the HTML Template (Recommended)

1. Open `public/og-image.html` in your browser
2. Take a screenshot or use a tool to convert it to PNG:
   - **Mac**: Use Screenshot tool (Cmd+Shift+4, then select the browser window)
   - **Online**: Use [htmlcsstoimage.com](https://htmlcsstoimage.com) or similar
   - **Command line**: Use Puppeteer or Playwright to screenshot the HTML

### Option 2: Use Design Tools

Create a 1200x630px image with:
- Your logo
- "ShareMyGear" branding
- "Private Ski Gear Marketplace" subtitle
- "Buy, sell, and trade kids' ski gear with your community" description
- Brand colors: Orange (#f97316) and Blue (#3b82f6)

### Option 3: Use AI Image Generators

Use tools like:
- DALL-E
- Midjourney
- Canva
- Figma

Create a professional image matching your brand.

## Testing

After adding `og-image.png`:

1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
   - Enter your URL
   - Click "Scrape Again" to refresh

2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
   - Enter your URL
   - Preview the card

3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
   - Enter your URL
   - See the preview

4. **WhatsApp/Telegram**: Share the link in a chat to see the preview

## Environment Variables

Make sure `NEXT_PUBLIC_APP_URL` is set to your production domain:
- In Vercel: Settings → Environment Variables
- In `.env.local` for local testing: `NEXT_PUBLIC_APP_URL=http://localhost:3000`

The OG image URL must be absolute (full URL), not relative.

## Troubleshooting

**Image not showing?**
- Check the file exists at `public/og-image.png`
- Verify the URL in metadata is correct
- Clear cache in social media debuggers
- Ensure image is exactly 1200x630px for best results

**Wrong URL?**
- Update `NEXT_PUBLIC_APP_URL` environment variable
- Rebuild and redeploy your app

**Still not working?**
- Check browser console for errors
- Verify metadata tags in page source
- Use social media debuggers to see what they're reading

