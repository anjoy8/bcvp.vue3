FROM nginx
MAINTAINER vueadmin3
ADD dist /usr/share/nginx/html
ADD vueadmin3.nginx.conf /etc/nginx/nginx.conf
RUN chown nginx:nginx -R /usr/share/nginx/html
EXPOSE 80
RUN echo 'build admin image successful!!'
