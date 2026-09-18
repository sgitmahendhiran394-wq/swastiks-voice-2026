# Swastiks Voice

Swastiks Engineers’ Day 2026 — Employee Feedback App

Build a premium, modern, interactive employee feedback web application for Swastiks Engineers’ Day 2026.

This is a one-time internal company feedback application, not a generic Google Form.

The experience should feel like a polished corporate event application with smooth animations, attractive visuals, excellent spacing, and a professional engineering/company identity.

1. COLOR THEME

Use a premium corporate color palette:

Primary — Navy Blue

Deep Navy: #071A3D

Navy Blue: #0B2A5B

Electric Blue Accent: #1769E0

Use navy for:

Main background

Navigation

Primary sections

Buttons

Cards

Headers

Secondary — Red

Corporate Red: #C62828

Bright Red Accent: #E53935

Use red carefully for:

Important highlights

Selected states

Progress accents

Small decorative elements

Error states

Do NOT make the entire interface red.

Gold

Gold: #D4AF37

Light Gold: #F4D77A

Use gold for:

Engineers’ Day highlights

Premium borders

Icons

Achievement elements

Selected rating highlights

Celebration effects

White

Pure White: #FFFFFF

Soft White: #F8FAFC

Use white for:

Text

Cards

Content areas

Question sections

Contrast against navy

Green

Success Green: #16A34A

Light Green: #22C55E

Use green only for:

Completed questions

Success states

Submission confirmation

Positive feedback indicators

Completion progress

Supporting colors

Dark background: #020817

Light gray: #E5E7EB

Medium gray: #64748B

2. VISUAL STYLE

Create a premium engineering-event aesthetic.

Style direction:

Corporate

Modern

Elegant

Energetic

Engineering-inspired

Slightly futuristic

Professional but fun

Clean and spacious

Use:

Glassmorphism

Soft shadows

Subtle gradients

Thin glowing borders

Rounded cards

Floating particles

Engineering/circuit patterns

Small geometric elements

Subtle animated lines

Soft background glow

Avoid:

Excessive neon

Excessive gradients

Cartoon-style UI

Too many colors

Cheap-looking effects

Generic Google Forms appearance

3. BRAND COLOR BALANCE

Follow approximately this visual balance:

60% Navy / Dark Blue

25% White / Light Background

7% Gold

5% Red

3% Green

Gold, red and green should be accent colors rather than dominant colors.

4. APPLICATION FLOW

The application should follow:

Company Identity
↓
Welcome Screen
↓
Start Feedback
↓
Question 1
↓
Question 2
↓
Question 3
↓
...
↓
Question 10
↓
Review Answers
↓
Submit Feedback
↓
Thank You Screen

5. AUTHENTICATION

Do NOT create:

Username form

Password form

Registration form

Employee ID manual entry

Name manual entry

Email manual entry

The application should use the employee's existing company identity.

Preferred:

Google Workspace OAuth

If the company uses Microsoft 365, support:

Microsoft Entra ID

After authentication retrieve:

Employee name

Employee email

Employee ID if available

Department if available

Important:

A normal website cannot directly read the email/account of an already-open Chrome profile.

Therefore implement proper company OAuth authentication.

The employee should experience this as:

Continue with Company Account

rather than a traditional login page.

6. WELCOME SCREEN

Create a premium full-screen welcome experience.

Display:

SWASTIKS

ENGINEERS' DAY 2026

Your Experience. Your Voice. Your Ideas.

Then:

Hi, [First Name] 👋

Small message:

"Help us make our next celebration even better."

Primary button:

START FEEDBACK →

Button styling:

Navy background

Gold hover glow

White text

Smooth scale animation

Add subtle red and gold decorative elements.

7. LION + PARROT IMAGES

I will provide two image assets:

Lion image

Parrot image

Use the exact supplied images.

Do NOT replace them with generated illustrations.

Do NOT distort them.

Use them as subtle visual characters throughout the application.

Lion

Represent:

Leadership

Strength

Confidence

Engineering excellence

Possible placement:

Welcome screen

Background floating element

Side illustration

Transition animation

Parrot

Represent:

Communication

Employee voice

Ideas

