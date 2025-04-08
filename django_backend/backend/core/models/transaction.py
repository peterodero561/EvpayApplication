from django.db import models
from django.utils.timezone import now

class Transaction(models.Model):
    """
    Transaction model that extends model.Model model.
    """
    checkout_request_id = models.CharField(max_length=255, unique=True)
    amount = models.FloatField()
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    status = models.CharField(max_length=50, default='pending')
    result_code = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Transaction {self.checkout_request_id} - {self.status}'