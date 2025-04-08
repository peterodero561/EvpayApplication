from django.db import models
import json
from .manager import GarageManager

class Garage(models.Model):
    """Garage model that extends model.Model model."""
    gar_id = models.AutoField(primary_key=True)
    gar_name = models.CharField(max_length=150)
    gar_location = models.CharField(max_length=150, unique=True)
    gar_services = models.JSONField(default=dict)

    manager = models.ForeignKey(GarageManager, on_delete=models.CASCADE, related_name='garages')

    def __str__(self):  
        return self.gar_name
        
    @property
    def to_dict(self):
        """
        Convert the Garage object to a dictionary format.
        """
        return {
            'garageId': self.gar_id,
            'garageName': self.gar_name,
            'garageLocation': self.gar_location,
            'garageServices': self.gar_services,
            'managerId': self.manager.manager_id
        }