from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import UserProfile
import logging

logging.basicConfig(level=logging.INFO)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
	if created:
		logging.info(f"Creating profile for user {instance.username}")
		UserProfile.objects.create(user=instance)
		
@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
	try:
		logging.info(f"Saving profile for user {instance.username}")
		instance.userprofile.save()
	except UserProfile.DoesNotExist:
		logging.warning(f"UserProfile for user {instance.username} not found, creating new one")
		UserProfile.objects.create(user=instance)