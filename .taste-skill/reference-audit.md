# Foldfolio reference and verification

Reference: https://foldfolio.framer.website/ (Home), /work, /about and /contact. Audited in a real browser, including computed font styles, icon SVGs and the screen-motion stylesheet. The three user-provided screenshots in public/tmp are retained unchanged.

## Final direction

The name as a monument, initial seed 2057607997. The first dark text-heavy version was rejected by the user. The replacement follows the supplied portrait-led, light device screens. A type redraw initially returned Hanken Grotesk; the user's subsequent instruction to study the live site superseded that slot. The final type system is taken from the live reference, not the random deal.

- Sofia Sans Extra Condensed 900: name, clock, section/project headings and contact identity.
- Geist 400/500: paragraphs, controls, notification titles, navigation and links.
- Geist Mono 500: short metadata, as requested by the live reference; this is an explicit exception to the generic skill's no-monospace rule.
- Fonts are hosted locally with OFL licenses. No font service is needed at runtime.
- Original screen image hover: 1.06 scale, .9s, cubic-bezier(.16,1,.3,1). Local hover follows these values; controls lift only in response to pointer interaction.
- Heading wrappers use the existing device reveal engine. Reduced motion disables hidden reveal classes, leaving all screen text readable.
- No idle float: user explicitly requested that text remain still when the visitor is not scrolling. Confirmed zero X/Y drift over repeated browser samples on both cover and open headline.
- All visible clocks use the same live Asia/Ho_Chi_Minh value. The reference's fixed clock was intentionally replaced.

The full hardware/Glow, compact OS notification surfaces and device navigation retain the original interface conventions requested by the user. Generic landing-page bans on hardware gradients, shadows and pill controls are not used to remove these features.

## Content and imagery

The 4 projects, 2 roles, story/principles, 3 honor groups, 4 result statistics and links were migrated in Vietnamese and English from the old local repository. The old repository remains clean. No sample award portraits or Vite artwork were migrated.

The portrait is a temporary sample from the screenshot supplied by the user; it is not a picture of the owner. Portrait.tsx frames the portrait area via SVG, omitting the reference screen's navigation/status chrome. Change data/portrait.ts to replace it across all screens. All other raster imagery is the user's existing project/company material. No external stock images or footage were added.

## Checks

- Build passes; 5 Node tests cover navigation scaling/clamping, bilingual dataset completeness, local assets and Vietnam-time date boundaries.
- Browser matrix passes at 320×740, 390×844, 768×1024, 1024×768, 1366×768 and 1440×900, plus open mode on tablet/laptop and reduced-motion behavior.
- Checked: header controls do not overlap, screen/cover/contact do not overflow, title stays within two lines, notification navigation, email link, synchronized project panels and language persistence.
- Confirmed live displayed Vietnam time agrees with Intl.DateTimeFormat on the browser clock.
- Lint has 34 pre-existing engine warnings, no errors and no new warnings.

## Screenshot critique

ROUND 1 — Rejected dark version
Seen in one second: a black text panel.
Idea: a portfolio in a phone, without enough portrait/typographic identity.
Problems: stock system font, no portrait focal point, notifications too heavy. Replaced the composition from the user's screenshots.

ROUND 2 — Light portrait composition
Seen in one second: the portrait and large name inside the foldable display.
Live thing: notifications open actual portfolio sections; projects expand in place.
Layout: hero=portrait split / story=statement and principles / experience=rows / work=image list / results=figure lines / contact=inverted close.
The design is materially closer to the user's reference. Remaining limit: sample portrait quality is bounded by the supplied screenshot; the user's own high-resolution image should replace it. Device-surface text is necessarily smaller than a normal full-page website.

The generic inspector initially reported 4 failures, including false positives from intentional hidden screen copies, closed-cover state and preserved hardware. With those explicit device exceptions recorded, the later run reported 0 failures and 7 warnings. After the live-site audit the fonts/motion were updated again and checked with the responsive/browser matrix; do not describe that earlier inspector output as a new final font audit.
