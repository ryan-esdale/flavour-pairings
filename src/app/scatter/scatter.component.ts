import { Component } from '@angular/core';
import * as d3 from 'd3';
import { GenerateNetworkDataService } from '../services/generate-network-data.service';

@Component({
  selector: 'app-scatter',
  standalone: true,
  imports: [],
  templateUrl: './scatter.component.html',
  styleUrl: './scatter.component.css'
})
export class ScatterComponent {

  // Specify the dimensions of the chart.
  private width = 800;
  private height = 600;

  // Specify the color scale.
  private color = d3.scaleOrdinal(d3.schemeCategory10);

  // The force simulation mutates links and nodes, so create a copy
  // so that re-evaluating this cell produces the same result.
  // const links = data.links.map(d => ({ ...d }));
  // const nodes = data.nodes.map(d => ({ ...d }));

  private links: any[] = []
  private nodes: any[] = []


  // public selectedNames: string[] = ['Allspice', 'Almond']

  private simulation!: d3.Simulation<d3.SimulationNodeDatum, d3.SimulationLinkDatum<d3.SimulationNodeDatum>>;


  constructor(private service: GenerateNetworkDataService) { }

  ngOnInit(): void {
    // const dat = this.service.loadData(this.selectedNames)
    const dat = this.service.loadData()
    this.nodes = dat[0]
    this.links = dat[1]
    console.log(dat)
    this.createSvg()
  }


  private createSvg() {
    // const div: HTMLDivElement = document.querySelector('div');
    const svg = d3.select('div')
      .append('svg')
      .attr("viewBox", [-this.width / 2, -this.height / 2, this.width, this.height])
    // const svg = d3.select("figure#chart")
    //   .attr("width", this.width)
    //   .attr("height", this.height)
    //   .attr("viewBox", [-this.width / 2, -this.height / 2, this.width, this.height])
    //   .attr("style", "max-width: 100%; height: auto;");


    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(this.links)
      .join('line');

    const node = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(this.nodes)
      .enter()
      .append('g');

    const circles = node
      .append('circle')
      .attr('r', 10)
      .style('fill', (n) => this.color(n.group))
      .style('cursor', 'pointer')
      .on('dblclick', (e) => alert(e.srcElement.__data__.name))
    // .call(
    //   d3.drag()
    //     .on('start', (e: any, d: any) => dragstarted(e, d))
    //     .on('drag', (e: any, d: any) => dragged(e, d))
    //     .on('end', (e: any, d: any) => dragended(e, d))
    // );

    const labels = node
      .append('text')
      .text((n) => n.name)
      .attr('x', 12)
      .attr('y', 3)
      .style('font-size', '12px')
      .style('color', (n) => this.color('' + n.group));

    node.append('title').text((n) => n.name);
    // Add a drag behavior.
    // node

    // Create a simulation with several forces.
    const simulation = d3.forceSimulation(this.nodes)
      .force("link", d3.forceLink(this.links).id(d => d.index || 0))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("collide", d3.forceCollide().radius((d: any) => { return d.r + 1 || 1 }))
      // .force('center', d3.forceCenter(0, 0))
      // .force("x", d3.forceX())
      // .force("y", d3.forceY())
      .tick()
      .on('tick', () => {
        node.attr('transform', (n) => 'translate(' + n.x + ',' + n.y + ')');
        link
          .attr('x1', (l) => l.source.x)
          .attr('y1', (l) => l.source.y)
          .attr('x2', (l) => l.target.x)
          .attr('y2', (l) => l.target.y);
      });
    // .on("tick", () => {
    //   link
    //     .attr("x1", (d: any) => d.source.x)
    //     .attr("y1", (d: any) => d.source.y)
    //     .attr("x2", (d: any) => d.target.x)
    //     .attr("y2", (d: any) => d.target.y);

    //   node
    //     .attr("cx", (d: any) => d.x)
    //     .attr("cy", (d: any) => d.y);
    // });

    // Reheat the simulation when drag starts, and fix the subject position.
    const dragstarted = (event: any, d: d3.SimulationNodeDatum) => {
      if (!event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = event.subject.x;
      d.fy = event.subject.y;
    }

    // Update the subject (dragged node) position during drag.
    const dragged = (event: any, d: d3.SimulationNodeDatum) => {
      d.fx = event.x;
      d.fy = event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    const dragended = (event: any, d: d3.SimulationNodeDatum) => {
      if (!event.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    }

    // When this cell is re-run, stop the previous simulation. (This doesn’t
    // really matter since the target alpha is zero and the simulation will
    // stop naturally, but it’s a good practice.)
    // invalidation.then(() => simulation.stop());
  }

}
