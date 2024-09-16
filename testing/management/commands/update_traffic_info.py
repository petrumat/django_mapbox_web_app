from django.core.management.base import BaseCommand
from users.models import TrafficInfo
import random

class Command(BaseCommand):
    help = 'Updates TrafficInfo model fields periodically'

    def handle(self, *args, **kwargs):
        # Example of updating the density and med_speed fields
        traffic_infos = TrafficInfo.objects.all()
        for info in traffic_infos:
            info.density = random.randint(1, 100)  # Replace with your logic
            info.med_speed = random.randint(1, 80)  # Replace with your logic
            info.save()
        self.stdout.write(self.style.SUCCESS('Successfully updated TrafficInfo fields'))