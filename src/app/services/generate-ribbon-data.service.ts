import { Injectable } from '@angular/core';
import * as data from '../../assets/raw_pairings_no_groups.json';
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

  loadData(headers?: string[], limit?: number): [string[], number[][]] {

    // Set headers to default to all if not specified
    let selectedHeaders: string[] = []
    if (!headers) {
      console.log("Missing headers, using all as default")
      selectedHeaders = this.loadHeaders();
    } else {
      // selectedHeaders.push(headers.map(h=>h)))
      selectedHeaders = JSON.parse(JSON.stringify(headers))
    }


    let outMatrix: number[][] = []
    let outputHeaders: string[] = JSON.parse(JSON.stringify(selectedHeaders))
    // console.log("Using headers: " + selectedHeaders)
    selectedHeaders?.forEach(header => {
      let pairing = this.dataObj[header]

      //Add missing headers for pairings where one was selected
      pairing.forEach((flavour: string) => {
        if (!outputHeaders.includes(flavour)) {
          outputHeaders.push(flavour)
          // console.log("Adding: " + flavour)
        }
      })
    })

    outputHeaders.forEach(header => {
      let pairing = this.dataObj[header]
      pairing.forEach((flavour: string) => {
        if (!outputHeaders.includes(flavour))
          return
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

    //Test to filter out things with < limit matches
    const filterLimit = limit || 1
    let removalIndicies: number[] = []
    outputHeaders.forEach((header, index) => {
      let count = 0
      selectedHeaders.forEach((selectedHeader, sIndex) => {
        if (outMatrix[index][sIndex] || outMatrix[sIndex][index]) {
          // console.log(`matched ${header} to ${selectedHeader}`)
          count++
        }
      })

      if (count < filterLimit && !selectedHeaders.includes(header)) {
        // console.log(`${header} has less than ${limit} pairings: ${count}, removing`)
        removalIndicies.push(index)
      }
    })

    // Do removals seperately to avoid mutating array while iterating it, update index to keep up with shrinking array
    let removalCount = 0
    removalIndicies.forEach(index => {
      // console.log(outputHeaders[index - removalCount])
      outMatrix.forEach(i => i.splice(index - removalCount, 1))
      outMatrix.splice(index - removalCount, 1)
      outputHeaders.splice(index - removalCount, 1)
      removalCount++
    })

    return [outputHeaders, outMatrix]
  }

}
