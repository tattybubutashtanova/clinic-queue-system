# 🏥 Naryn Clinic Queue System

A modern, responsive clinic queue management system built with React and Node.js. This application helps medical clinics manage patient appointments, time slots, and doctor schedules efficiently.

## ✨ Features

### 🎯 Core Functionality
- **Patient Registration**: Easy appointment booking with time slot selection
- **Doctor Dashboard**: Comprehensive patient queue management
- **Time Slot Management**: Flexible scheduling with availability control
- **Real-time Updates**: Live queue status and patient flow tracking
- **Multi-language Support**: English, Russian, and Kyrgyz languages

### 🛠️ Technical Features
- **Modern UI/UX**: Beautiful, responsive design with Framer Motion animations
- **Professional Medical Theme**: Clean, healthcare-focused interface
- **Mobile Responsive**: Works seamlessly on all devices
- **Real-time Communication**: Live updates for queue management
- **Secure Authentication**: Doctor login system with department access

### 📊 Dashboard Features
- **Patient Queue Management**: View, start, and complete patient consultations
- **Time Slot Control**: Open/close appointment slots dynamically
- **Department Filtering**: Department-specific queue management
- **Statistics Dashboard**: Real-time clinic operation metrics
- **Queue Position Tracking**: Accurate patient position calculation

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tattybubutashtanova/clinic-queue-system.git
   cd clinic-queue-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Usage

### For Patients
1. **Book Appointment**: Click "Book Appointment" on the home page
2. **Select Department**: Choose your medical department
3. **Choose Time Slot**: Select available appointment time
4. **Fill Details**: Enter your information and submit
5. **Get Queue Number**: Receive your position in the queue

### For Doctors
1. **Login**: Click "Doctor Login" and use credentials:
   - Username: `doctor`
   - Password: `1234`
   - Department: Select your department
2. **View Dashboard**: See patient queue and time slots
3. **Manage Patients**: Start consultations and complete appointments
4. **Control Time Slots**: Open/close appointment availability

## 🏗️ Architecture

### Frontend (React)
- **React 18**: Modern React with hooks and functional components
- **React Router v6**: Client-side routing
- **Framer Motion**: Smooth animations and transitions
- **Lucide Icons**: Professional medical icons
- **CSS Variables**: Consistent theming and styling

### Backend (Node.js)
- **Express.js**: RESTful API server
- **In-memory Storage**: Simple, reliable data persistence
- **CORS**: Cross-origin resource sharing
- **Error Handling**: Comprehensive error management

### Key Components
```
src/
├── components/
│   ├── Home.js              # Landing page
│   ├── Login.js             # Doctor authentication
│   ├── Register.js          # Patient registration
│   ├── Doctor.js            # Doctor dashboard
│   └── common/
│       ├── Navbar.js        # Navigation component
│       └── Footer.js        # Footer component
├── services/
│   └── api.js               # API service layer
├── utils/
│   ├── helpers.js           # Utility functions
│   └── constants.js         # Application constants
└── hooks/
    ├── useLanguage.js       # Language management
    └── useInterval.js        # Real-time updates
```

## 📋 API Endpoints

### Authentication
- `POST /api/login-doctor` - Doctor login

### Time Slots
- `GET /api/timeslots` - Get available time slots
- `POST /api/timeslots` - Create new time slot
- `PUT /api/timeslots/:id` - Update time slot
- `DELETE /api/timeslots/:id` - Delete time slot

### Patients
- `POST /api/register-patient` - Register new patient
- `GET /api/patients` - Get patients list
- `GET /api/patients/:id` - Get patient details
- `PUT /api/patients/:id` - Update patient status

### Queue Management
- `POST /api/call-next` - Call next patient
- `GET /api/stats` - Get clinic statistics
- `GET /api/health` - Health check

## 🎨 Design System

### Color Palette
- **Primary**: Medical blue (#2C7A7B)
- **Secondary**: Teal accent (#14B8A6)
- **Success**: Green (#22C55E)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- Clean, readable fonts optimized for medical environments
- Consistent sizing and spacing
- Accessibility-focused design

### Components
- **Cards**: Patient information and time slot displays
- **Buttons**: Consistent action buttons with hover effects
- **Forms**: Professional medical form layouts
- **Navigation**: Intuitive header and footer navigation

## 🌐 Multi-language Support

The application supports three languages:
- **English** (default)
- **Русский** (Russian)
- **Кыргызча** (Kyrgyz)

Language switching is available throughout the application with persistent user preferences.

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# API Configuration
API_URL=http://localhost:3000
NODE_ENV=development

# JWT Secret for Authentication
JWT_SECRET=your_jwt_secret_key_here
```

### Port Configuration
- Development: `3000`
- Production: Configurable via `PORT` environment variable

## 📦 Deployment

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure `PORT` environment variable
3. Ensure all dependencies are installed
4. Build the React application

## 🧪 Testing

### Manual Testing Checklist
- [ ] Patient registration flow
- [ ] Doctor login functionality
- [ ] Time slot management
- [ ] Queue position tracking
- [ ] Multi-language switching
- [ ] Mobile responsiveness
- [ ] Real-time updates

### API Testing
```bash
# Health check
curl http://localhost:3000/api/health

# Get time slots
curl http://localhost:3000/api/timeslots

# Doctor login
curl -X POST http://localhost:3000/api/login-doctor \
  -H "Content-Type: application/json" \
  -d '{"username":"doctor","password":"1234","department":"General"}'
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Style
- Use ES6+ syntax
- Follow React best practices
- Maintain consistent formatting
- Add comments for complex logic

### Commit Messages
- Use clear, descriptive messages
- Follow conventional commit format
- Include issue numbers when applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Framer Motion** - For beautiful animations
- **Lucide Icons** - For professional medical icons
- **Medical Community** - For inspiration and feedback

## 📞 Support

For support, please contact:
- **Email**: info@clinic.kg
- **GitHub Issues**: [Create an issue](https://github.com/tattybubutashtanova/clinic-queue-system/issues)

---

**Built with ❤️ for better healthcare management**
