build:
	docker build . -t christopher/homemaintenance

#	NAME=homemaint
#if [($(shell docker ps -a --format "{{.Names}}" ${NAME} 2> /dev/null) = homemaint)] 
#	docker stop homemaint && docker rm homemaint
	#docker run -p 49160:8000 --name homemaint -d christopher/homemaintenance
#else 
	#docker run -p 49160:8000 --name homemaint -d christopher/homemaintenance
#endif

clean:
	docker stop homemaint && docker rm homemaint

update:
	docker run -p 49160:8000 --name homemaint -d christopher/homemaintenance


