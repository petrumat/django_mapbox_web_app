# Google Maps Web Application

## Credits

This project was started from [did_django_google_api_tutorial](https://github.com/bobby-didcoding/did_django_google_api_tutorial) from [Bobby Stearman](https://github.com/bobby-didcoding) and available at [Python Django and Google APIs - Project Tutorial](https://www.youtube.com/watch?v=_vCT42vDfgw&ab_channel=freeCodeCamp.org).

Also, the original version of my project (utilizing Google Maps APIs) can be found at [django_google_api](https://github.com/petrumat/django_google_api). Due to costs of using these APIs, I considered switching to a more affordable and as future rich alternative: [Mapbox](https://www.mapbox.com/). Other alternatives include [Apple Maps](https://developer.apple.com/maps/) and [Microsoft Azure Maps](https://www.microsoft.com/en-us/maps).

## Details

Django project that uses Google APIs to auto populate search input boxes, display maps, dynamic custom markers and info windows, monitoring live traffic data, users' events, generating alerts & reports.

## Virtual Environment and Running the code

Use following commands to get the project up and running. Working with an environment for this project is highly recommended to keep workspace organized. For ease of understanding use the following commands (applicable on Windows OS; for Unix / macOS refer to docs.python.org/../venv) in your root folder / development directory (e.g. c:\path\to\development\directory\django_mapbox_web_app):

0) *mkdir 'your_development_directory'* to create 'your_development_directory' at your selected path.
1) *cd 'your_development_directory* to select the correct development directory.
2) *git clone <https://github.com/petrumat/django_mapbox_web_app>* to clone repository to your development directory.
3) *python.exe -m pip install --upgrade pip* (**optional**) to update pip to latest version.
4) *python -m venv .project_venv* to create virtual environment. Adjust the name as you seem appropriate (e.g. *.project_venv*).
5) *.project_venv\Scripts\activate* to activate virtual environment.
6) *pip install -r requirements.txt* to recreate the virtual environment with necessary packages.
7) *pur -r .\requirements.txt* (**optional**) to update all requirements to latest versions.
8) *pip freeze > requirements.txt* (**optional**) to update requirements.txt file if you install any other python package to your virtual environment not already used in this project.
9) *cp .env_template .env* to create .env file based on .env-template file. Update all fields with your correct information.
10) *python manage.py makemigrations* to package up your model changes into individual migration files. Run this every time you make changes to data base structure or format or if needed.
11) *python manage.py migrate* to create tables, modify columns, add indexes, and performs any other database-related operations needed to reflect the changes you've made. Run this every time you make changes to data base structure or format or if needed.
12) *python manage.py runserver* to run the development server.
13) visit *<https://localhost:8000>* as the home page

In case of any error regarding package importing from VS Code refer to [How to resolve 'Import "{some_package}.contrib" could not be resolved from source' in VS Code?](https://stackoverflow.com/questions/67586182/how-to-resolve-import-django-contrib-could-not-be-resolved-from-source-in-vs) and update python interpreter path.

## Necessities

Don't forget to activate the following Google API's after you create a Google Account and activate a billing account:

- reCAPTURE
- Places API
- Maps Javascript API
- Directions API
- Distance Matrix API
- Geocoding API

As it turns out, the features provided by Google Maps APIs are not free and will have an approximate cost of $20 per month for an average of 1000 API requests (from each API, except reCAPTURE). Alternatives to [Google Maps](https://developers.google.com/maps) are: [Mapbox](https://www.mapbox.com/), [Apple Maps](https://developer.apple.com/maps/), [Microsoft Azure Maps](https://www.microsoft.com/en-us/maps), and others.

## Future Improvements

Some future improvements include:

- generate email with reset password link for accounts
- 2FA for accounts (working with Google Social Authentication)
- other social authentication: Facebook/Meta, Apple, Twitter, GitHub etc.
- adjust traffic lights (MANUAL/AUTO + time intervals) from user web page
- implement live chat functionalities

Have fun with the project (and read the LICENSE) !
