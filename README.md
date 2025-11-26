## BTP Project

Full-stack construction management application composed of a Spring Boot backend (`Backend/`) and an Angular 20 frontend (`Frontend/`). The backend exposes secured REST APIs backed by MySQL, while the frontend consumes those APIs via an Angular dev server proxy for local development. Repository mirror: [Scarllet-hash/btp-management-system](https://github.com/Scarllet-hash/btp-management-system.git).

### Prerequisites
- Java 21 (matching the backend `pom.xml`)
- Maven 3.9+ (or the bundled `mvnw`/`mvnw.cmd`)
- Node.js 20+ and npm 10+
- MySQL 8.x accessible locally (default `localhost:3307`)

### Backend (Spring Boot)
1. `cd Backend`
2. Install dependencies: `mvnw.cmd clean install` (Windows) or `./mvnw clean install` (Mac/Linux)
3. Configure environment (override defaults only if needed):
   - `SPRING_DATASOURCE_URL` (defaults to `jdbc:mysql://localhost:3307/gestion_btp?...`)
   - `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD`
   - `SPRING_STATIC_LOCATION` if `uploads/` is stored elsewhere
4. Launch API: `mvnw.cmd spring-boot:run`
5. API is served at `http://localhost:8080/api`, file uploads available under `/uploads/**`.

### Frontend (Angular 20)
1. `cd Frontend`
2. Install dependencies (once): `npm install`
3. Start the dev server (no SSR): `npm run dev:no-ssr`
4. Open `http://localhost:4200/`. The Angular proxy (`proxy.conf.json`) forwards `/api` calls to the backend so CORS configuration is not required locally.

Additional scripts:
- `npm run start` – serves with proxy on all interfaces (`0.0.0.0`)
- `npm run build` / `npm run build:no-ssr` – production or static builds
- `npm run test` – executes Karma unit tests

### Combined workflow
1. Start MySQL, ensure schema `gestion_btp` exists (it will be auto-created if permissions allow).
2. Run backend (`mvnw spring-boot:run`).
3. In a new terminal run the frontend dev server (`npm run dev:no-ssr`).
4. Navigate to `http://localhost:4200` and authenticate. API calls reach `http://localhost:8080/api` transparently via the Angular proxy.

### Troubleshooting
- `ENOENT package.json` when running npm scripts: ensure you are inside `Frontend/`.
- DB connection failures: confirm the port (`3307` by default) and credentials match `application.properties` or exported env vars.
- Static assets not loading: keep `Backend/uploads` in sync with `spring.resources.static-locations`.

### Deployment notes
- For containerized workflows, see `docker-compose.dev.yml`, `Frontend/Dockerfile.dev`, and `Backend/Dockerfile.dev`.
- Build artifacts land in `Frontend/dist/civil_rpoject` and can be served by Nginx (see `Frontend/nginx.conf`).

### Git workflow
1. Commit changes: `git add . && git commit -m "docs: add project readme"`
2. Push to GitHub: `git push origin main` (requires access to [Scarllet-hash/btp-management-system](https://github.com/Scarllet-hash/btp-management-system.git)).

