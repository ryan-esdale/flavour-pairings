import { Injectable } from '@angular/core';
// import * as data from '../../assets/raw_pairings_no_groups.json';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flavour, Pairing } from './_interfaces';


@Injectable({
  providedIn: 'root'
})
export class GenerateRibbonDataService {

  private dataObj: any
  private headers: Flavour[] = []
  private pairings: Pairing[] = []
  public loadingHeaders: boolean = true
  public loadingPairings: boolean = true

  constructor(private http: HttpClient) {
    this.loadHeaders();
    this.loadPairings();
  }

  loadIDs(): Observable<any> {
    return this.http.get<any>(`https://xez3vj4rs1.execute-api.eu-west-2.amazonaws.com/Test/flavours`)
  }

  loadHeaders(): Observable<Flavour[]> {

    let data: Observable<Flavour[]> = this.http.get<Flavour[]>(`https://xez3vj4rs1.execute-api.eu-west-2.amazonaws.com/Test/flavours`)
    data.subscribe(
      (values) => this.headers = values, null, () => this.loadingHeaders = false
    )
    return data

  }

  loadPairings(): Observable<Pairing[]> {

    let data: Observable<Pairing[]> = this.http.get<Pairing[]>(`https://xez3vj4rs1.execute-api.eu-west-2.amazonaws.com/Test/pairings`)
    data.subscribe(
      (values) => this.pairings = values, null, () => this.loadingPairings = false
    )
    return data
  }

  loadData(headers?: Flavour[], limit?: number): [string[], number[][]] {

    // Set headers to default to all if not specified
    let selectedHeaders: Flavour[] = []
    if (!headers) {
      console.log("Missing headers, using all as default")
      selectedHeaders = this.headers
    } else {
      // selectedHeaders.push(headers.map(h=>h)))
      selectedHeaders = JSON.parse(JSON.stringify(headers))
    }


    let outMatrix: number[][] = []
    let outputHeaders: Flavour[] = []
    console.log("Using headers: " + selectedHeaders.map((f) => f.name))
    let allPairings: Pairing[] = []
    allPairings = this.pairings
    // console.log(allPairings.length)
    // console.log("Before missing re-added", selectedHeaders)
    outputHeaders.push(...selectedHeaders)
    //Add missing headers for pairings where one was selected
    allPairings.forEach(
      (p) => {
        selectedHeaders.forEach(
          (h) => {
            if (p.primary_flavour_id == h.id) {
              let secondary = this.headers.find(s => s.id == p.secondary_flavour_id)
              if (!secondary)
                return
              if (!outputHeaders.includes(secondary))
                outputHeaders.push(secondary)
            }
            else if (p.secondary_flavour_id == h.id) {
              let primary = this.headers.find(s => s.id == p.primary_flavour_id)
              if (!primary)
                return
              if (!outputHeaders.includes(primary))
                outputHeaders.push(primary)
            }
          }
        )
      })
    // console.log("After missing re-added", outputHeaders)

    let outputPairings = this.pairings.filter(
      (p) => {
        return outputHeaders.map(h => h.id).includes(
          p.primary_flavour_id
        ) || outputHeaders.map(h => h.id).includes(
          p.secondary_flavour_id
        )
      })

    // console.log(outputPairings)

    outputPairings.forEach((pairing: Pairing) => {
      let primaryIndex = outputHeaders.findIndex(h => h.id == pairing.primary_flavour_id)
      let secondaryIndex = outputHeaders.findIndex(h => h.id == pairing.secondary_flavour_id)
      if (primaryIndex < 0 || secondaryIndex < 0)
        return
      // console.log("P: " + primaryIndex + " (" + selectedHeaders[primaryIndex].name + ") S: " + secondaryIndex + " (" + selectedHeaders[secondaryIndex].name)
      // console.log("P: " + primaryIndex + "(" + pairing.primary_flavour_id + ") S: " + secondaryIndex + "(" + pairing.secondary_flavour_id + ")")
      // if (!outputHeaders.includes(flavour))
      // return
      // console.log(`Attemptign to set value ${outputHeaders.indexOf(header)},${outputHeaders.indexOf(flavour)} for pairing ${header} to ${flavour}`)
      //Init empty list if missing to be able to set second ordinal values
      if (!outMatrix[primaryIndex]) {
        outMatrix[primaryIndex] = Array(outputHeaders.length).fill(0)
      }
      if (!outMatrix[secondaryIndex]) {
        outMatrix[secondaryIndex] = Array(outputHeaders.length).fill(0)
      }
      outMatrix[primaryIndex][secondaryIndex] = 1;
      outMatrix[secondaryIndex][primaryIndex] = 1;
    })

    // console.log(outMatrix)



    //TODO: Re add the below

    //Test to filter out things with < limit matches
    const filterLimit = limit || 1
    let removalIndicies: number[] = []
    outputHeaders.forEach((header, index) => {
      let count = 0
      selectedHeaders.forEach((selectedHeader, sIndex) => {
        // if (index == 0 || sIndex == 0)
        // return

        if (outMatrix[index][sIndex] || outMatrix[sIndex][index]) {
          // console.log(`matched ${header.name} to ${selectedHeader.name}`)
          count++
        }
      })

      if (count < filterLimit && !selectedHeaders.includes(header)) {
        // console.log(`${header.name} has less than ${limit} pairings: ${count}, removing`)
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

    // console.log(outputHeaders)

    return [outputHeaders.flatMap(m => m.name), outMatrix]
  }

}
