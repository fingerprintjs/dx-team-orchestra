package main

import (
	"fmt"
	"go-sdk/handlers/v3"
	handlersv4 "go-sdk/handlers/v4"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/getEvents", handlersv3.GetEvents)
	http.HandleFunc("/updateEvent", handlersv3.UpdateEvent)
	http.HandleFunc("/searchEvents", handlersv3.SearchEvents)
	http.HandleFunc("/getVisits", handlersv3.GetVisits)
	http.HandleFunc("/deleteVisitorData", handlersv3.DeleteVisitorData)
	http.HandleFunc("/getRelatedVisitors", handlersv3.GetRelatedVisitors)
	http.HandleFunc("/unseal", handlersv3.Unseal)

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
