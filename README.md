# SaaS Budget Application

This is a full-stack application for managing budgets, built with a React frontend, Node.js/Express backend, and PostgreSQL database, all containerized with Docker.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Docker Desktop (or Docker Engine and Docker Compose) installed on your system.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd saas-budget
    ```

2.  **Create a `.env` file:**
    Copy the `.env.example` (if available, otherwise create it manually) from the `server` directory to the root of the `saas-budget` directory and populate it with your environment variables. A basic `.env` file might look like this:

    ```
    DB_USER=your_db_user
    DB_HOST=db
    DB_DATABASE=your_db_name
    DB_PASSWORD=your_db_password
    DB_PORT=5432
    JWT_SECRET=your_jwt_secret
    SERVER_PORT=5000
    CLIENT_PORT=80
    ADMIN_USERNAME=admin
    ADMIN_PASSWORD=password
    ```
    *   `SERVER_PORT`: The external port for the backend API (default: 5000).
    *   `CLIENT_PORT`: The external port for the frontend application (default: 80).

### Running the Application

To start the application, navigate to the root of the `saas-budget` directory (where `docker-compose.yml` is located) and run:

```bash
docker-compose up --build
```

This command will:
*   Build the Docker images for the client and server.
*   Start the PostgreSQL database container.
*   Start the backend server container, accessible on `http://localhost:5000` (or your specified `SERVER_PORT`).
*   Start the frontend client container, accessible on `http://localhost` (or your specified `CLIENT_PORT`).

### Volume Mappings

The `docker-compose.yml` is configured with volume mappings to persist data and allow for live code changes during development:

*   **Database Data:**
    -   `pgdata:/var/lib/postgresql/data`
    This volume persists your PostgreSQL database data, so it's not lost when containers are stopped or removed.

*   **Server Code:**
    -   `./server:/usr/src/app`
    This maps your local `server` directory to the `/usr/src/app` directory inside the server container. Any changes you make to your local server code will be reflected instantly in the running container (you might need to restart the server process inside the container for changes to take effect, depending on your server's setup).

*   **Client Code:**
    -   `./client:/usr/src/app`
    This maps your local `client` directory to the `/usr/src/app` directory inside the client container. This is useful for development, allowing you to see changes to your frontend code without rebuilding the Docker image.

### Port Mappings

*   **Server:**
    -   `${SERVER_PORT:-5000}:5000`
    This maps port `5000` inside the server container to port `5000` on your host machine by default. You can change the host port by setting the `SERVER_PORT` environment variable in your `.env` file (e.g., `SERVER_PORT=6000` would map `6000:5000`).

*   **Client:**
    -   `${CLIENT_PORT:-80}:80`
    This maps port `80` inside the client container to port `80` on your host machine by default. You can change the host port by setting the `CLIENT_PORT` environment variable in your `.env` file (e.g., `CLIENT_PORT=3000` would map `3000:80`).

## Stopping the Application

To stop the application and remove the containers, run:

```bash
docker-compose down
```

To stop the application and remove containers, volumes, and networks, run:

```bash
docker-compose down -v
```
