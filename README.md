# Anything.lk

## Coursework Project for Web Programming II

This project is developed as part of the coursework for the **Web Programming II** module at the **Java Institute for Advanced Technology**.

## Project Overview

Anything.lk is a full-stack web application designed to provide a modern e-commerce experience. The project is structured as a monorepo using [Nx](https://nx.dev), and consists of two main applications:

- **Frontend**: Built with Next.js and TypeScript, located in `apps/frontend`. It provides a responsive, user-friendly interface for browsing, searching, and purchasing products.
- **Backend**: A Java-based web application located in `apps/backend`, using Hibernate for ORM and MySQL for data storage. It exposes APIs for product management, user authentication, order processing, and more.

## Folder Structure

- `apps/frontend/` — Next.js frontend application
- `apps/backend/` — Java backend application (with Hibernate, MySQL, and Ant build)
- `apps/backend/database/` — Database models and SQL scripts
- `apps/backend/lib/` — Java libraries and dependencies
- `apps/backend/src/` — Java source code (controllers, models, configs)
- `public/` — Static assets (images, logos)

## Getting Started

### Prerequisites

- Node.js (for frontend)
- Java 8+ and Apache Ant (for backend)
- MySQL (for database)

### Frontend

1. Navigate to the frontend directory:
   ```sh
   cd apps/frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the development server:
   ```sh
   npm run dev
   ```

### Backend

1. Navigate to the backend directory:
   ```sh
   cd apps/backend
   ```
2. Configure your database connection in `src/java/hibernate.cfg.xml`.
3. Build the project using Ant:
   ```sh
   ant clean dist
   ```
4. Deploy the generated WAR file to your preferred Java EE server (e.g., GlassFish, Tomcat).

### Database

1. Create a MySQL database and import the schema and initial data:
   ```sh
   mysql -u <user> -p <database> < apps/backend/database/initial.sql
   mysql -u <user> -p <database> < apps/backend/database/data.sql
   ```

## Features

- User authentication and authorization
- Product catalog and search
- Shopping cart and checkout
- Order management
- Admin panel for product and order management
