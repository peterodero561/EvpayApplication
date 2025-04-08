from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from django.core.exceptions import ValidationError
from core.models import User, Driver, Garage, Bus, GarageManager, Activity

class ProfileAPI(APIView):
    parser_classes = [MultiPartParser]
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.user_id,
            'name': user.user_name,
            'email': user.email,
            'role': user.user_role,
            'avatar': user.user_profile_pic.url if user.user_profile_pic else None
        })

    def put(self, request):
        user = request.user
        data = request.data

        if 'name' in data:
            user.user_name = data['name']
        if 'email' in data:
            user.email = data['email']
        if 'profile_pic' in request.FILES:
            if user.user_profile_pic:
                user.user_profile_pic.delete(save=False) # deletes the previous profile pic
            user.user_profile_pic = request.FILES['profile_pic']
        
        if 'password' in data:
            password=data['password']
            if not password:
                return Response({"error": "Password cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(password)
        
        try:
            user.full_clean()  # Validate the model instance
            user.save()  # Save the instance to the database
            user.refresh_from_db()  # Refresh the instance from the database
        except IntegrityError as e:
            return Response({"error": f"Integrity error occurred: {e}."}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response({"error": f"Validation error occurred: {e}."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"An error occurred: {e}."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        user = {
            'id': user.user_id,
            'name': user.user_name,
            'email': user.email,
            'role': user.user_role,
            'avatar': user.user_profile_pic.url if user.user_profile_pic else None
        }
        return Response({'user': user}, status=status.HTTP_200_OK)

class VehicleAPI(APIView):
    parser_classes = [MultiPartParser]
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            driver = request.user.driver_profile
            bus = Bus.objects.get(driver=driver)
            return Response(bus.to_dict())
        except ObjectDoesNotExist:
            return Response({'message': 'No Bus Information'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self, request):
        try:
            driver = request.user.driver_profile
            bus = Bus.objects.get(driver=driver)
            data = request.data

            if 'busPlateNo' in data:
                bus.bus_plate_no = data['busPlateNo']
            if 'busModel' in data:
                bus.bus_model = data['busModel']
            if 'busBatteryModel' in data:
                bus.bus_battery_model = data['busBatteryModel']
            if 'busBatteryCompany' in data:
                bus.bus_battery_company = data['busBatteryCompany']
            if 'busSeatNo' in data:
                bus.bus_seat_no = data['busSeatNo']

            bus.full_clean()  # Validate the model instance
            bus.save()  # Save the instance to the database

            return Response(bus.to_dict(), status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({'message': 'No Bus Information'}, status=status.HTTP_200_OK)
        except IntegrityError as e:
            return Response({"error": f"Integrity error occurred: {e}."}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response({"error": f"Validation error occurred: {e}."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request):
        "deletes the bus information"
        try:
            request.user.driver_profile.bus.delete()
            return Response({'message': 'Bus information deleted successfully.'}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({'message': 'No Bus Information'}, status=status.HTTP_200_OK)
        except IntegrityError as e:
            return Response({"error": f"Integrity error occurred: {e}."}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response({"error": f"Validation error occurred: {e}."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GarageAPI(APIView):
    "Profile for modifying garages for garage managers"
    parser_classes = [MultiPartParser]
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrives garage information for a garage manager"""
        try:
            manager = request.user.garage_manager_profile
            garage = Garage.objects.get(manager=manager)
            return Response(garage.to_dict, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({'message': 'No Garage Information'}, status=status.HTTP_200_OK)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self, request):
        """Updates garage information for a garage manager"""
        try:
            manager = request.user.garage_manager_profile
            garage = Garage.objects.get(manager=manager)
            data = request.data

            if 'garName' in data:
                garage.gar_name = data['garName']
            if 'garLocation' in data:
                garage.gar_location = data['garLocation']
            if 'garServices' in data:
                garage.gar_services = data['garServices']
            
            garage.full_clean()  # Validate the model instance
            garage.save()  # Save the instance to the database
            return Response(garage.to_dict, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({'message': 'No Garage Information'}, status=status.HTTP_200_OK)
        except IntegrityError as e:
            return Response({"error": f"Integrity error occurred: {e}."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request):
        """Deletes the garage information for a garage manager"""
        try:
            request.user.garage_manager_profile.garage.delete()
            return Response({'message': 'Garage information deleted successfully.'}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({'message': 'No Garage Information'}, status=status.HTTP_200_OK)
        except IntegrityError as e:
            return Response({"error": f"Integrity error occurred: {e}."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ActivityAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            user = request.user
            # get limit if its provided
            limit = request.query_params.get('limit')
            activities = user.activities.all().order_by('-timestamp')
            if limit is not None:
                try:
                    limit = int(limit)
                    activities = activities[:limit]
                except ValueError:
                    return Response({"error": "Limit must be an integer."}, status=status.HTTP_400_BAD_REQUEST)

            serialized_activites = [
                {
                    "id": a.id,
                    "description": a.description,
                    "timestamp": a.timestamp.strftime('%Y-%m-%d %H:%M:%S')
                }
                for a in activities
            ]
            return Response({'activities': serialized_activites}, status=status.HTTP_200_OK)

        except IntegrityError:
            return Response({"error": "Integrity error occurred."}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError:
            return Response({"error": "Validation error occurred."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)