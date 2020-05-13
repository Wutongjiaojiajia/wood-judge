# # build stage
# FROM node:lts-alpine as build-stage
# WORKDIR /app
# COPY package*.json ./
# RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
# RUN cnpm install
# COPY . .
# RUN npm run build


# # production stage
# FROM nginx:stable-alpine as production-stage
# COPY --from=build-stage /app/dist /usr/share/nginx/html
# EXPOSE 8001
# CMD ["nginx","-g","daemon off;"]

# 使用node
# FROM node:lts-alpine
# RUN yum install -y nginx

# WORKDIR /app

# COPY . /app

# EXPOSE 80

# RUN npm install && npm run build && cp -r dist/* /opt/app/wood && rm -rf /app

# CMD ["nginx","-g","daemon off;"]

FROM nginx:stable-alpine 
COPY /app/dist  /opt/app/wood
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
