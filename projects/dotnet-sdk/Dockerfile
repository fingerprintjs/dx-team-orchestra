FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /App

COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS run
WORKDIR /App

COPY --from=build /App/out .

ENV HTTP_PORTS=5243

EXPOSE 5243

ENTRYPOINT ["dotnet", "dotnet-sdk.dll"]
