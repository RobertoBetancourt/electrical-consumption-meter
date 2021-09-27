# Control del consumo eléctrico

**Proyecto desarrollado por estudiantes del Tec de Monterrey para el control del consumo eléctrico de tus aparatos eléctricos dentro de tu casa u oficina.**


## Clonar proyecto

**En el folder donde se desea clonar el proyecto:**
git clone https://github.com/RobertoBetancourt/electrical-consumption-meter.git


## Instalaciones generales

**En el folder de electrical-consumption-meter:**
	
	sudo apt update
	sudo apt install mariadb-server
	pip install Flask
	pip install flask-jwt-extended
	pip install -U flask-cors
	pip install mysql-connector-python


## Configuración de la base de datos

**En el folder de electrical-consumption-meter:**

	sudo mysql_secure_installation
	sudo mysql -u root
	USE mysql;
	UPDATE user SET plugin='mysql_native_password' WHERE User='root';
	FLUSH PRIVILEGES;
	exit;


## Llenado de la base de datos

**En el folder de electrical-consumption-meter/Backend/DataBase:**

	sudo mysql -u root < IotDB.sql
	sudo mysql -u root < IotPA.sql
	sudo mysql -u root < DefaultData.sql


## Configuración para la simulación de datos

**En el folder de electrical-consumption-meter/Backend/simulated-data:**

	npm install
	npm start


## Configuración de API para manejo de usuarios

**En el folder de electrical-consumption-meter/Backend/API:**

	export FLASK_APP=app
	export FLASK_ENV=development
	flask run

## Configuración del front-end:

**En el folder de electrical-consumption-meter/Frontend/iotapp:**

	npm install
	npm start


## Documentación extra

* [Balsamiq](https://balsamiq.cloud/s7tpyzs/pvvjfkp/rFA12) - Mockups
* [Figma](https://www.figma.com/files/team/837081687303525522/ProyectoIntegrador) - Sketch UI
