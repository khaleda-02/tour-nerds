# **tour-nerds**

### Description

**Tour-Nerds** is the backend of a full-stack tourism application. It provides an API for managing and booking tours. The application is built using **Express.js** for the server-side logic, **MongoDB** for the database, and **Mongoose** for object data modeling (ODM). The backend handles data related to tours, including details such as duration, difficulty, and user bookings.

### Modules

- **User Module**: User has a profile contain his data (username,email,name,and his role), user can update his data .
- **Auth Module**: authentication system: signup, signin, forgot password, update password (reset password by sending emails to users with reset token) .
- **Tour Module**: Admins able to CRUD tours, and user can reads tours and filter it based on his needs like: price, rating, destination.
- **Review Module**: User can give his review on a tour, and update, delete his reviews.

### Features

- **Tours Management**: Admins can Create, read, update, and delete tours, while users can read, book& review tours.
- **Image Uploading & Email Sending Services**: User can upload his Image, Admin upload tours Images when creating tour.
- **User Authentication**: User registration, login, and authentication.
- **Booking System**: Users can book tours, view their bookings, and cancel them.
- **Data Validation**: Input data is validated to ensure the integrity and consistency of information.
- **API Security**: Protection against common security threats such as NOSQL injection and cross-site scripting (XSS).

### Technologies Used

- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing tour and user data.
- **Mongoose**: ODM for MongoDB, providing schema validation and query building.
- **JWT**: For user authentication and session management.
- **bcrypt**: For hashing user passwords.
- **dotenv**: For environment variable management.
- **multer**: For environment variable management.

### Getting Started

#### Prerequisites

- **Node.js**: Ensure you have Node.js installed. [Download Node.js](https://nodejs.org/)
- **MongoDB**: You should have MongoDB installed and running. [Download MongoDB](https://www.mongodb.com/try/download/community)

#### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/khaleda-02/tour-nerds
   cd tour-nerds
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment variables**:

- Create a .env file in the root of the project.
- Add the following variables (replace the values with your own):
  ```bash
  DATA_BASE_STR=mongodb://localhost:27017/db-name
  NODE_ENV=development
  PORT=3000
  JWT_SECRET =jwt_secret
  JWT_EXPIRES_IN=1d
  EMAIL_USERNAME=
  EMAIL_PASSWORD=
  EMAIL_HOST=
  EMAIL_PORT=
  ```

2. **Run the application**:
   ```bash
   npm start
   The server should be running on http://localhost:3000.
   ```

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### License

This project is licensed under the MIT License.
