# 🚛 FleetManager

A comprehensive fleet management system built with modern web technologies.

## 🌟 Features

- **Vehicle Management** - Add, edit, and track fleet vehicles
- **Driver Management** - Register and manage drivers with license tracking
- **Trip Tracking** - Monitor trips, routes, and real-time status
- **Expense Management** - Track fuel, maintenance, and operational costs
- **Real-time Monitoring** - Live fleet status and alerts
- **Reporting & Analytics** - Comprehensive insights and performance metrics
- **Document Management** - Store and manage vehicle and driver documents

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM
- **Authentication**: Replit Auth
- **Deployment**: Vercel, Railway, Docker ready

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- PostgreSQL database (Supabase recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/akuprof/fleetmanager.git
   cd fleetmanager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up database**
   - Create a Supabase account at [supabase.com](https://supabase.com)
   - Create a new project
   - Get your database connection string
   - Run the setup script:
   ```bash
   .\setup-supabase.ps1
   ```

4. **Start the application**
   ```bash
   npm run start
   ```

5. **Access the application**
   - Backend API: http://localhost:5000
   - Frontend: https://final-theta-ochre.vercel.app

## 📊 Database Schema

The application includes comprehensive database tables:

- **Users** - User management and authentication
- **Vehicles** - Fleet vehicle information and documents
- **Drivers** - Driver profiles, licenses, and bank details
- **Trips** - Trip tracking and management
- **Expenses** - Expense tracking and categorization
- **Vehicle Assignments** - Driver-vehicle assignments
- **Alerts** - System notifications and reminders
- **Sessions** - User session management

## 🚀 Deployment

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Option 2: Railway
- Connect your GitHub repository to Railway
- Railway will auto-detect the configuration

### Option 3: Docker
```bash
docker-compose up --build -d
```

### Option 4: Manual
```bash
npm run build
npm run start
```

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
PORT=5000
```

## 📁 Project Structure

```
fleetmanager/
├── client/                 # React frontend
│   ├── src/               # Source code
│   └── index.html         # Entry point
├── server/                # Express.js backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── db.ts              # Database configuration
│   └── storage.ts         # File storage
├── shared/                # Shared code
│   └── schema.ts          # Database schema
├── dist/                  # Built application
├── migrations/            # Database migrations
└── configuration files    # Deployment configs
```

## 🎯 API Endpoints

- `GET /` - Application health check
- `GET /api/health` - API health status
- `POST /api/vehicles` - Create vehicle
- `GET /api/vehicles` - List vehicles
- `POST /api/drivers` - Create driver
- `GET /api/drivers` - List drivers
- `POST /api/trips` - Create trip
- `GET /api/trips` - List trips
- `POST /api/expenses` - Create expense
- `GET /api/expenses` - List expenses

## 🔒 Security

- Environment variable protection
- Database connection security
- CORS configuration
- Input validation with Zod
- SQL injection protection with Drizzle ORM

## 📈 Monitoring

- Application health checks
- Database connection monitoring
- Error logging and tracking
- Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the deployment guide
- Open an issue on GitHub

## 🎉 Acknowledgments

Built with modern web technologies and best practices for fleet management solutions.

---

**FleetManager** - Streamline your fleet operations with ease! 🚛💨
