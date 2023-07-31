docker build . -t christopher/homemaintenance

docker run -p 49160:8000 -d christopher/homemaintenance


docker -dit run -p 49160:8000 -d  christopher/homemaintenance


Zyxel Router settings:

Network Setting -> Broadband -> ADSL/VDSL/ETHWAN -> Use the following static DNS to Pi address (192.168.1.160)

Network Setting -> Home Networking -> Static DHCP ->  Configure Pihole with a static DHCP

Network Setting -> DNS -> -> DNS Entry -> Host/IP of Pi
