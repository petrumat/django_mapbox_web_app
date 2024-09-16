from .models import TrafficInfo, TrafficLight, GenerateAlert, GenerateReport
import random



# Traffic Info Map functions

def update_traffic_info_data():
    traffic_infos = TrafficInfo.objects.all()
    for info in traffic_infos:
        info.density = 150 + random.randint(-10, 10)
        info.med_speed = 45 + random.randint(-10, 10)

        # info.lights = bool(random.getrandbits(1))
        # info.cameras = bool(random.getrandbits(1))
        # info.signs = bool(random.getrandbits(1))
        # info.incidents = bool(random.getrandbits(1))
        # info.accidents = bool(random.getrandbits(1))

        info.alerts = update_traffic_info_alert(info.lights, info.cameras, info.signs, info.incidents, info.accidents)
        
        info.alert_content = update_traffic_info_alert_content(info.lights, info.cameras, info.signs, info.incidents, info.accidents)
        
        info.icon = update_traffic_info_icon(info.accidents, info.alerts)

        info.save()


def update_traffic_info_alert(lights, cameras, signs, incidents, accidents):
    return lights or cameras or signs or incidents or accidents

def update_traffic_info_alert_content(lights, cameras, signs, incidents, accidents):
    content = ""
    
    if lights:
        content = content + "Damaged light."
    if cameras:
        content = content + " Damaged Camera."
    if signs:
        content = content + " Damaged Sign."
    if incidents:
        content = content + " Road under Construction."
    if accidents:
        content = content + " Car Accident."

    return content

def update_traffic_info_icon(accidents, alerts):
    if accidents:
        return "red"
    else:
        if alerts:
            return "yellow"
    return "green"



# Traffic Lights Map functions

def update_traffic_lights_data():
    traffic_lights = TrafficLight.objects.all()
    for light in traffic_lights:
        # light.functioning = bool(random.getrandbits(1))
        
        # if light.functioning:
        #     light.function_error = ""
        # else:
        #     light.function_error = update_traffic_lights_function_error()

        light.program = "AUTO" if light.functioning else "MANUAL"

        if light.program == "AUTO": 
            light.time_red = random.randrange(240, 300, 5)
            light.time_yellow = random.randint(5, 10)
            light.time_green = random.randrange(400, 500, 50)
            light.error = ""
        else:
            light.error = "Traffic Light Malfunction - Manual Control Only"

        light.save()


def update_traffic_lights_function_error():
    match random.randint(1, 3):
        case 1:
            return "Green Light Error"
        case 2:
            return "Yellow Light Error"
        case 3:
            return "Red Light Error"
        case _:
            return ""
        


# Generate Alerts Map functions

def update_generate_alerts_data():
    return
        


# Generate Reports Map functions

def update_generate_reports_data():
    dev = 0.02
    reports = GenerateReport.objects.all()

    for report in reports:
        report.link = f'generateReport?Lat={report.lat}&Lng={report.lng}&Dev={dev}'

        report.save()