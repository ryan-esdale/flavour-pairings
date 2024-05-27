import { Component } from '@angular/core';
import * as d3 from 'd3';
import { GenerateRibbonDataService } from '../services/generate-ribbon-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pie.component.html',
  styleUrl: './pie.component.css'
})
export class PieComponent {

  private width = 928;
  private height = this.width;


  private data: number[][] = [];
  public names: string[] = [];
  private colors = ["#c4c4c4", "#69b40f", "#ec1d25", "#c8125c", "#008fc8", "#10218b", "#134b24", "#737373", "#ea1b25", "#c2123c"];

  public nameInput: string = '';
  public availableNames: string[] = []
  public selectedNames: string[] = ['Orange', 'Chocolate', 'Allspice', 'Peppercorn']
  public filterLimit: number = 2
  private svg: any;
  // private chordGroup: any;
  private ribbonGroup: any;
  private arcGroup: any;
  private labelGroup: any;


  private outerRadius = Math.min(this.width, this.height) * 0.5 - 60;
  private innerRadius = this.outerRadius - 10;

  private tickStep = d3.tickStep(0, d3.sum(this.data.flat()), 100);
  private formatValue = d3.format(".1~%");

  private chord = d3.chord()
    .padAngle(10 / this.innerRadius)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending)

  private arc = d3.arc()
    .innerRadius(this.innerRadius)
    .outerRadius(this.outerRadius);

  private ribbon = d3.ribbon()
    .radius(this.innerRadius - 1)
    .padAngle(1 / this.innerRadius)

  private color = d3.scaleOrdinal(this.names, this.colors);

  constructor(private service: GenerateRibbonDataService) { }

  ngOnInit(): void {
    this.availableNames = this.service.loadHeaders();
    const dat = this.service.loadData(this.selectedNames, this.filterLimit)
    this.names = dat[0]
    this.data = dat[1]
    this.createSvg();
    this.updateChords()
  }

  public addHeader(header: string) {
    if (this.selectedNames.includes(header))
      return
    this.selectedNames.push(header)
    this.refreshData();
    console.log(this.selectedNames)
  }

  public removeHeader(header: string) {
    const index = this.selectedNames.indexOf(header)
    if (index >= 0)
      this.selectedNames.splice(index, 1)
    this.refreshData()
  }

  public clearHeaders() {
    this.selectedNames = []
    this.filterLimit = 1
    this.refreshData();
  }

  public refreshData() {
    let dat = this.service.loadData(this.selectedNames, this.filterLimit)
    this.names = dat[0]
    this.data = dat[1]
    this.updateChords()
  }

  private createSvg(): void {

    this.svg = d3.select("figure#chart")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", [-this.width / 2, -this.height / 2, this.width, this.height])
      .attr("style", "width: 100%; height: auto; font: 10px sans-serif;")
    const wrapper = this.svg.append("g");
    this.ribbonGroup = wrapper.append("g").attr("id", "ribbons")
    this.arcGroup = wrapper.append("g").attr("id", "arcs")
    this.labelGroup = wrapper.append("g").attr("id", "labels")
  }

  private updateChords(): void {
    const duration = 1000
    // https://stackoverflow.com/questions/73659174/update-d3v7-chord-layout
    const chords = this.chord(this.data);


    // ribbons
    const ribbonsUpdate = this.ribbonGroup
      .selectAll("path.ribbon")
      .data(chords)

    const ribbonsEnter = ribbonsUpdate
      .enter()
      .append("path")

    ribbonsUpdate
      .merge(ribbonsEnter)
      .attr("opacity", 0)
      .attr("class", "ribbon")
      .transition()
      .duration(duration)
      .attr("d", this.ribbon)
      .attr("fill", (d: any) => {
        if (d.source.index < this.selectedNames.length)
          return this.color(this.names[d.source.index])

        return "#6F6F6F"

      })
      .attr('opacity', 1)

    ribbonsUpdate
      .exit()
      .transition()
      .duration(duration)
      .attr("opacity", 0)
      .remove();

    const arcUpdate = this.arcGroup.selectAll("path.arc")
      .data(chords.groups)

    const arcEnter = arcUpdate
      .enter()
      .append("path")

    arcUpdate.merge(arcEnter)
      .attr("opacity", 0)
      .attr("class", "arc")
      .transition()
      .duration(1000)
      .attr("d", this.arc)
      .style("fill", (d: any) => this.color(this.names[d.index]))
      .attr('opacity', 1)

    arcUpdate
      .exit()
      .transition()
      .duration(1000)
      .attr("opacity", 0)
      .remove();



    // adding labels
    const labelsUpdate = this.labelGroup
      .selectAll("text.titles")
      .data(chords.groups)

    const labelsEnter = labelsUpdate
      .enter()
      .append("text")

    labelsUpdate
      .merge(labelsEnter)
      .attr("class", "titles")
      .attr("opacity", 0)
      .transition()
      .duration(duration)
      .each(function (d: any) { d.angle = (d.startAngle + d.endAngle) / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", function (d: any) { return d.angle > Math.PI ? "end" : null; })
      .attr("transform", function (d: any) {
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
          + "translate(" + (Math.min(928, 928) * 0.5 - 60 + 10) + ")"
          + (d.angle > Math.PI ? "rotate(180)" : "");
      })
      // .text((d: any) => {
      //       return d.getAttribute("text-anchor") === "end"
      //         ? `↑ ${this.names[d.index]}`
      //         : `${this.names[d.index]} ↓`;
      //     })       
      .text((d: any) => {
        return this.names[d.index]
      })
      .attr("opacity", 1)

    labelsUpdate
      .exit()
      .remove()
  }

  private drawChords(data: any[]): void {


    const chords = this.chord(this.data);

    const group = this.svg.append("g")
      .attr('id', 'group')
      .selectAll()
      .data(chords.groups)
      .join("g")

    group.append("path")
      .attr("fill", (d: any) => this.color(this.names[d.index]))
      .attr("d", this.arc)
      .attr("id", (d: any) => d.index)
    // .append("title")
    // .text((d: any) => `${this.names[d.index]}`);

    // const groupTick = group.append("g")
    //   .selectAll()
    //   .data((d: any) => this.groupTicks(d, this.tickStep))
    //   .join("g")
    //   .attr("transform", (d: any) => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${this.outerRadius},0)`);

    // groupTick.append("line")
    //   .attr("stroke", "currentColor")
    //   .attr("x2", 6);

    // groupTick.append("text")
    //   .attr("x", 8)
    //   .attr("dy", "0.35em")
    //   .attr("transform", (d: any) => d.angle > Math.PI ? "rotate(180) translate(-16)" : null)
    //   .attr("text-anchor", (d: any) => d.angle > Math.PI ? "end" : null)
    //   .append("textPath")
    //   .attr("href", (d: any) => d.index)
    //   .text((d: any) => this.formatValue(d.value));




    // group.select("text")
    //   .attr("font-weight", "bold")
    //   .text((d: any) => {
    //     return d.getAttribute("text-anchor") === "end"
    //       ? `↑ ${this.names[d.index]}`
    //       : `${this.names[d.index]} ↓`;
    //   });




    // group.select("text")
    //   .attr("font-weight", "bold")
    //   .text((d: any) => {return this.names[d.index];});
    //   // .text((d: any) => `${d.index}`);

    // this.svg.append("g")
    //   .attr("fill-opacity", 0.8)
    //   .selectAll("path")
    //   .data(chords)
    //   .join("path")
    //   .style("mix-blend-mode", "multiply")
    //   .attr("fill", (d: any) => {
    //     if (d.source.index < this.selectedNames.length)
    //       return this.color(this.names[d.source.index])

    //     return "#6F6F6F"

    //   })
    //   .attr("d", this.ribbon)
    //   .append("title")
    //   .text((d: any) => `${this.formatValue(d.source.value)} ${this.names[d.target.index]} → ${this.names[d.source.index]}${d.source.index === d.target.index ? "" : `\n${this.formatValue(d.target.value)} ${this.names[d.source.index]} → ${this.names[d.target.index]}`}`);

    // return svg.node();
  }

  private groupTicks(d: any, step: any) {
    const k = (d.endAngle - d.startAngle) / d.value;
    return d3.range(0, d.value, step).map(value => {
      return { value: value, angle: value * k + d.startAngle };
    });
  }

}
