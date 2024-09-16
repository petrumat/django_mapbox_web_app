from django.apps import AppConfig
import sys


class UsersTutorialConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "users"

    def ready(self):
        import users.signals


class AppConfig(AppConfig):
    name = 'app'

    def ready(self):
        if 'testing/update_traffic_info.py' not in sys.argv:
            from django.core.management import get_commands, load_command_class
            commands = get_commands()
            commands['update_traffic_info'] = 'testing.update_traffic_info'
            load_command_class('testing', 'update_traffic_info')