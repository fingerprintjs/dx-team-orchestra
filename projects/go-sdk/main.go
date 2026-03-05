package main

import (
	"fmt"
	"go-sdk/handlers"
	handlersv4 "go-sdk/handlers/v4"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/getEvents", handlers.GetEvents)
	http.HandleFunc("/updateEvent", handlers.UpdateEvent)
	http.HandleFunc("/searchEvents", handlers.SearchEvents)

	http.HandleFunc("/getVisits", handlers.GetVisits)
	http.HandleFunc("/deleteVisitorData", handlers.DeleteVisitorData)

	http.HandleFunc("/getRelatedVisitors", handlers.GetRelatedVisitors)

	http.HandleFunc("/unseal", handlers.Unseal)

	// v4
	http.HandleFunc("/v4/deleteVisitorData", handlersv4.DeleteVisitorData)
	http.HandleFunc("/v4/searchEvents", handlersv4.SearchEvents)
	http.HandleFunc("/v4/updateEvent", handlersv4.UpdateEvent)
	http.HandleFunc("/v4/getEvent", handlersv4.GetEvent)
	http.HandleFunc("/v4/unseal", handlersv4.Unseal)

	fmt.Println("Server is running on port 8081...")
	if err := http.ListenAndServe(":8081", nil); err != nil {
		log.Fatal(err)
	}
}
