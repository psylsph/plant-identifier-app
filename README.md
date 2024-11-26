# Plant Identifier App

A web application that helps users identify plants through image recognition technology. Simply upload a photo of a plant, and the app will provide detailed information about the plant species.

## Features

- Upload plant images from your device
- Real-time plant identification using Plant.id API
- Detailed plant information including:
  - Scientific name
  - Common names
  - Plant description
  - Taxonomy
  - Confidence score

## Technologies Used

- React.js
- Node.js
- Plant.id API
- Netlify Functions
- Axios for API requests
- React Router for navigation

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd plant-identifier-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Plant.id API key:
```
PLANT_ID_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm start
```

## Deployment

The app is configured for deployment on Netlify:

1. Push your changes to GitHub
2. Connect your GitHub repository to Netlify
3. Configure the environment variable `PLANT_ID_API_KEY` in Netlify's dashboard
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
