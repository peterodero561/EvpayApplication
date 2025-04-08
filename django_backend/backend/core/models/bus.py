from django.db import models
from .driver import Driver

class Bus(models.Model):
    """Bus model that extends model.Model model."""
    bus_id = models.AutoField(primary_key=True)
    bus_model = models.CharField(max_length=150)
    bus_battery_model = models.CharField(max_length=150)
    bus_battery_company = models.CharField(max_length=150)
    bus_plate_no = models.CharField(max_length=50, unique=True)
    bus_seat_no = models.IntegerField()
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name='buses')

    def __str__(self):
        return self.bus_name

    def to_dict(self):
        """
        Convert the bus object to a dictionary format.
        """
        return {
            'busId': self.bus_id,
            'busModel': self.bus_model,
            'busBatteryModel': self.bus_battery_model,
            'busBatteryCompany': self.bus_battery_company,
            'busPlateNo': self.bus_plate_no,
            'busSeatNo': self.bus_seat_no,
            'driverId': self.driver.driver_id
        }