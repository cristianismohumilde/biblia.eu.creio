FROM python:3.15-rc-alpine3.23

WORKDIR /var/app

COPY morphhbXML-to-JSON.py /var/app
COPY wlc /var/app/wlc

ENTRYPOINT ["python", "morphhbXML-to-JSON.py"]