Feedback

Possible placement:

Question screens

Feedback/suggestion section

Thank-you screen

Use:

Subtle floating animation

Slow parallax

Fade/slide transitions

Small movement

Do not make the images distract from the questions.

8. QUESTION EXPERIENCE

Display only ONE question at a time.

At the top:

QUESTION 1 / 10

Progress:

● ○ ○ ○ ○ ○ ○ ○ ○ ○

Also show:

10% Complete

For example:

Question 4:

QUESTION 4 / 10

● ● ● ● ○ ○ ○ ○ ○ ○

40% Complete

Use a smooth animated progress bar.

9. QUESTION NAVIGATION

Buttons:

← BACK

NEXT →

Rules:

Next must remain disabled until the current question is answered.

Once answered, Next becomes active.

Animate the transition between questions.

Preserve answers when going backward.

Do not allow skipping questions.

Use Framer Motion transitions.

Example:

Question exits toward left.

Next question enters from right.

Back navigation should reverse the animation.

10. QUESTIONS

Q1

How would you rate your overall Engineers’ Day experience?

Rating:

1 2 3 4 5

Labels:

1 — Poor

2 — Fair

3 — Good

4 — Very Good

5 — Excellent

Q2

How engaging and energetic did you find the celebration?

Rating:

1 2 3 4 5

Q3

How enjoyable were the games and activities?

Rating:

1 2 3 4 5

Q4

How well did the event encourage interaction between employees and teams?

Rating:

1 2 3 4 5

Q5

How well did the event reflect the spirit of engineering and innovation?

Rating:

1 2 3 4 5

Q6

How would you rate the overall organization and coordination of the event?

Rating:

1 2 3 4 5

Q7

How would you rate the creativity and uniqueness of the activities?

Rating:

1 2 3 4 5

Q8

Would you like to participate in similar employee activities in the future?

Use:

1 — Definitely Not

2 — Probably Not

3 — Maybe

4 — Probably Yes

5 — Definitely Yes

Q9

Which part of Engineers’ Day did you enjoy the most, and why?

Large textarea.

Placeholder:

Tell us about your favourite moment...

Show character count.

Example:

0 / 500

Q10

If you could improve one thing or add something to our next celebration, what would it be?

Large textarea.

Placeholder:

Your idea could become our next activity...

Show character count.

Example:

0 / 500

11. RATING UI

Do NOT use boring HTML radio buttons.

Create large interactive rating cards.

Example:

┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │
│ Poor│ │ Fair│ │ Good│ │Very │ │Excel│
│ │ │ │ │ │ │Good │ │lent │
└─────┘ └─────┘ └─────┘ └─────┘ └─────┘

When selected:

Gold border

Gold glow

Navy background

White text

On hover:

Slight scale

Soft gold glow

After selecting:

Small check animation

Green completion indicator

12. REVIEW SCREEN

Before submission show:

REVIEW YOUR FEEDBACK

Display all 10 answers.

Example:

Q1

Overall Experience

★★★★★

Q2

Engagement

★★★★☆

Q9

Favourite Moment

"Team games were very enjoyable..."

Q10

Improvement

"Add more outdoor activities..."

Allow:

← Edit Answers

and:

SUBMIT FEEDBACK ✓

13. SUBMIT SCREEN

When submitting:

Show an elegant loading animation.

Text:

Submitting your feedback...

Then save the response to Supabase.

After successful submission:

Show:

THANK YOU! 🎉

Hi, [First Name]

Your feedback has been recorded successfully.

Every idea helps us engineer a better experience.

Use:

Gold celebration particles

Green success animation

Lion + Parrot subtle animation

Engineering-inspired background

Do not automatically redirect immediately.

Allow the user to stay on the thank-you screen.

14. DUPLICATE SUBMISSION PROTECTION

This is a one-time event.

An employee can submit only once.

Use:

employee_email + event_id

as the unique identity combination.

If the employee has already submitted:

Show:

Feedback Already Submitted

"Thank you! Your Engineers' Day feedback has already been recorded."

Do not allow another submission.

15. LOCAL PROGRESS

If the employee refreshes the browser before submitting:

Preserve their current answers locally.

