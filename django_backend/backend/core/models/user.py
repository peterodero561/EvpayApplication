from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    """
    Custom user manager for User model.
    """
    def create_user(self, email, password=None, **extra_fields):
        """
        Create and return a user with an email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and return a superuser with an email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    """
    Custom user model that extends AbstractUser.
    """
    class Role(models.TextChoices):
        DRIVER = 'driver', _('Driver')
        PASSENGER = 'passenger', _('Passenger')
        MANAGER = 'manager', _('Manager')
        ADMIN = 'admin', _('Admin')


    username = None  # Remove the username field

    user_id = models.AutoField(primary_key=True)  # Use AutoField for user_id
    email = models.EmailField(_('email address'), unique=True)  # Use email as the unique identifier
    user_name = models.CharField(max_length=150)
    user_role = models.CharField(max_length=20, choices=Role.choices, default=Role.PASSENGER)
    user_profile_pic = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    # set email as the username field
    USERNAME_FIELD = 'email'  # Set email as the username field
    REQUIRED_FIELDS = ['user_name']  # No other required fields

    #Assign custom user manager
    objects = UserManager()

    def __str__(self):
        return self.user_name

    @property
    def to_dict(self):
        """
        Convert the user object to a dictionary format.
        """
        return {
            'userId': self.user_id,
            'userName': self.user_name,
            'userEmail': self.email,
            'userRole': self.user_role,
            'userProfilePic': self.user_profile_pic.url if self.user_profile_pic else None
        }