# README.md

## 1. Activate virtualenv

This is for dependency management. Please only install packages in this virtualenv. Currently, at python 3.5.3

1. go to virtualenv/max/bin
2. source ./activate


## 2. Run server

1. Initialize environment variables
```
export LC_ALL=C.UTF-8
export LANG=C.UTF-8
export FLASK_APP=server.py
```

2. go to server/

3. Start the server binary 
```
python -m flask run --host=0.0.0.0
```

