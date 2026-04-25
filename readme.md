# Aggregates Business Management (ABM)

A web-based management system for small aggregate construction material businesses. Built with React + TypeScript (frontend) and Java + Spring Boot (backend).

## Tech Stack

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Hook Form, Zod, Recharts

**Backend:** Java 21, Spring Boot 3.5, Spring Security, Spring Data JPA, Flyway

**Database:** PostgreSQL 16 (dev/prod) or H2 (test)

**Infrastructure:** Docker, Nginx, GitHub Actions (CI/CD)

## Prerequisites

- Java 21 (JDK)
- Node.js 22
- Docker and Docker Compose (for containerized setup)
- PostgreSQL 16 (only for `dev` profile without Docker)

## Getting Started

### Option 1: Test profile (H2 - quickest start)

No database setup needed. Uses an in-memory H2 database.

**Backend:**

```bash
cd backend/abm
./mvnw spring-boot:run -Dspring-boot.run.profiles=test
```

The backend starts at `http://localhost:8080` with default credentials `admin` / `admin`.

**Frontend:**

```bash
cd frontend
cp .env.example .env  # VITE_API_URL=http://localhost:8080
npm install
npm run dev
```

The frontend starts at `http://localhost:5173`.

### Option 2: Dev profile (PostgreSQL)

Requires a local PostgreSQL instance.

**Database:**

Create the database and user:

```sql
CREATE USER abm WITH PASSWORD 'your_password';
CREATE DATABASE abm OWNER abm;
```

**Backend:**

Create a `.env` file in the project root (or set environment variables):

```
DATABASE_USER=abm
DATABASE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_here
ADMIN_INITIAL_USERNAME=admin
ADMIN_INITIAL_PASSWORD=your_admin_password
```

```bash
cd backend/abm
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

Flyway runs migrations automatically on startup.

**Frontend:**

```bash
cd frontend
cp .env.example .env  # VITE_API_URL=http://localhost:8080
npm install
npm run dev
```

### Option 3: Docker Compose (containerized)

Runs the full stack (frontend + backend + database) in Docker.

```bash
# Copy and configure environment files
cp .env.example .env
cp docker-compose.example.yml docker-compose.yml
cp frontend/nginx.example.conf frontend/nginx.conf

# Edit .env with your values (at minimum: DATABASE_PASSWORD, JWT_SECRET, ADMIN_INITIAL_PASSWORD)
nano .env

# Build and start
docker compose up --build
```

Access the application at `http://localhost`.

## Application Profiles

| Profile | Database            | Flyway                        | Use case                               |
| ------- | ------------------- | ----------------------------- | -------------------------------------- |
| `test`  | H2 (in-memory)      | Disabled (uses `create-drop`) | Local development, quick testing       |
| `dev`   | PostgreSQL (local)  | Enabled                       | Local development with persistent data |
| `prod`  | PostgreSQL (remote) | Enabled                       | Production deployment                  |

## Production Deployment

The production environment uses pre-built Docker images from GitHub Container Registry (GHCR), pulled and deployed automatically via CI/CD.

### Setup

1. Copy example files and customize:
   - `docker-compose.example.yml` → `docker-compose.yml` (replace `build` with `image` references)
   - `.env.example` → `.env`
   - `frontend/nginx.prod.example.conf` → `frontend/nginx.prod.conf` (replace `YOUR_DOMAIN`)

2. Configure HTTPS with Let's Encrypt:

   ```bash
   sudo certbot certonly --standalone -d YOUR_DOMAIN -d www.YOUR_DOMAIN
   ```

3. Start the application:
   ```bash
   docker compose up -d
   ```

### CI/CD

The project uses GitHub Actions with two workflows:

- **CI** (`ci.yml`): Runs on every push and PR. Executes backend tests and frontend lint. On PRs, also validates Docker builds.
- **CD** (`cd.yml`): Triggered after CI passes on `main`. Builds and pushes images to GHCR, then deploys to the production server via SSH.

Required GitHub Secrets: `SERVER_HOST`, `SERVER_USER`, `SERVER_SSH_KEY`.

### Database Backups

Production backups are configured to run daily via cron, with local retention of 7 days and remote retention of 30 days on Google Drive (via rclone). See `infra/backup-db.example.sh` for the backup script reference.

**Restore in production:**

```bash
docker compose exec -T db pg_restore -U abm -d abm --clean --if-exists < backup_file.dump
```

**Restore locally (for testing or debugging with production data):**

```bash
# Start a temporary PostgreSQL container
docker run -d --name abm-db \
  -e POSTGRES_DB=abm \
  -e POSTGRES_USER=abm \
  -e POSTGRES_PASSWORD=abm \
  -p 5432:5432 \
  postgres:16

# Wait a few seconds for PostgreSQL to initialize, then restore
docker exec -i abm-db pg_restore -U abm -d abm --clean --if-exists < backup_file.dump

# Verify the data
docker exec -it abm-db psql -U abm -d abm -c "\dt"

# Clean up when done
docker stop abm-db
docker rm abm-db
```

## Testing on Mobile (Cloudflare Tunnel)

To test the application on a mobile device during local development:

```bash
# Start backend with test profile
cd backend/abm
CORS_ALLOWED_ORIGINS=https://YOUR_TUNNEL_URL ./mvnw spring-boot:run -Dspring-boot.run.profiles=test

# Start frontend
cd frontend
npm run dev

# Start tunnel
cloudflared tunnel --url http://localhost:5173
```

Access the generated URL on your mobile device.

## Project Structure

```
├── .github/workflows/     # CI/CD pipeline
├── backend/abm/           # Spring Boot application
│   ├── src/main/java/     # Java source code
│   ├── src/main/resources/ # Configuration files and migrations
│   ├── Dockerfile
│   └── entrypoint.sh
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # Shared and UI components
│   │   ├── modules/       # Feature modules (auth, order, stock, etc.)
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # API client and utilities
│   ├── Dockerfile
│   ├── nginx.conf                 # Nginx config (development)
│   └── nginx.prod.example.conf   # Nginx config template (production)
├── infra/                         # Server scripts and references
│   └── backup-db.example.sh      # Database backup script template
├── docker-compose.example.yml
└── .env.example
```
