# AnimeTracker

AnimeTracker is a web application designed to keep track of the anime you've watched and display your top 5 favorite anime. The application allows users to add, remove, and edit anime in a list, as well as add reasoning for why they love each anime.

The platform is built using React and Firebase for storing and retrieving data. Users can see their personal top 5 anime, manage their watched anime list, and write blogs or logs about their favorite anime series.

## Features

- **Top 5 Anime**: Users can list their top 5 anime and provide personal explanations for their rankings.
- **Anime List**: Users can add, remove, and view anime they've watched.
- **Blog**: Write and manage posts about anime-related topics.
- **Firebase Integration**: Data is stored in Firebase Firestore, ensuring persistence of data across sessions.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Firebase (Firestore)
- **Routing**: React Router DOM
- **Hosting**: Firebase Hosting

## Installation

To get started with the project locally, follow these steps:

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/anime-tracker.git
    cd anime-tracker
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create a Firebase project and add your Firebase credentials.

4. Set up Firebase in your React app by following the Firebase setup guide in the `src/firebase.js` file. Add your Firebase SDK configuration.

5. Start the local development server:

    ```bash
    npm start
    ```

6. Open your browser and go to `http://localhost:3000` to see your app in action.

## Deployment

For deploying your app, you can use Firebase Hosting. Here are the steps:

1. Initialize Firebase Hosting in your project directory:

    ```bash
    firebase init hosting
    ```

2. Build the production version of your app:

    ```bash
    npm run build
    ```

3. Deploy your app to Firebase Hosting:

    ```bash
    firebase deploy
    ```

Your app will be available at your Firebase project's hosting URL.

## Future Enhancements

- Add authentication to manage user accounts.
- Include features like anime recommendations based on user preferences.
- Improve UI/UX design for better navigation and readability.
- Expand the blog page to allow for categories or tags.

## Contributing

Contributions are welcome! If you'd like to contribute, feel free to fork the repository, make changes, and create a pull request. Please make sure to follow the coding conventions and provide clear commit messages.

## License

This project is open-source and available under the MIT License.

## Contact

For any questions or feedback, feel free to reach out to [your email or GitHub profile].
