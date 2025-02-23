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

#### 2. Backend (Flask)

```
backend/
│
├── app/                    # Main backend application
│   ├── models/             # Database models (User, Driver, Bus, Garage, GarageManager)
│   ├── blueprints/         # Feature-based API routes
│   │   ├── auth/           # Authentication module
│   │   ├── profiles/       # User and driver profiles
│   │   ├── payments/       # Payment system
│   ├── extensions.py       # Flask extensions
├── migrations/             # Database migration files
├── tests/                  # Unit and integration tests
├── config.py               # App configurations(Prod, Test)
├── manage.py               # commands to start the backend
├── requirements.txt        # Python dependencies
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
cd EvpayApplication/backend
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
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

5. Run backend server
```sh
flask run --host=0.0.0.0 --port=5000 # or python3 manage_app.py; Get the URL to set up in frontend 
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
echo 'API_BASE_URL=http://your_pc_address' > .env # The one found after running flask server eg. 192.168.10.10
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
```
cd backend
source evpay/bin/activate
pip3 install pytest
evpay/bin/python3 -m pytest
```
# Contact
For queries, contact Peter Odero at peterodero561@gmail.com
