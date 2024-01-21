import { Injectable } from '@angular/core';
import * as data from '../assets/raw_pairings_no_groups.json';
@Injectable({
  providedIn: 'root'
})
export class GenerateRibbonDataService {

  private dataObj: any

  constructor() {
    this.dataObj = Object.assign(data)
  }

  loadHeaders(): string[] {
    //This adds a 'default' to the end, pop to remove it
    let headers = Object.keys(data)
    headers.pop()
    return headers
  }

  loadData(headers?: string[]): [string[], number[][]] {

    // Set headers to default to all if not specified
    let selectedHeaders: string[] = []
    if (!headers) {
      console.log("Missing headers, using all as default")
      selectedHeaders = this.loadHeaders();
    } else {
      selectedHeaders = headers
    }


    let outMatrix: number[][] = []
    let outputHeaders: string[] = selectedHeaders
    console.log("Using headers: " + selectedHeaders)
    selectedHeaders?.forEach(header => {
      let pairing = this.dataObj[header]

      //Add missing headers for pairings where one was selected
      pairing.forEach((flavour: string) => {
        if (!outputHeaders.includes(flavour)) {
          outputHeaders.push(flavour)
          console.log("Adding: " + flavour)
        }
      })
    })

    selectedHeaders?.forEach(header => {
      let pairing = this.dataObj[header]
      pairing.forEach((flavour: string) => {

        // console.log(`Attemptign to set value ${outputHeaders.indexOf(header)},${outputHeaders.indexOf(flavour)} for pairing ${header} to ${flavour}`)
        //Init empty list if missing to be able to set second ordinal values
        if (!outMatrix[outputHeaders.indexOf(header)]) {
          outMatrix[outputHeaders.indexOf(header)] = Array(outputHeaders.length).fill(0)
        }
        if (!outMatrix[outputHeaders.indexOf(flavour)]) {
          outMatrix[outputHeaders.indexOf(flavour)] = Array(outputHeaders.length).fill(0)
        }
        outMatrix[outputHeaders.indexOf(header)][outputHeaders.indexOf(flavour)] = 1;
        outMatrix[outputHeaders.indexOf(flavour)][outputHeaders.indexOf(header)] = 1;
      })
    })

    return [outputHeaders, outMatrix]
  }

}
