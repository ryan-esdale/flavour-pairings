import { Component } from '@angular/core';
import * as d3 from 'd3';
import { GenerateRibbonDataService } from '../generate-ribbon-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pie.component.html',
  styleUrl: './pie.component.css'
})
export class PieComponent {


  private width = 928;
  private height = this.width;

  private data: number[][] = [];
  private names: string[] = [];
  private colors = ["#c4c4c4", "#69b40f", "#ec1d25", "#c8125c", "#008fc8", "#10218b", "#134b24", "#737373", "#ea1b25", "#c2123c"];

  public selectedNames: string[] = ['Allspice', 'Almond']
  private svg: any;

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
    const dat = this.service.loadData(this.selectedNames)
    // const dat = this.service.loadData()
    this.names = dat[0]
    this.data = dat[1]
    this.createSvg();
    this.drawChords(this.data)
    console.log(dat)
  }

  private createSvg(): void {

    this.svg = d3.select("figure#chart")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", [-this.width / 2, -this.height / 2, this.width, this.height])
      .attr("style", "width: 100%; height: auto; font: 10px sans-serif;")
      .append("g");
  }

  private drawChords(data: any[]): void {


    const chords = this.chord(this.data);

    const group = this.svg.append("g")
      .selectAll()
      .data(chords.groups)
      .join("g")

    group.append("path")
      .attr("fill", (d: any) => this.color(this.names[d.index]))
      .attr("d", this.arc);

    group.append("title")
      .text((d: any) => `${this.names[d.index]}\n${this.formatValue(d.value)}`);

    const groupTick = group.append("g")
      .selectAll()
      .data((d: any) => this.groupTicks(d, this.tickStep))
      .join("g")
      .attr("transform", (d: any) => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${this.outerRadius},0)`);

    groupTick.append("line")
      .attr("stroke", "currentColor")
      .attr("x2", 6);

    groupTick.append("text")
      .attr("x", 8)
      .attr("dy", "0.35em")
      .attr("transform", (d: any) => d.angle > Math.PI ? "rotate(180) translate(-16)" : null)
      .attr("text-anchor", (d: any) => d.angle > Math.PI ? "end" : null)
      .text((d: any) => this.formatValue(d.value));

    group.select("text")
      .attr("font-weight", "bold")
      .text((d: any) => {
        return d.getAttribute("text-anchor") === "end"
          ? `↑ ${this.names[d.index]}`
          : `${this.names[d.index]} ↓`;
      });

    group.select("text")
      .attr("font-weight", "bold")
      .text((d: any) => {
        return this.names[d.index];
      });

    this.svg.append("g")
      .attr("fill-opacity", 0.8)
      .selectAll("path")
      .data(chords)
      .join("path")
      .style("mix-blend-mode", "multiply")
      .attr("fill", (d: any) => this.color(this.names[d.source.index]))
      .attr("d", this.ribbon)
      .append("title")
      .text((d: any) => `${this.formatValue(d.source.value)} ${this.names[d.target.index]} → ${this.names[d.source.index]}${d.source.index === d.target.index ? "" : `\n${this.formatValue(d.target.value)} ${this.names[d.source.index]} → ${this.names[d.target.index]}`}`);

    // return svg.node();
  }

  private groupTicks(d: any, step: any) {
    const k = (d.endAngle - d.startAngle) / d.value;
    return d3.range(0, d.value, step).map(value => {
      return { value: value, angle: value * k + d.startAngle };
    });
  }

}
