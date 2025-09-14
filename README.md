# MoviX Web Application

## Overview
MoviX is a modern web application for browsing movies and TV series. It provides users with a seamless experience to discover, search, and keep track of their favorite shows.

## Features
- **Browse Movies and TV Series**: Explore a vast collection of movies and TV series
- **Search Functionality**: Find specific content using the search feature
- **Genre Filtering**: Browse content by specific genres
- **User Accounts**: Create an account to save preferences
- **Favorites List**: Keep track of your favorite shows
- **Watch Later**: Save shows to watch later
- **Responsive Design**: Enjoy the application on any device

## Technologies Used
- React.js for the frontend
- Vite as the build tool
- Bootstrap for styling
- Axios for API requests
- Context API for state management
- Supabase for storage

## Future Improvements
This project is continuously evolving, enhancing the user experience and adding new features regularly.

Welcoming contributions and suggestions for new features!

## Installation

```bash
# Clone the repository
git clone https://github.com/abdelrhman-sys/MoviX-Web.git

# Navigate to the project directory
cd MoviX-Web

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Environment Variables
Create a `.env` file in the root directory with the following variables:

```
VITE_API_ACCESS_TOKEN=your_tmdb_api_token
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
```

## API Integration
This application uses The Movie Database (TMDB) API for fetching movie and TV series data. You'll need to obtain an API key from [TMDB](https://www.themoviedb.org/documentation/api).