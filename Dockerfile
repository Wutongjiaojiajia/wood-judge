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
FROM node:lts-alpine
RUN yum install -y nginx

WORKDIR /opt/app/wood

COPY . /opt/app/wood

EXPOSE 80

RUN npm install && npm run build && cp -r dist/* ./wood && rm -rf /opt/app/wood

CMD ["nginx","-g","daemon off;"]