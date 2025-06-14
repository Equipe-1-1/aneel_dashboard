# Team 1-2
---

## Summary
- [Requirements](#requirements)
- [Initial Setup](#setup)
	+ [UV](#uv-install)
	+ [Virtual Enviroment](#venv-setup)
	+ [Libraries](#libs-install)
- [Database manipulations through polars](#polars-database)

---
## Requirements <a name="requirements"></a>

- Python 	=> 3.12.3
- Docker 	=> 28.1.1
- uv 		=> 0.6.14
- Git		=> 2.43.0

## Initial Setup <a name="setup"></a>
### 1. UV
There are three official ways to install the UV (the package manager) and they can be found on its [documentation](https://docs.astral.sh/uv/getting-started/installation/#pypi). But for linux standalone installer can be done with:
`$ curl -LsSf https://astral.sh/uv/0.6.14/install.sh | sh`.

After installed the UV, run the command `uv sync` to synchronise the project configurations.

### 2. Virtual Environment <a name="virtual-environment"></a>
To initialize the venv environment execute the command:
```bash
$ source .venv/bin/activate
```
After that, each input line on the terminal during the session is going to begin with ```(environment name)```. <br/>
To disable the virtual environment of the session, execute:
```bash
(environment name) $ deactivate
```

### 3. Front-end
To start for the first time the the application front-end, simply go to the aneel-frontend and execute:
```bash
$ docker compose up -d && docker exec -it aneel-front bash
```

After that you will be inside the docker and should simply run the following code to start the front-end on `172.24.0.2:3000`:

```bash
$ npm install && npm run dev
```

After that, you can stop the front-end service pressing `ctrl + c`. <br/>
To get out the container context press "cntr + d".

To stop the docker container run `docker stop aneel-front`. To remove it use `docker rm aneel-front`.

After this you will need to start the front-end from the start of the instructions. To see all containers currently existing, execute:
```bash
$ docker ps -a
```