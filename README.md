docker build . -t christopher/homemaintenance

docker run -p 49160:8000 -d christopher/homemaintenance


docker -dit run -p 49160:8000 -d  christopher/homemaintenance
