from django.apps import AppConfig
import sys


class AppConfig(AppConfig):
    name = 'testing'

    def ready(self):
        if 'management/commands/update_traffic_info.py' not in sys.argv:
            from django.core.management import get_commands, load_command_class
            commands = get_commands()
            commands['update_traffic_info'] = 'testing.update_traffic_info'
            load_command_class('testing', 'update_traffic_info')