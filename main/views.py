from django.shortcuts import render, redirect, reverse
from django.conf import settings

from main_app.mixins import Directions
'''
Basic view for routing 
'''
def route(request):

	context = {
	"mapbox_public_token": settings.MAPBOX_PUBLIC_TOKEN,
	"mapbox_access_token": settings.MAPBOX_ACCESS_TOKEN,
	"base_country": settings.BASE_COUNTRY}
	return render(request, 'main/route.html', context)


'''
Basic view for displaying a map 
'''
def map(request):

    # lat_a/long_a is the starting point
	lat_a = request.GET.get("lat_a", None)
	long_a = request.GET.get("long_a", None)
	
    # lat_b/long_b is the destination point
	lat_b = request.GET.get("lat_b", None)
	long_b = request.GET.get("long_b", None)
	
    # lat_c/long_c and lat_d/long_d are way points
	lat_c = request.GET.get("lat_c", None)
	long_c = request.GET.get("long_c", None)
	lat_d = request.GET.get("lat_d", None)
	long_d = request.GET.get("long_d", None)


	#only call API if all 4 addresses are added
	if lat_a and lat_b and lat_c and lat_d:
		directions = Directions(
			lat_a= lat_a,
			long_a=long_a,
			lat_b = lat_b,
			long_b=long_b,
			lat_c= lat_c,
			long_c=long_c,
			lat_d = lat_d,
			long_d=long_d
		)
	else:
		return redirect(reverse('main:route'))

	context = {
		"mapbox_public_token": settings.MAPBOX_PUBLIC_TOKEN,
		"mapbox_access_token": settings.MAPBOX_ACCESS_TOKEN,
		"base_country": settings.BASE_COUNTRY,
		"lat_a": lat_a,
		"long_a": long_a,
		"lat_b": lat_b,
		"long_b": long_b,
		"lat_c": lat_c,
		"long_c": long_c,
		"lat_d": lat_d,
		"long_d": long_d,
		"origin": f'{lat_a}, {long_a}',
		"destination": f'{lat_b}, {long_b}',
		"directions": directions,
	}
	
	return render(request, 'main/map.html', context)


'''
Traffic info view 
'''
def traffic_info(request):

	context = {
		"mapbox_public_token": settings.MAPBOX_PUBLIC_TOKEN,
		"mapbox_access_token": settings.MAPBOX_ACCESS_TOKEN,
		"base_country": settings.BASE_COUNTRY,
	}

	return render(request, 'main/traffic_info.html', context)


'''
Generate alerts view 
'''
def generate_alerts(request):

	context = {
		"mapbox_public_token": settings.MAPBOX_PUBLIC_TOKEN,
		"mapbox_access_token": settings.MAPBOX_ACCESS_TOKEN,
		"base_country": settings.BASE_COUNTRY,
	}

	return render(request, 'main/generate_alerts.html', context)


'''
Traffic lights view 
'''
def traffic_lights(request):

	context = {
		"mapbox_public_token": settings.MAPBOX_PUBLIC_TOKEN,
		"mapbox_access_token": settings.MAPBOX_ACCESS_TOKEN,
		"base_country": settings.BASE_COUNTRY,
	}

	return render(request, 'main/traffic_lights.html', context)

'''
Generate reports view 
'''
def generate_reports(request):

	context = {
		"mapbox_public_token": settings.MAPBOX_PUBLIC_TOKEN,
		"mapbox_access_token": settings.MAPBOX_ACCESS_TOKEN,
		"base_country": settings.BASE_COUNTRY,
	}

	return render(request, 'main/generate_reports.html', context)
