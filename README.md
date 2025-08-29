# LawnStarter Take-Home Exercise

This repository contains my solution for the LawnStarter take-home exercise. The application is a full-stack project designed to interact with the Star Wars API (SWAPI) and provide real-time and historical analytics.

## 🚀 Technologies Used

* **Backend**: **Laravel v12 (PHP)**
    * **Database**: **MySQL**
* **Frontend**: **Next.js (React)**
* **Containerization**: **Docker and Docker Compose**

## ✨ Key Features

### Application Architecture
The project follows a monolithic architecture with a separate frontend and backend that communicate over a Docker network. The frontend, built with Next.js, uses Server-Side Rendering (SSR) to generate the views for each entity (like `People` or `Film`), which improves performance and SEO.

* The frontend communicates with the backend to get data from the Star Wars API.
* The backend acts as a proxy, logging each request and its performance before responding to the frontend.
* Next.js rewrites are used to redirect API requests to my backend without exposing its URL directly. This creates a secure and fluid communication between the two services on the Docker network.

### 📈 Statistics and Analytics
The backend includes a statistics system that fulfills the exercise requirements. A queued job processes the logged events and generates a "snapshot" of the metrics every 5 minutes, which is then saved to the database.

The computed statistics, available via the `/api/v1/stats` endpoint, include:
* **Total number of events.**
* **The top 5 most queried routes (`top_routes`).**
* **Average (`avg_ms`) and p95 (`p95_ms`) latency of requests.**
* **Error rate (`error_rate`)** for requests with a status code of 400 or higher.
* **Request distribution by hour of day (`hourly`),** showing a "heatmap" of usage.

### 💡 Design Decisions
For the statistics system, a database "snapshot" solution was chosen over using a Redis queue. This simplifies the project's architecture and reduces dependencies without sacrificing functionality, as the MySQL database can effectively manage the queue for this use case. This choice prioritizes simplicity and robustness, ensuring the project is easy to set up and deploy.

## ⚙️ How to Run the Project

Make sure you have **Docker** and **Docker Compose** installed on your machine.

1.  **Clone the repository:**
    ```bash
    git clone [repository URL]
    cd swstarter
    ```
2.  **Start the Docker services:**
    ```bash
    docker-compose up --build
    ```

The application will be available at `http://localhost:3000`.

## 🤝 Contact
If you have any questions, feel free to contact me.
