FROM nginx:1.17.6-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY /include.forwarded /etc/nginx/app/include.forwarded
COPY /dev.conf /etc/nginx/conf.d