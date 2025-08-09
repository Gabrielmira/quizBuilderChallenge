# Quiz Application

This project is a full-stack quiz application with a `/frontend` and `/backend` directory.  
It allows creating and listing quizzes, with a Prisma + SQLite backend and a modern frontend.

---

## **Project Structure**

```
/frontend   # React/Next.js frontend
/backend    # Node.js backend with Prisma ORM
```

---

## **Requirements**

- Node.js >= 18
- npm or yarn
- Git

---

## **Setup Instructions**

### **1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### **2. Install dependencies**

**Backend**
```bash
cd backend
npm install
```

**Frontend**
```bash
cd ../frontend
npm install
```

---

## **Running Locally**

### **Backend**

1. **Generate Prisma client**  
   ```bash
   cd backend
   npx prisma generate
   ```

2. **Run database migrations**  
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Start the backend server**  
   ```bash
   npm run start:dev
   ```  
   The backend will run by default at:  
   `http://localhost:3001` (depending on your configuration).

---

### **Frontend**

1. **Start the frontend server**
   ```bash
   cd frontend
   npm run dev
   ```

2. Open your browser at:  
   `http://localhost:3000`

---

## **Database**

- The application uses **SQLite** for simplicity.  
- Database file: `backend/prisma/dev.db`  
- Connection URL in `schema.prisma`:
  ```prisma
  datasource db {
    provider = "sqlite"
    url      = "file:./dev.db"
  }
  ```
- This makes it possible for anyone cloning the project to run it locally without needing to set up an external DB.

---

## **Optional: Seeding the Database**
If you want to add example quizzes:
```bash
npx prisma db seed
```

---

## **Commit Guidelines**

When committing, follow this sequence:
```bash
# Stage changes
git add .

# Commit with message
git commit -m "feat: add quiz app setup and documentation"

# Push to remote repository
git push origin main
```

---

## **Example API Routes**
- **GET** `/quizzes` → Returns a list of quizzes
- **POST** `/quizzes` → Creates a new quiz

---

## **License**
This project is for educational purposes.
