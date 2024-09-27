from colorama import init, Fore
import os, sys, django

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main_app.settings')
django.setup()

from users.models import TrafficInfo, TrafficLight, GenerateAlert, GenerateReport
import users.utils as utils

init(autoreset=True)


def main():
    command = input('What type of marker to add in db model? ')
    match command:
        case 'traffic_info' | 'traffic info' | 'ti' | 'traffic':
            add_traffic_info_marker()
        case 'traffic_light' | 'traffic light' | 'tl' | 'light':
            add_traffic_light_marker()
        case 'generate_alert' | 'generate alert' | 'ga' | 'alert':
            add_generate_alert_marker()
        case 'generate_report' | 'generate report' | 'gr' | 'report':
            add_generate_report_marker()
        case 'all':
            add_traffic_info_marker()
            add_traffic_light_marker()
            add_generate_alert_marker()
            add_generate_report_marker()
        case _:
            print(Fore.YELLOW + f'Select a marker to add to model.')


def add_traffic_info_marker():
    lat = 44.3897315582826
    lng = 26.233756329588047
    zone = "Glina"
    density = 150
    med_speed = 45
    lights = False
    cameras = False
    signs = False
    incidents = False
    accidents = False
    alerts = utils.update_traffic_info_alert(lights, cameras, signs, incidents, accidents)
    alert_content = utils.update_traffic_info_alert_content(lights, cameras, signs, incidents, accidents)
    ariaLabel = zone + " Traffic Data"
    icon = utils.update_traffic_info_icon(accidents, alerts)
    title = ariaLabel

    marker = TrafficInfo(lat=lat, lng=lng, zone=zone, density=density, med_speed=med_speed, lights=lights, cameras=cameras, signs=signs, incidents=incidents, accidents=accidents, alerts=alerts, alert_content=alert_content, ariaLabel=ariaLabel, icon=icon, title=title)

    try:
        marker.save()
    except:
        sys.exit(f"Couldn't add traffic marker {marker.pk}")

    print(Fore.GREEN + f"Added traffic marker {marker.pk}")


def add_traffic_light_marker():
    lat = 44.38228260367132
    lng = 25.988554673788016
    zone = "Bragadiru"
    orientation = "SE"
    functioning = False
    function_error = "" if functioning else "Green Light Error"
    program = "AUTO" if functioning else "MANUAL"
    time_red = 200
    time_yellow = 10
    time_green = 300
    error = "" if functioning else "Traffic Light Malfunction\nManual Control Only"
    ariaLabel = zone + " Traffic Light Control"
    title = ariaLabel

    marker = TrafficLight(lat=lat, lng=lng, zone=zone, orientation=orientation, functioning=functioning, function_error=function_error, program=program, time_red=time_red, time_yellow=time_yellow, time_green=time_green, error=error, ariaLabel=ariaLabel, title=title)

    try:
        marker.save()
    except:
        sys.exit(f"Couldn't add light marker {marker.pk}")

    print(Fore.GREEN + f"Added light marker {marker.pk}")


def add_generate_alert_marker():
    lat = 44.376444496762005
    lng = 26.118174531308174
    zone = "Grand Arena"
    speed = 20
    alert = "Road under Construction - Drive Carefully"
    content = zone + " Alert & Notification"
    ariaLabel = content
    title = ariaLabel

    marker = GenerateAlert(lat=lat, lng=lng, zone=zone, speed=speed, alert=alert, content=content, ariaLabel=ariaLabel, title=title)

    try:
        marker.save()
    except:
        sys.exit(f"Couldn't add alert marker {marker.pk}")

    print(Fore.GREEN + f"Added alert marker {marker.pk}")


def add_generate_report_marker():
    dev = 0.02
    
    lat = 44.494100162960486
    lng = 26.174002017900754
    zone = "Voluntari"
    link = f'generateReport?Lat={lat}&Lng={lng}&Dev={dev}'
    content = zone + " Report"
    ariaLabel = content
    title = ariaLabel

    marker = GenerateReport(lat=lat, lng=lng, zone=zone, link=link, content=content, ariaLabel=ariaLabel, title=title)

    try:
        marker.save()
    except:
        sys.exit(f"Couldn't add report marker {marker.pk}")

    print(Fore.GREEN + f"Added report marker {marker.pk}")


if __name__ == "__main__":
    main()