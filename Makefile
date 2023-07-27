upgrade:
	docker build . -t christopher/homemaintenance
	stopByPort.sh 8000
	docker run -p 49160:8000 -d christopher/homemaintenance
