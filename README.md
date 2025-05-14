# Lifestein Quote Tool

This is a quote tool for insurance quotes powered by CompuLife API.

## Development

To run the application locally:

```bash
# Install dependencies
npm install

# Run both the backend server and frontend development server
npm run start:all
```

## Deployment with Docker

This application can be deployed using Docker. The Dockerfile is configured to build the frontend and serve it from the backend.

### Building the Docker Image

```bash
docker build -t lifestein-quote-tool .
```

### Running the Docker Container

```bash
docker run -p 5000:5000 \
  -e COMPULIFE_DOMAIN=compulifeapi.com \
  -e COMPULIFE_AUTH_ID=your_auth_id \
  -e REMOTE_IP=your_remote_ip \
  lifestein-quote-tool
```

## Deployment on Render

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Create a new Web Service on Render
3. Connect your repository
4. Select "Docker" as the environment
5. Configure environment variables:
   - `PORT`: 5000 (or let Render assign it)
   - `COMPULIFE_DOMAIN`: compulifeapi.com
   - `COMPULIFE_AUTH_ID`: Your CompuLife Auth ID
   - `REMOTE_IP`: Your Remote IP
   - `FRONTEND_URL`: The URL of your deployed application (for CORS)
6. Deploy!

## Tech Stack

This project uses:

- **Frontend**: React with Vite for fast development
- **Styling**: TailwindCSS for utility-first CSS
- **Backend**: Express.js for the API server
- **API Integration**: Node-fetch for CompuLife API requests

## React + Vite

This project was built with React and Vite, providing a minimal setup with HMR and ESLint rules.

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
