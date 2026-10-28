# Thread & Vine Hall at Gibson Mill — website

Seven static pages: Home, Weddings, Spaces, Nonprofits, Churches, Plan Your Event, Good to Know.

## Change prices, times or contact info
Open **rates.js**. Every price and time on every page comes from there.
When the numbers are final, set `confirmed: true` to remove the yellow placeholder highlights.
Other bracketed placeholders (like the accessibility answer) are written into the pages and still need to be filled in.

## Change a photo
Photos live in **img/**. Each one has a large version (`name.webp`) and a phone version (`name-800.webp`).
To swap one, replace both files and keep the same names.
Still needed: the Spinning Room, the Thread Room (as a boardroom and as a getting-ready suite), and the Loom set for a reception.

## Go live on Netlify
1. Drag this folder onto app.netlify.com/drop.
2. In rates.js, set `form: { mode: "netlify" }`. Inquiries will then show up under Forms in Netlify, and you can turn on email notifications there.
3. Connect the domain (for example threadandvinehall.com) under Domain settings.
4. Paste the Plausible or GA4 snippet where each page says "Analytics". Tour clicks and inquiries are already tracked as events.

## Before launch, confirm
- Rates, deposit, Saturday end time, Sunday afternoon start time
- Email, phone, ZIP code, and the map pin (latitude and longitude in index.html)
- "Cannon Mills Plant No. 6" history line
- What's included, accessibility details, church-plant terms, nonprofit fine print
- Book Now tool for hourly rooms (Square Appointments, Peerspace or Tagvenue)
