/* ============================================================
   THREAD & VINE HALL — RATES, CONTACT AND SITE SETTINGS
   This is the only file you need to edit to change prices,
   times, or contact details. Every page reads from here.

   - Change a number, save, re-upload. That's it.
   - Set "confirmed: true" once PC signs off on the numbers;
     that removes the yellow "placeholder" highlight site-wide.
   ============================================================ */
window.KR = {
  confirmed: true,           // flip to true when rates are final

  contact: {
    email: "events@threadandvinehall.com",
    phone: "(828) 459-6749",  // Google Voice; phone lines hide automatically if blank
    phoneLink: "+18284596749",           // e.g. +17045550100 (digits only, for tap-to-call)
    address: "325 McGill Ave NW, Suite 148, Concord, NC 28027",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=325+McGill+Ave+NW+Suite+148+Concord+NC+28027"
  },

  // Room rates (dollars). Leave a value as null to show "Custom quote".
  loom:     { weekday: 1260, friday: 2100, saturday: 3150 },
  lounge:   { hourly: 90, minHours: 3, halfDay: 315, fullDay: 595 },
  spinning: { hourly: 105, halfDay: 350, fullDay: 630 },
  bobbin:   { hourly: 55,  minHours: 2, halfDay: 195, fullDay: 350 },
  thread:   { hourly: 35,  halfDay: 140, fullDay: 245 },

  packages: { wholeMill: null, workday: 840, celebration: 245 },

  // Concerts. Leave showDeal null to show "Custom quote".
  music:    { showDeal: null },

  // Add-ons and services (same for every renter, never discounted)
  addons:   { furniture: null, cleaning: 250, av: 100, extraHour: 250, overtime: 200, security: 45, coffee: 4, loungeAdd: 300 },

  // Refundable security deposits (public and nonprofit)
  deposits: { loom: 500, other: 150 },

  nonprofitDiscount: 0.5,    // 0.5 = 50% off room rental
  offSeason: "10–15%",       // Nov–Feb and Jul–Aug

  times: {
    saturdayEnd: "11:00 PM",
    fridayEnd: "2:00 AM",
    loadOutBy: "12:00 AM",
    sundayAfter: "1:00 PM",
    depositPct: "50%",
    balanceDays: "30",
    nonprofitReply: "2 business days"
  },

  // Booked dates (YYYY-MM-DD). The "Check a date" box on the site
  // reads this list. Add a date as soon as a deposit comes in.
  booked: [
    // "2027-05-15",
  ],
  // Dates that are held but not yet booked (shows "on hold").
  held: [],

  // Inquiry form. "preview" shows the thank-you but sends nothing.
  // "formsubmit" emails every inquiry to contact.email (works on GitHub Pages;
  //   the very first inquiry sends an activation email to that inbox: click it once).
  // "netlify" posts to Netlify Forms when the site is hosted on Netlify.
  // "google" posts to the Google Apps Script web app in endpoint (emails events@).
  // "mailto" opens the visitor's email app with the details filled in (fallback).
  form: { mode: "mailto", endpoint: "" }
};
