FROM docker.io/library/nginx:1.23-alpine

COPY dist/frontend/ /usr/share/nginx/html/frontend/

COPY nginx.conf /etc/nginx/nginx.conf

COPY ssl.conf /etc/nginx/conf.d/ssl.conf

RUN mkdir -p /etc/nginx/logs/

RUN rm -rf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
