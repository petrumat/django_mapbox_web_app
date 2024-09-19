from colorama import init, Fore
import os, sys, django

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main_app.settings')
django.setup()

from users.models import User

init(autoreset=True)


def main():
    # add_user("", "", False, False)
    # remove_user(0)
    print(Fore.YELLOW + f'Select action: add/remove user.')


def add_user(username:str="", password:str="", is_superuser:bool=False, is_staff:bool=False):
    user = User.objects.create_user(username=username, password=password, is_superuser=is_superuser, is_staff=is_staff)

    print(Fore.GREEN + f"Added user {user.pk}")


def remove_user(pk:int=0):
    user = User.objects.get(pk=pk)
    user.delete()

    print(Fore.GREEN + f"Removed user {pk}")


if __name__ == "__main__":
    main()