After successful submission:

Clear local temporary answers.

Important:

LocalStorage is NOT the permanent database.

Supabase is the source of truth.

16. DATABASE

Use Supabase PostgreSQL.

Create:

events

Fields:

id

event_name

event_year

active

created_at

Example:

Engineers' Day 2026

feedback

Fields:

id

event_id

employee_id

employee_name

employee_email

department

q1

q2

q3

q4

q5

q6

q7

q8

q9

q10

submitted_at

Do not store unnecessary calculated statistics in the database.

Calculate averages and distributions dynamically.

17. SECURITY

Use Supabase Row Level Security.

Never expose:

Supabase service role key

OAuth client secrets

Admin credentials

Employees should only be able to submit their own feedback.

Admin dashboard must be separately protected.

18. ADMIN DASHBOARD

Create:

/admin

Premium dashboard matching the same Swastiks color system.

Navigation:

Overview

Live Feedback

Question Analytics

Suggestions

Export

19. ADMIN OVERVIEW

Display KPI cards:

Total Responses

108

Response Rate

90%

Overall Average

4.52 / 5

Suggestions Received

108

Use subtle:

Navy

Gold

Red

Green

accent indicators.

20. ANALYTICS

Create charts using Recharts.

Charts:

Overall Rating Distribution

1–5 rating counts.

Question-wise Average

Q1–Q8.

Department Summary

Responses and average rating.

Rating Distribution

5 / 4 / 3 / 2 / 1.

Charts should be clean and professional.

21. LIVE FEEDBACK

Display recent submissions.

Columns:

Employee

Department

Overall Rating

Submitted Time

Suggestion

Action

Action:

VIEW

Open a modal/drawer showing the complete response.

22. SEARCH & FILTER

Admin should be able to:

Search employee

Search employee ID

Search email

Filter department

Filter rating

Filter date

Sort newest

Sort oldest

23. SUGGESTIONS PAGE

Show:

Favourite Moments

Q9 responses.

Improvement Ideas

Q10 responses.

Use readable cards rather than a dense table.

24. EXPORT SYSTEM

Create three export options.

Excel

Button:

📊 Download Excel

Filename:

Swastiks_Engineers_Day_2026_Feedback.xlsx

The Excel workbook must be professionally formatted.

Sheets:

Sheet 1 — Feedback Responses

Columns:

S.No

Employee ID

Employee Name

Department

Email

Q1 Overall

Q2 Engagement

Q3 Games

Q4 Interaction

Q5 Engineering Spirit

Q6 Organization

Q7 Creativity

Q8 Future Activities

Favourite Moment

Improvement Suggestion

Submitted At

Format:

Company title

Engineers' Day 2026 title

Professional header

Freeze panes

Filters

Proper column widths

Wrapped text

Alternating rows

Correct date/time formatting

Sheet 2 — Dashboard Summary

Include:

Total Employees

Total Responses

Response Rate

Overall Average Rating

Suggestions Received

Question-wise summary:

Question

Average

5 Star Count

4 Star Count

3 Star Count

2 Star Count

1 Star Count

Responses

Include professional charts.

Sheet 3 — Rating Distribution

Rows:

5

4

3

2

1

Columns:

Q1–Q8

Sheet 4 — Suggestions

Columns:

S.No

Employee ID

Department

Favourite Moment

Improvement Suggestion

Submitted At

Use wrapped text and wide columns.

Sheet 5 — Department Summary

Columns:

Department

Responses

Response %

Avg Q1

Avg Q2

Avg Q3

Avg Q4

Avg Q5

Avg Q6

Avg Q7

Avg Q8

Overall Average

25. CSV EXPORT

Button:

📄 Download CSV

Filename:

Swastiks_Engineers_Day_2026_Feedback.csv

CSV should contain one row per employee.

Columns:

S.No

Employee ID

Employee Name

Department

Email

Q1

Q2

Q3

Q4

Q5

Q6

Q7

Q8

Q9

Q10

Submitted At

CSV should remain clean raw data without decorative formatting.

26. PDF EXPORT

Button:

📑 Download Summary PDF

Filename:

Swastiks_Engineers_Day_2026_Summary.pdf

