# VitalFit 🏋️‍♂️

VitalFit is a dynamic fitness app designed to streamline class management, bookings, and training schedules. The app offers a robust experience for both trainers and members. Trainers can create classes, while members can explore available classes, book slots, and filter options based on date, class type, and trainer.

## Demo

Check out the live demo: https://vitalfit.netlify.app/

## Features

- **User Authentication**: Secure login for both trainers and members with Firebase Authentication.
- **Class Management**: Trainers can create and delete classes, managing their schedules.
- **Booking System**: Members can view and book available classes, with real-time updates.
- **Responsive Filters**: Filter classes by type, date, and trainer for a personalized experience.
- **Responsive Design**: Smooth UI experience across all screen sizes.
- **Google Calendar** Users can opt to add a booking to their Google Calendar.

## Prerequisites

- Node.js: Version 18.x or 20.x.
- npm versions 9.6.7 and 10.2.3.
- Firebase account

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/ZaidHassan96/vitalfit.git
   cd vitalfit


   ```

2. **Install Dependencies Ensure you have Node.js and npm installed.**

```
npm install


```

## Firebase Setup

1. **Firebase Project**:

   - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.

2. **Authentication**:

   - Enable email/password authentication (or any other provider you wish to use).

3. **Firestore**:

   - Set up Firestore with rules that allow access based on user roles (trainers vs. members).

4. **Replace Firebase Configuration**:

   - Copy your Firebase configuration and replace the configuration in `firebaseConfig.js` with your project's details.

   ```javascript
   // firebaseConfig.js
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
   };
   export default firebaseConfig;
   ```

## Environment Variables

For security, store sensitive information such as API keys in environment variables. Create a `.env` file in the root directory of your project and add your environment variables there. For example:

```
VITE_FIREBASE_API_KEY=YOUR_API_KEY
```

## Connect to local host

```
npm run dev
```
