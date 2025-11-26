## Projet BTP

Application full-stack de gestion pour le BTP composée d’un backend Spring Boot (`Backend/`) et d’un frontend Angular 20 (`Frontend/`). Le backend expose des APIs REST sécurisées connectées à MySQL, tandis que le frontend consomme ces services via un serveur Angular configuré avec un proxy (`proxy.conf.json`). Dépôt distant : [Scarllet-hash/btp-management-system](https://github.com/Scarllet-hash/btp-management-system.git).

### Pré-requis
- Java 21 (aligné sur `pom.xml`)
- Maven 3.9+ ou les wrappers `mvnw` / `mvnw.cmd`
- Node.js 20+ avec npm 10+
- MySQL 8.x accessible en local (par défaut `localhost:3307`)

### Backend (Spring Boot)
1. `cd Backend`
2. Installation des dépendances : `mvnw.cmd clean install` (Windows) ou `./mvnw clean install` (macOS/Linux)
3. Variables d’environnement disponibles (optionnelles) :
   - `SPRING_DATASOURCE_URL` (défaut `jdbc:mysql://localhost:3307/gestion_btp?...`)
   - `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD`
   - `SPRING_STATIC_LOCATION` pour pointer vers un autre dossier `uploads/`
4. Lancer l’API : `mvnw.cmd spring-boot:run`
5. L’API répond sur `http://localhost:8080/api`, les médias uploadés sur `/uploads/**`.

### Frontend (Angular 20)
1. `cd Frontend`
2. Installer les dépendances (première fois uniquement) : `npm install`
3. Démarrer le serveur de dev (sans SSR) : `npm run dev:no-ssr`
4. Ouvrir `http://localhost:4200/`. Le proxy Angular redirige automatiquement les appels `/api` vers `http://localhost:8080/api`, évitant les soucis de CORS.

Scripts utiles :
- `npm run start` : serveur accessible sur toutes les interfaces (`0.0.0.0`)
- `npm run build` / `npm run build:no-ssr` : builds production ou statiques
- `npm run test` : tests unitaires Karma

### Flux de travail recommandé
1. Lancer MySQL et s’assurer que le schéma `gestion_btp` existe (création automatique si droits suffisants).
2. Démarrer le backend (`mvnw spring-boot:run`).
3. Dans un second terminal, lancer le frontend (`npm run dev:no-ssr`).
4. Naviguer sur `http://localhost:4200`, se connecter et utiliser l’application. Les requêtes sont routées vers `http://localhost:8080/api`.

### Dépannage
- Erreur `ENOENT package.json` : vérifier que la commande npm est lancée depuis le dossier `Frontend/`.
- Échec de connexion MySQL : confirmer le port (3307 par défaut) et les identifiants (cf. `application.properties` ou variables d’environnement).
- Fichiers statiques absents : vérifier que `Backend/uploads` correspond au chemin déclaré dans `spring.resources.static-locations`.

### Notes de déploiement
- Références conteneurs : `docker-compose.dev.yml`, `Frontend/Dockerfile.dev`, `Backend/Dockerfile.dev`.
- Le build Angular est généré dans `Frontend/dist/civil_rpoject` et peut être servi via Nginx (voir `Frontend/nginx.conf`).

### Workflow Git
1. `git add .`
2. `git commit -m "docs: mettre à jour le readme en français"`
3. `git push origin main`

