# Kavie's portfolio

A simple responsive portfolio using plain HTML, CSS, and JavaScript. Includes About and Projects views; Projects displays “Coming soon.” Content is based on the supplied résumé. No framework, build step, or external asset dependencies.

## Run with Docker

Install and start Docker Desktop (Linux containers) or Docker Engine with the Compose plugin. From this directory, run:

```sh
docker compose up --build -d
```

Open http://localhost:8080. Nginx serves the website inside the container.

Stop it with:

```sh
docker compose down
```

Alternatively, without Compose:

```sh
docker build -t kavie-portfolio .
docker run --rm -p 8080:80 kavie-portfolio
```

## Edit

- `index.html`: profile, education, experience, contact links, and Projects content.
- `styles.css`: responsive layout and colors.
- `script.js`: navigation and footer year.
- `nginx.conf`: web server configuration.

Rebuild with `docker compose up --build -d` after editing. For a quick preview without Docker, open `index.html` directly in a browser.

The Docker base image uses the stable Alpine tag. Pin it to an approved digest if reproducible deployments are required.

## Validation

JavaScript syntax and local asset references were checked. Docker was unavailable in the authoring environment, so the image build and Nginx runtime must be verified on a machine with Docker installed.
