docker run --name my-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=mydb -p 5432:5432 -d postgres

docker run -p 8080:8080 --rm -v $(pwd):/app -v /app/tmp --name my-golang-air my-golang-backend
