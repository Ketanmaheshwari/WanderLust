# 🌍 Wanderlust - Travel Destination Listing Platform

A full-stack web application that enables users to explore, list, and manage travel destinations.  
Built with **Node.js**, **Express.js**, **MongoDB**, and **EJS** for dynamic server-side rendering.

---

## 🚀 Features

### For Travelers
- 🌍 **Destination Discovery:** Browse and search through a variety of travel listings  
- 🗺️ **Detailed Location Info:** View descriptions, prices, and images  
- 📸 **Image Gallery:** Beautiful visuals to inspire your next trip  
- 💬 **Reviews & Ratings:** Share your travel experiences and read others’ feedback  
- 📱 **Responsive Design:** Optimized for mobile, tablet, and desktop  

### For Listing Owners
- 📝 **Add New Listings:** Easily create and publish your travel destinations  
- ✏️ **Edit & Update:** Manage descriptions, images, and prices anytime  
- 🗑️ **Delete Listings:** Remove outdated or unavailable destinations  
- 📊 **View Feedback:** Read reviews and ratings from travelers  

### Technical Features
- 🔐 **Secure Authentication:** Sign up, log in, and manage your account  
- 🖼️ **Cloud Image Storage:** Upload images using Cloudinary  
- 🗂️ **Server-Side Rendering:** EJS templates for dynamic content generation  
- 📡 **RESTful API Architecture:** Organized routes and controllers  
- 🌐 **Deployed Online:** Ready for public access  

---

## 🛠️ Tech Stack

### Backend
- Node.js with Express.js for server logic  
- MongoDB with Mongoose for database management  
- Passport.js for authentication  
- Cloudinary + Multer for image uploads  
- Express-Session for persistent logins  

### Frontend
- EJS for templating  
- Bootstrap for responsive design  
- JavaScript for interactive UI elements  

### Development Tools
- Nodemon for auto-restarting server during development  
- dotenv for environment configuration  
- ESLint for code consistency  

---

## 📦 Installation & Setup

### **Prerequisites**
- Node.js (v16 or higher)  
- MongoDB (local or Atlas)  
- Git  
- npm package manager  

**1. Clone the Repository**
```bash
git clone <repository-url>
cd wanderlust
2. Install Dependencies

bash
Copy
Edit
npm install
3. Environment Configuration
Create a .env file in the project root:

env
Copy
Edit
PORT=3000
MONGODB_URI=mongodb://localhost:27017/wanderlust
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SESSION_SECRET=your_session_secret
4. Run the App

bash
Copy
Edit
npm run dev
Visit: http://localhost:3000

📚 API Endpoints
Listings
GET /listings – View all listings

GET /listings/:id – View a single listing

POST /listings – Create a new listing (authenticated users)

PUT /listings/:id – Edit a listing (authenticated users)

DELETE /listings/:id – Delete a listing (authenticated users)

Reviews
POST /listings/:id/reviews – Add a review (authenticated users)

DELETE /listings/:id/reviews/:reviewId – Delete a review (authenticated users)

Auth
GET /register – Registration page

POST /register – Create new account

GET /login – Login page

POST /login – Authenticate user

GET /logout – Logout user

📁 Project Structure
bash
Copy
Edit
wanderlust/
├── models/             # Mongoose schemas
│   ├── listing.js
│   └── review.js
├── routes/             # Express routes
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
├── views/              # EJS templates
│   ├── listings/
│   ├── reviews/
│   └── users/
├── public/             # Static assets (CSS, JS, images)
├── middleware/         # Custom middleware
├── utils/              # Helper functions
├── app.js              # Main application file
└── package.json
🎯 Features in Detail
Destination Listings
Add title, description, price, location, and images

Automatically store and serve images from Cloudinary

Filter listings by location or price range

Reviews & Ratings
Authenticated users can post reviews

Owners cannot review their own listings

Reviews show author name, date, and rating

Authentication & Security
Passwords hashed with bcrypt

Session-based authentication using Passport.js

Flash messages for login/register errors

🚀 Deployment
Backend
Deployable on Render, Railway, or Heroku

Use MongoDB Atlas for production database

Frontend
EJS templates are served from the backend server

🤝 Contributing
We welcome contributions:

Fork the repo

Create a new branch:

bash
Copy
Edit
git checkout -b feature-name
Commit changes:

bash
Copy
Edit
git commit -m "Add feature"
Push branch:

bash
Copy
Edit
git push origin feature-name
Open a Pull Request

📝 License
This project is licensed under the MIT License.

📊 Project Status
✅ Core listing features complete
✅ Authentication implemented
✅ Reviews system working
🔄 Advanced search filters – Planned
🔄 Map integration – Planned

Wanderlust – Making travel planning simpler, smarter, and more inspiring ✈️🏞️🌏
