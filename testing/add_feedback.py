from colorama import init, Fore
import os, sys, django

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main_app.settings')
django.setup()

from users.models import User, Feedback

init(autoreset=True)


def main():
    # add_feedback()
    # remove_feedback()
    print(Fore.YELLOW + f'Select action: add/remove feedback.')


def add_feedback():
    user = User.objects.all()[0]
    title = "Colors to bright"
    description = "A dark mode is useful for the app."
    photo = ""

    feedback = Feedback(user=user, title=title, description=description)
    feedback.save()

    print(Fore.GREEN + f"Added feedback {feedback.pk}")


def remove_feedback():
    pk = 8

    feedback = Feedback.objects.get(pk=pk)
    feedback.delete()

    print(Fore.GREEN + f"Removed feedback {pk}")


if __name__ == "__main__":
    main()