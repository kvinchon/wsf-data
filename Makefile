start:
	xterm -e 'make server' &
	xterm -e 'make client'

server:
	cd api/ && npm run start

client:
	cd front/ && npm run serve