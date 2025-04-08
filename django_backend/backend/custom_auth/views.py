from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.parsers import MultiPartParser
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.core.exceptions import ObjectDoesNotExist
from core.models import User, Driver, Garage, Bus, GarageManager, Activity
from django.db import IntegrityError
import re

class LoginAPI(APIView):
    """
    API for user login.
    """
    permission_classes = [AllowAny]
    def post(self, request):
        """
        Handles user login by validating credentials and returning a token.
        """
        email = request.data.get('email')
        password = request.data.get('password')

        # Validate input
        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate user
        user = authenticate(request, email=email, password=password)
        if user is None:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        # Generate token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({"token": token.key, 'user': {'id': user.user_id, 'name': user.user_name, 'email': user.email, 'role': user.user_role, 'avatar': user.user_profile_pic.url if user.user_profile_pic else None}}, status=status.HTTP_200_OK)

class RegisterUserAPI(APIView):
    """
    API for user registration.
    """
    permission_classes = [AllowAny]
    def post(self, request):
        """
        Handles user registration by creating a new user.
        """

        try:
            email = request.data.get('email')
            password = request.data.get('password')
            name = request.data.get('name')
            user_role = request.data.get('role')

            # Validate input
            if not email or not password or not name or not user_role:
                return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)
            
            print(f"Data: {email}, {password}, {name}, {user_role}")

            # Validate email format
            if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
                return Response({"error": "Invalid email format."}, status=status.HTTP_400_BAD_REQUEST)
            

            # create user
            user = User.objects.create_user(email=email, password=password, user_name=name, user_role=user_role)

            if user_role == 'driver':
                Driver.objects.create(user=user, driver_name=name, driver_email=email)
            elif user_role == 'manager':
                GarageManager.objects.create(user=user, manager_name=name, manager_email=email)

            Activity.objects.create(
                user=user,
                description=f"{user_role} {name} registered successfully."
            )

            return Response({"status": "success", "message": f"{user_role} registered successfully."}, status=status.HTTP_201_CREATED)
            
        except IntegrityError:
            return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)
        
        except KeyError as e:
            return Response({'error': f"Missing Field: {str(e)}."}, status=status.HTTP_400_BAD_REQUEST)


class VehicleRegistrationAPI(APIView):
    """
    API for vehicle management.
    """
    parser_classes = [MultiPartParser]
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Handles vehicle registration by creating a new vehicle.
        """
        try:
            data = request.data
            user = request.user
            print(f"User: {user}")
            print(f"Data: {data}")

            # if user.role != 'driver':
            #     return Response({"error": "Only drivers can register vehicles."}, status=status.HTTP_403_FORBIDDEN)
            
            Bus.objects.create(
                bus_model=data['busModel'],
                bus_plate_no=data['busPlateNo'],
                bus_battery_model=data['busBatteryModel'],
                bus_battery_company=data['busBatteryCompany'],
                bus_seat_no=data['busSeatNo'],
                driver=user.driver_profile
            )
            Activity.objects.create(
                user=user,
                description=f"Vehicle {data['plate']} registered successfully."
            )
            return Response({'status': 'success', "message": "Vehicle registered successfully."}, status=status.HTTP_201_CREATED)
        
        except IntegrityError:
            return Response({"error": "Bus Plate already exists."}, status=status.HTTP_400_BAD_REQUEST)
        
        except KeyError as e:
            return Response({'error': f"Missing Field: {str(e)}."}, status=status.HTTP_400_BAD_REQUEST)

class GarageRegistrationAPI(APIView):
    '''class for garage registration'''
    parser_classes = [MultiPartParser]
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        '''Register a garage'''
        try:
            data = request.data
            user = request.user

            if user.user_role != 'manager':
                return Response({'error': 'only garage managers can register garages'}, status=status.HTTP_403_FORBIDDEN)

            try:
                manager_profile = user.garage_manager_profile
            except ObjectDoesNotExist:
                return Response({'error': "No garage manager profile found for this user"}, status=status.HTTP_404_NOT_FOUND)
            
            Garage.objects.create(
                manager=manager_profile,
                gar_location=data['garLocation'],
                gar_name=data['garName'],
                gar_services=data['garServices']
            )

            Activity.objects.create(
                user=user,
                description=f"Garage {data['garName']} registered successfully."
            )

            return Response({'status': 'success', 'message': 'Garage registered successfully'}, status=status.HTTP_201_CREATED)
        
        except IntegrityError as e:
            return Response({'error': f'Garage name already exists {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        
        except KeyError as e:
            return Response({'error': f'Missing filed {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)