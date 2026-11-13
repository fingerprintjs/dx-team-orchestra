FROM golang:1.26.11-alpine

WORKDIR /app

COPY . .

RUN go mod tidy

RUN go build -o myapp .

EXPOSE 8081

CMD ["./myapp"]
