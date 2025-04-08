from django.db import models
from .user import User

class GarageManager(models.Model):
    """GarageManager model that extends model.Model model."""
    manager_id = models.AutoField(primary_key=True)
    manager_name = models.CharField(max_length=150)
    manager_email = models.EmailField()
    manager_no = models.CharField(max_length=50)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='garage_manager_profile')


    def __str__(self):
        return self.manager_name

    @property
    def to_dict(self):
        """
        Convert the GarageManager object to a dictionary format.
        """
        return {
            'managerId': self.manager_id,
            'managerName': self.manager_name,
            'managerEmail': self.manager_email,
            'managerNumber': self.manager_no,
            'userId': self.user.user_id
        }