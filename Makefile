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

run:
	docker run -v ~/Workspace/HomeMaintenance/src/app/data:/src/app/data -p 49160:8000 --restart unless-stopped --name homemaint -d christopher/homemaintenance

update:
	docker stop homemaint && docker rm homemaint
	docker build . -t christopher/homemaintenance
	docker run -v ~/Workspace/HomeMaintenance/src/app/data:/src/app/data -p 49160:8000 --restart unless-stopped --name homemaint -d christopher/homemaintenance
