import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiKey=environment.apiKey
  baseUrl=environment.baseUrl
  constructor(private http:HttpClient) { }


  getAllEvents(keyword?:any,country?:any) {
    let url = this.baseUrl + 'events.json?apikey=' + this.apiKey
    if(keyword) {
      url = url + '&keyword=' + keyword
    }
    if(country) {
      url = url + '&countryCode=' + country
    }
    return this.http.get(url).toPromise()
  }

  getEventById(id?:any) {
    let url = this.baseUrl + 'events/' + id + '.json?apikey=' + this.apiKey
    return this.http.get(url).toPromise()
  }


  getAllAttractions(keyword?:any,country?:any) {
    let url = this.baseUrl + 'attractions.json?apikey=' + this.apiKey
    if(keyword) {
      url = url + '&keyword=' + keyword
    }
    if(country) {
      url = url + '&countryCode=' + country
    }
    return this.http.get(url).toPromise()

  }

  getAttractionById(id?:any) {
    let url = this.baseUrl + 'attractions/' + id + '.json?apikey=' + this.apiKey
    return this.http.get(url).toPromise()
  }


  getAllVenues(keyword?:any,country?:any) {
    let url = this.baseUrl + 'venues.json?apikey=' + this.apiKey
    if(keyword) {
      url = url + '&keyword=' + keyword
    }
    if(country) {
      url = url + '&countryCode=' + country
    }
    return this.http.get(url).toPromise()

  }

  getVenueById(id?:any) {
    let url = this.baseUrl + 'venues/' + id + '.json?apikey=' + this.apiKey
    return this.http.get(url).toPromise()
  }

}
