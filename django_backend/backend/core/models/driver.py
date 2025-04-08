from django.db import models
from .user import User

class Driver(models.Model):
    """Driver model that extends model.Model model."""
    driver_id = models.AutoField(primary_key=True)
    driver_name = models.CharField(max_length=150)
    driver_no = models.CharField(max_length=50)
    driver_email = models.EmailField(unique=True)
    driver_password = models.CharField(max_length=255)

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='driver_profile')

    def __str__(self):
        return self.driver_name
    
    @property
    def to_dict(self):
        """
        Convert the driver object to a dictionary format.
        """
        return {
            'driverId': self.driver_id,
            'driverName': self.driver_name,
            'driverNumber': self.driver_no,
            'driverEmail': self.driver_email,
            'userId': self.user.user_id
        }