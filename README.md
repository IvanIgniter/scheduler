# Scheduler Project

### Specifications / Infrastructure Information

- Apache
- PHP-FPM
- MySQL
- Postfix
- CS-Fixer
- Data Volume
 
#### Prerequisites

Make sure you have installed the following on your local machine:

- Git
- Virtual Box
- Node.js & NPM (*v12.14.0)
- Docker

After installing docker toolbox, run the Docker Quickstart Terminal.

#### Installing

1. Clone the repo

```
git clone https://github.com/IvanIgniter/scheduler.git
cd sites/backend
```

2. Setup the .env file for Docker

```
cp .env.example .env
```

3. Setup frontend 
cd sites/frontend
```
follow Setting up Frontend section
```

4. Build the containers

```
docker-compose build
```

5. Start the containers in root folder

```
docker-compose up -d

```

6. Setup backend
```
follow Setting up Backend section
```

7. Start the frontend
```
from the host server go to the project/sites/frontend directory.
run this command: npm start
```

8. Open http://locahost:3000


#### Setting up Backend

1. Login to the PHP-FPM container

```
docker exec -it docker_php bash
```

Note: 'docker_php' is the default name of the container. If you changed the value of PROJECT_NAME inside the .env file,
then you need to change 'docker' to the value of PROJECT_NAME.

2. Install the dependencies

```
composer install
```

3. Setup Laravel

```
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan passport:install
php artisan storage:link
```

Copy the newly generated client secret of Client 2 from the `passport:install`command.

Once everything is done, you can now exit from bash.

```
exit
```

#### Setting up Frontend

1. Go into frontend's directory

```
  cd sites/frontend
```

2. Install the dependencies

```
npm install
```

3. Setup .env

```
cp .env.example .env
set .env file VUE_APP_API_BASE_URL=http://[vagrant ip]:8080
```

Edit the .env file
VUE_APP_DEBUG=true
VUE_APP_API_GRANT_TYPE=password
VUE_APP_API_CLIENT_ID=2
VUE_APP_API_CLIENT_SECRET=(Paste the client secret here that you've copied earlier)
VUE_APP_API_BASE_URL=http://192.168.1.100:8080

4. Build

```
npm run build
```
