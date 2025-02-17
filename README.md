
![Screenshot (18)](https://github.com/user-attachments/assets/61609625-1af4-4028-90ea-236a9bdd2463)



![Screenshot (17)](https://github.com/user-attachments/assets/7e98bd1b-1c78-43e9-b48c-8ed0b3929212)




```markdown
# Project Setup Guide

## Getting Started

Follow the steps below to set up and run the project locally.

### Back-end Setup

1. Navigate to the back-end directory:
   ```sh
   cd path/to/your/project/back-end/
   ```
2. Install dependencies:
   ```sh
   composer install
   ```
3. Copy the `.env.example` file and rename it to `.env`:
   ```sh
   cp .env.example .env
   ```
4. Verify that the environment variables in the `.env` file are correct.
5. Generate the application key:
   ```sh
   php artisan key:generate
   ```
6. Run database migrations and seeders:
   ```sh
   php artisan migrate && php artisan migrate:fresh --seed
   ```
7. Start the Laravel development server:
   ```sh
   php artisan serve
   ```

### Front-end Setup

1. Navigate back to the root directory:
   ```sh
   cd ../
   ```
2. Navigate to the front-end directory:
   ```sh
   cd front-end/
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the front-end development server:
   ```sh
   npm run dev
   ```

Now you can view the blog page at [http://localhost:3000](http://localhost:3000).

### Notes
- If port `3000` is busy, run the following command to free it:
  ```sh
  npx kill-port 3000
  ```
  Then retry:
  ```sh
  npm run dev
  ```
- If you need to run the front-end on a different URL or port, update the necessary configurations in `cors.php`.

