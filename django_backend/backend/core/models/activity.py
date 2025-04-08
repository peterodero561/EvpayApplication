from django.db import models
from .user import User

class Activity(models.Model):
    """
    Activity model that extends model.Model model.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    description = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Activity {self.activity_id} - {self.activity_type} by {self.user.user_name}'

    @property
    def to_dict(self):
        """
        Convert the Activity object to a dictionary format.
        """
        return {
            'id': self.id,
            'description': self.description,
            'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }