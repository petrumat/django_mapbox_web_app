import os
import django
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from django.core.management import call_command, get_commands

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

def update_traffic_info():
    # List available commands for debugging
    # available_commands = get_commands()
    # print(f"Available commands: {available_commands}")
    call_command('update_traffic_info')

scheduler = BackgroundScheduler()
scheduler.start()
scheduler.add_job(
    update_traffic_info,
    trigger=IntervalTrigger(minutes=0.25),  # Adjust the interval as needed
    id='update_traffic_info_job',
    name='Update TrafficInfo every 0.25 minutes',
    replace_existing=True
)

# Shut down the scheduler when exiting the app
import atexit
atexit.register(lambda: scheduler.shutdown())