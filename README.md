TIET Connect
TIET Connect is a student networking prototype built to help students
discover and connect with other students based on shared interests and
location.
Project status: Prototype. Authentication, profile creation,
profile storage, and basic profile recommendations are being developed
with Supabase. AI-based matching has not been implemented yet.

Features
- User sign-up and login using Supabase Authentication.
- Student profile form with a nickname, city, interests, region, and
  short description.
- Profile data stored in Supabase.
- A recommendations page that displays other users' profiles.
- Basic matching based on shared interests and location.
- A separate private profile table intended for information such as
  date of birth.
Tech stack
- HTML
- CSS
- JavaScript (browser-side / Vanilla JavaScript)
- Supabase Authentication
- Supabase Database (PostgreSQL)
- Supabase Row Level Security (RLS)
Project structure
The project has been developed as a collection of static HTML, CSS, and
JavaScript files. The current files discussed during development
include:
TIET-Connect/
├── index.html       # Sign-up page
├── login.html       # Login page
├── auth.js          # Login/authentication logic
├── script.js        # Sign-up logic
├── page1.html       # Profile creation form
├── page1.js         # Reads and saves profile information
├── page2.html       # Recommended profiles page
├── page2.js         # Loads and ranks profiles
├── page3.html       # Intended personal profile page
├── style.css        # Styles
├── style1.css       # Styles
└── style2.css       # Styles
Adjust this list if your local project has different filenames or
additional files. Only include files that actually exist in your GitHub
repository.
How the prototype works
1. A user creates an account or logs in through Supabase
   Authentication.
2. The user completes the profile form.
3. The browser-side JavaScript gets the currently authenticated user's
   ID.
4. The profile is saved in the profiles table. The user's ID is used
   to associate the profile with that account.
5. Private information, such as date of birth, is saved separately in
   private_profiles.
6. The recommendations page fetches profiles and compares them with the
   current user's profile.
7. The current matching logic is basic rule-based matching. It is not
   an AI model.
Supabase setup
Create a Supabase project and configure the database tables to match the
columns used by your JavaScript.
Tables
The prototype currently expects these tables:

profiles
  Column                              Purpose
  id                                User ID from Supabase
Authentication; should be the
table's primary key and reference
auth.users.id

  nickname                          Public display name

  city                              User's city

  interests                         Selected interests; the frontend
currently treats this as an array

  region                            Selected region
description                       Short user-written description
private_profiles
  Column                              Purpose
  id                                User ID from Supabase
Authentication; should be the
primary key and reference
auth.users.id
date_of_birth                     Private date-of-birth information
The database column names and data types must match the actual project
schema and JavaScript. For example, the interests column should use a
PostgreSQL type compatible with the array being sent by the frontend
(commonly text[]).
Row Level Security (RLS)
Enable RLS on both tables and create policies that restrict users to the
data they are allowed to access.

At minimum, policies should ensure: - A signed-in user can insert or
update only the row whose id matches auth.uid(). - Users can read
only their own row in private_profiles. - Public profile visibility is
intentional. If the recommendations page is meant to show other
students, the profiles SELECT policy must permit authenticated users
to read the public profile fields. - Private information must never be
exposed through the public profiles table or a broad SELECT policy.

Review and test the policies in Supabase before using real personal
information. RLS policies are part of the application's security, not
just a database setting.
Configure Supabase in the JavaScript files
The frontend needs the Supabase project URL and a publishable key.
Use the same project URL and publishable key wherever the Supabase
client is initialized.

For the browser-based Supabase JavaScript CDN setup, load the library
before your own JavaScript:
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="page1.js"></script>
Example client initialization:
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_KEY = "YOUR_SUPABASE_PUBLISHABLE_KEY";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
Replace the placeholders with your project's values. Never put a
Supabase service_role key, secret key, or database password in
frontend code. Those credentials must remain private on a trusted
server.

For a public GitHub repository, do not commit real project credentials
if you want to keep them out of the repository. Put the configuration in
a separate local file that is excluded from Git, or use an appropriate
deployment-time configuration approach. A publishable key is designed
for client-side use, but it is still good practice not to publish
project-specific configuration unnecessarily. RLS must protect the
database regardless.
Run locally
1. Install Visual Studio Code if you
   do not already use it.
2. Clone or download this repository.
3. Open the project folder in VS Code.
4. Configure the Supabase project URL and publishable key in the
   appropriate JavaScript configuration.
5. Run the site using the VS Code Live Server extension, or another
   local static web server.
6. Open the sign-up page in your browser and test registration, login,
   profile creation, and recommendations.
Authentication redirect URLs and allowed site URLs may also need to be
configured in your Supabase project's Authentication URL settings for
the environment where the app is running.
Current limitations and planned improvements
- AI-based semantic matching of profile descriptions is not
  implemented yet.
- The current recommendation system uses basic matching rules, such as
  shared interests and location.
- The personal profile page and profile-editing experience may still
  need completion.
- The interface is an early prototype and needs further styling and
  responsive design.
- Before production use, review authentication flows, RLS policies,
  input validation, privacy controls, and error handling.
Roadmap
- [ ] Finish and test the personal profile page.
- [ ] Improve profile recommendation scoring.
- [ ] Add AI-based semantic matching for user descriptions.
- [ ] Add profile editing.
- [ ] Improve responsive styling and accessibility.
- [ ] Review database security and privacy before production
  deployment.
Important security note
This is a learning prototype, not a production-ready social network. Do
not store sensitive personal information until the database schema, RLS
policies, authentication settings, and privacy behavior have been
carefully reviewed and tested.
Author
Created as a student project to explore web development, authentication,
databases, and profile-matching systems.
