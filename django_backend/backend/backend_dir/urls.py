from django.urls import re_path
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from rest_framework.authtoken import views
from custom_auth.views import LoginAPI, RegisterUserAPI, VehicleRegistrationAPI, GarageRegistrationAPI
from payments.views import MpesaAPI, PaymentCallbackAPI
from profiles.views import ProfileAPI, ActivityAPI, VehicleAPI, GarageAPI

urlpatterns = [
    path('api-token-auth/', views.obtain_auth_token),
    re_path(r'^api/auth/login/?$', LoginAPI.as_view()), # View for user login
    re_path(r'^api/auth/register/?$', RegisterUserAPI.as_view()), # View for user registration
    re_path(r'^api/auth/vehicles/?$', VehicleRegistrationAPI.as_view()), # View for vehicle registration
    re_path(r'^api/auth/garage/?$', GarageRegistrationAPI.as_view()), # View for garage registration
    
    re_path(r'^api/payments/?$', MpesaAPI.as_view()),
    re_path(r'^api/payments/callback/?$', PaymentCallbackAPI.as_view()),
    
    re_path(r'^api/profile?$', ProfileAPI.as_view()), # View for users profile
    re_path(r'^api/profile/activities/?$', ActivityAPI.as_view()), # View for user activities
    re_path(r'^api/profile/vehicle?$', VehicleAPI.as_view()), # View for user vehicles
    re_path(r'^api/profile/garage?$', GarageAPI.as_view()), # View for user garages
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)