# EVPay Application

## Overview


EVPay is a transport payment application that facilitates seamless transactions between users, drivers, and transport service providers. It consists of a backend (Flask-based) and a frontend (React Native-based) for a complete system.

## Features 

- User, Garage Manager & Driver Authentication (Login, Registration, Profile Management)
- Bus & Garage Management
- Secure Payment Processing(Mpesa, Credit Card)

## Project Stucture

#### 1. EVPay Application
```
EvpayApplication/
 |--frontend/
 |--backend/
 |--README.md
```

#### 2. Backend (Django)

```
django_backend/
│
├── README.md
├── requirements.txt
├── start_django_server
│
├── backend/                      # Main project folder
│   ├── manage.py
│   ├── media/                    # For user-uploaded files
│   │
│   ├── backend_dir/             # Django settings and project-level
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │
│   ├── core/                    # Your main app with models
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── migrations/
│   │   ├── models/
│   │   │   ├── __init__.py     
│   │   │   ├── activity.py
│   │   │   ├── bus.py
│   │   │   ├── driver.py
│   │   │   ├── garage.py
│   │   │   ├── manager.py
│   │   │   ├── transaction.py
│   │   │   ├── user.py
│   │   ├── tests.py
│   │   ├── views.py
│   │
│   ├── custom_auth/             # Authentication-related logic
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── tests.py
│   │
│   ├── payments/                # Payment gateway and billing
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── tests.py
│   │
│   ├── profiles/                # User profile logic and APIs
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── tests.py
```

#### 3. Frontend(React Native)

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   ├── screens/            # Pages (Login, Register, Profile, Payments)
│   ├── navigation/         # App navigation
│   ├── services/           # API calls (Axios)
│   ├── utils/              # Utility functions
│   ├── App.js              # Main app component
│   └── index.js            # Entry point
├── assets/                 # Images, fonts, etc.
├── tests/                  # Unit and integration tests
├── package.json            # Node.js dependencies
```

## Setup Instructions 
#### Backend
1. Clone repo
``` sh
git clone https://github.com/peterodero561/EvpayApplication.git
cd EvpayApplication/django_backend
```

2. Create and activate virtual environment
```sh
python -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

3. Install dependencies
```sh
pip install -r requirements.txt
```

4. Set up database
```sh
# Ensure you have MySQL installed
cd Evpay/django_backend/backend
python3 manage.py makemigrations
python3 manage.py migrate
```

5. Run backend server
```sh
python3 manage.py runserver
```


#### Frontend
1. Navigate to and Install Frontend dependancies
```sh
cd EvpayApplication/frontend
npm install
```

2. Instal Expo (if not installed)
```sh
npm install -g expo-cli
```

3. Setup API_BASE_URL
```sh
cd EvpayApplication/frontend
echo 'API_BASE_URL=http://your_pc_address' > .env # The one found after running Django server eg. 192.168.10.10
source .env # So that the environmental variables are updated
```

4. Run React Native app
```sh
npx expo start 
```

5. Run app on device
- *Android/ios*: Scan the QR code using *Expo Go* app
- *Web*: open in web
- *Android Studio Simulator*: open in android


## Pytest unit tests
```sh
```
# Contact
For queries, contact Peter Odero at peterodero561@gmail.com
