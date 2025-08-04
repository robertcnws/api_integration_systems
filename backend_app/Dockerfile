# ./django/Dockerfile
FROM python:3.12

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --upgrade pip
RUN pip install gunicorn
RUN pip install uvicorn
RUN pip install -r requirements.txt

RUN apt-get update && apt-get install -y wget gnupg2 lsb-release 

RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
    
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/debian bookworm/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list

RUN apt-get update && apt-get install -y mongodb-database-tools

RUN apt-get update

RUN mkdir -p /tmp/mongo_backup

COPY . /app/

EXPOSE 8000


CMD ["sh", "-c", "python manage.py makemigrations --noinput && \
                  python manage.py migrate --noinput && \
                  python manage.py collectstatic --noinput && \
                  python init_scripts.py && \
                  celery -A project_integration_systems worker --loglevel=info -E & \
                  celery -A project_integration_systems beat --loglevel=info & \
                  gunicorn project_integration_systems.asgi:application -w 3 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000"]
