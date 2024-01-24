import { Injectable } from '@angular/core';
import * as data from '../../assets/raw_pairings_no_groups.json';

@Injectable({
  providedIn: 'root'
})
export class GenerateNetworkDataService {
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

  loadData(headers?: string[]): [any[], any[]] {

    // Set headers to default to all if not specified
    let selectedHeaders: string[] = []
    if (!headers) {
      console.log("Missing headers, using all as default")
      selectedHeaders = this.loadHeaders();
    } else {
      selectedHeaders = headers
    }


    let outLinks: any[] = []
    let outNodes: any[] = []
    console.log("Using headers: " + selectedHeaders)
    selectedHeaders?.forEach(header => {

      // let node = {
      //   x: 200,
      //   y: 200,
      //   r: 1,
      //   name: header
      // }

      let node = {
        index: selectedHeaders.indexOf(header),
        name: header,
        group: 3
      }

      let pairing = this.dataObj[header]

      //Add missing headers for pairings where one was selected
      // pairing.forEach((flavour: string) => {
      //   if (!outNodes.includes(flavour)) {
      outNodes.push(node)
      //     console.log("Adding: " + flavour)
      //   }
      // })
    })

    outNodes.forEach(node => {
      let pairing = this.dataObj[node.name]

      pairing.forEach((flavour: string) => {
        // if(outNodes.indexOf(flavour))
        outLinks.push({
          // source: outNodes.findIndex(n => n.name == node.name),
          source: outNodes.findIndex(n => n.name == node.name),
          sourceStr: node.name,
          target: outNodes.findIndex(n => n.name == flavour),
          targetStr: flavour
        })

        node.r = pairing.length
        // console.log(`Attemptign to set value ${outputHeaders.indexOf(header)},${outputHeaders.indexOf(flavour)} for pairing ${header} to ${flavour}`)
        //Init empty list if missing to be able to set second ordinal values
        // if (!outMatrix[outputHeaders.indexOf(header)]) {
        //   outMatrix[outputHeaders.indexOf(header)] = Array(outputHeaders.length).fill(0)
        // }
        // if (!outMatrix[outputHeaders.indexOf(flavour)]) {
        //   outMatrix[outputHeaders.indexOf(flavour)] = Array(outputHeaders.length).fill(0)
        // }
        // outMatrix[outputHeaders.indexOf(header)][outputHeaders.indexOf(flavour)] = 1;
        // outMatrix[outputHeaders.indexOf(flavour)][outputHeaders.indexOf(header)] = 1;
      })
    })

    return [outNodes, outLinks]
  }
}
