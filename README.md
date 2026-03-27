# Sweet Shop

This project is a sweet shop application designed for users to explore and purchase different types of sweets online. Below are the details of the project structure, features, and setup instructions.

## Frontend Structure
The frontend is built using React.js. The project structure is as follows:

```
/sweet-shop
  /public
  /src
    /components
    /pages
    /assets
    /hooks
    /context
    App.js
    index.js
```

- **public/**: Contains static files and the main HTML template.
- **src/**: Contains all the React components, pages, and assets.
  - **components/**: Reusable components like Navbar, Footer, SweetCard, etc.
  - **pages/**: Different pages of the application, such as Home, Shop, and Checkout.
  - **assets/**: Images, stylesheets, and other assets.
  - **hooks/**: Custom hooks for managing state and side effects.
  - **context/**: React context for global state management.

## Features
- User authentication and account management.
- Browse and search for sweets.
- Add sweets to cart and checkout process.
- User reviews and ratings for each sweet.
- Admin panel to manage sweets and orders.

## Setup Instructions
To set up the project locally, follow the instructions below:
1. **Clone the repository:**
   ```bash
   git clone https://github.com/salamlakhan7/sweet-shop.git
   cd sweet-shop
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm start
   ```
4. **Open your browser:** Visit `http://localhost:3000` to view the application.

## License
This project is licensed under the MIT License.