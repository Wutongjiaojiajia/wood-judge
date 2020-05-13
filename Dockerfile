FROM nginx:stable-alpine 
COPY ./dist  /opt/app/wood
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
