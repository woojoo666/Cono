# README.md

## 0. First time setup

1. Set up virtualenv

This will download all the python dependencies

```
mkdir virtualenv
virtualenv cono
cd cono/bin
source ./activate
pip install -r requirements.txt
```

2. Initialize environment variables. Preferably, you would add this to your ~/.bashrc

```
export LC_ALL=C.UTF-8
export LANG=C.UTF-8
export FLASK_APP=server.py
```

## 1. Activate virtualenv

This is for dependency management. Please only install packages in this virtualenv. Currently, at python 3.5.3

1. go to virtualenv/cono/bin
2. source ./activate

## 2. Run server

1. Make sure that your environment variables are set up correctly (see step 0.2)

2. Go to server/

3. Start the server binary 
```
python -m flask run --host=0.0.0.0
```

# 3. Basic usage

localhost:5000/read?tag=Taylor%20Swift
localhost:5000/write?tag=Taylor%20Swift&entity="https://www.taylorswift.com"

If you're directly typing this into a Chrome URL Bar, Chrome should automatically convert spaces into %20, so you can also do the following:

localhost:5000/read?tag=Taylor Swift
localhost:5000/write?tag=Taylor Swift&entity="https://www.taylorswift.com"