Create a professional management report containing:

Page 1

Engineers' Day 2026

Employee Feedback Summary

Total Responses

Response Rate

Overall Average

Page 2

Rating Analysis

Page 3

Question Analysis

Page 4

Department Analysis

Page 5

Employee Voice / Suggestions

Use company branding and the navy/red/gold/white color palette.

27. ADMIN EXPORT UI

Create a premium export section:

┌──────────────────────────────────────┐
│ EXPORT FEEDBACK REPORT │
│ │
│ 📊 Download Excel │
│ Complete formatted workbook │
│ │
│ 📄 Download CSV │
│ Raw data for analysis │
│ │
│ 📑 Download Summary PDF │
│ Management-ready report │
└──────────────────────────────────────┘

28. RESPONSIVE DESIGN

The application must work perfectly on:

Desktop

Laptop

Tablet

Mobile

The question cards should be touch-friendly.

Do not make users zoom.

29. ANIMATIONS

Use Framer Motion.

Animations should include:

Page transitions

Question transitions

Button hover

Rating selection

Progress animation

Floating lion

Floating parrot

Background particles

Success animation

Gold celebration effect

Respect:

prefers-reduced-motion

If enabled, reduce or disable decorative animations.

30. ERROR HANDLING

Create proper states:

Loading

"Loading your feedback experience..."

Submission error

"Something went wrong while submitting your feedback."

Button:

TRY AGAIN

Do not lose the entered answers.

Authentication error

"Unable to verify your company account."

Button:

TRY AGAIN

31. EMPTY STATES

Admin dashboard should have a proper empty state:

No feedback received yet

"Responses will appear here after employees submit their feedback."

32. ONE-TIME DATA LIFECYCLE

This is NOT intended to be a permanent employee-feedback platform.

During Engineers' Day:

Employee → Supabase → Admin Dashboard

After the event:

Supabase → Excel Backup

Supabase → CSV Backup

Supabase → Optional PDF Summary

The company can retain the exported Excel/CSV/PDF as the final event record.

The Supabase feedback data can later be archived or deleted after the company confirms the backup.

Do not build unnecessary permanent infrastructure.

33. TECH STACK

Use:

Next.js

TypeScript

Tailwind CSS

Framer Motion

Supabase

Recharts

ExcelJS or a suitable XLSX library

CSV export

PDF generation

Vercel deployment

Keep the code clean and component-based.

Suggested components:

WelcomeScreen

ProgressHeader

QuestionCard

RatingSelector

TextQuestion

NavigationButtons

ReviewScreen

SuccessScreen

AdminDashboard

AnalyticsCards

RatingCharts

FeedbackTable

FeedbackModal

SuggestionsPanel

ExportPanel

34. IMPORTANT DESIGN RULE

The application should NOT look like:

Google Forms

Microsoft Forms

A generic admin template

It should look like a custom Swastiks Engineers' Day 2026 digital experience.

The first impression should be:

Premium + Corporate + Engineering + Celebration

Use Navy as the dominant identity.

Use Gold for premium/celebration.

Use Red for energy/highlights.

Use Green for success/completion.

Use White for clarity.

35. FINAL QUALITY CHECK

Before considering the application complete, verify:

✓ Company authentication works

✓ Employee identity is automatically obtained

✓ No manual employee information form

✓ 10 questions work sequentially

✓ Next disabled until answered

✓ Back works correctly

✓ Answers are preserved

✓ Progress indicator works

✓ Refresh does not lose unfinished answers

✓ Review page works

✓ Submission works

✓ Duplicate submission blocked

✓ Supabase RLS enabled

✓ Admin dashboard protected

✓ Charts display correctly

✓ Search/filter works

✓ Excel export works

✓ Excel workbook has all required sheets

✓ CSV export works

✓ PDF summary works

✓ Lion image works

✓ Parrot image works

✓ Animations are smooth

✓ Mobile responsive

✓ Error states work

✓ Loading states work

✓ No secrets exposed in frontend

✓ Vercel deployment ready

Build this as a production-quality internal event application, not a prototype.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/db40bf49-0d44-42b8-a7cf-b7fcb3fcc68e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
