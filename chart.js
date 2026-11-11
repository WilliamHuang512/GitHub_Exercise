// Horizontal bar chart of findings from the two studies cited in the project proposal.
const data = [
  { label: "Students who regularly use generative AI", value: 37, group: "student",
    note: "Survey of 95,000+ students at 20 U.S. universities (Chirikov et al., 2026)" },
  { label: "Faculty: AI will diminish critical thinking", value: 90, group: "faculty",
    note: "Survey of 1,057 U.S. college faculty (Watson & Rainie, 2026)" },
  { label: "Faculty: AI will increase overreliance", value: 95, group: "faculty",
    note: "Survey of 1,057 U.S. college faculty (Watson & Rainie, 2026)" }
];

const width = 760, barHeight = 46, gap = 18;
const margin = { top: 20, right: 30, bottom: 40, left: 300 };
const height = margin.top + margin.bottom + data.length * (barHeight + gap);

const svg = d3.select("#chart").append("svg")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("role", "img")
  .attr("aria-label", "Bar chart: 37% of students regularly use AI; 90% of faculty think AI will diminish critical thinking; 95% think it will increase overreliance");

const x = d3.scaleLinear().domain([0, 100]).range([margin.left, width - margin.right]);
const y = d3.scaleBand().domain(data.map(d => d.label))
  .range([margin.top, height - margin.bottom]).padding(0.25);

svg.append("g")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(x).ticks(5).tickFormat(d => d + "%"))
  .call(g => g.select(".domain").remove());

const tooltip = d3.select("#tooltip");

svg.selectAll(".bar").data(data).join("rect")
  .attr("class", d => "bar " + d.group)
  .attr("x", x(0))
  .attr("y", d => y(d.label))
  .attr("height", y.bandwidth())
  .attr("rx", 5)
  .attr("width", 0)
  .on("mousemove", (event, d) => {
    tooltip.style("opacity", 1)
      .html(`<strong>${d.value}%</strong><br>${d.note}`)
      .style("left", (event.pageX + 12) + "px")
      .style("top", (event.pageY - 28) + "px");
  })
  .on("mouseleave", () => tooltip.style("opacity", 0))
  .transition().duration(900)
  .attr("width", d => x(d.value) - x(0));

svg.selectAll(".label").data(data).join("text")
  .attr("class", "label")
  .attr("x", margin.left - 12)
  .attr("y", d => y(d.label) + y.bandwidth() / 2)
  .attr("dy", "0.35em")
  .attr("text-anchor", "end")
  .text(d => d.label);

svg.selectAll(".value").data(data).join("text")
  .attr("class", "value")
  .attr("x", d => x(d.value) - 10)
  .attr("y", d => y(d.label) + y.bandwidth() / 2)
  .attr("dy", "0.35em")
  .attr("text-anchor", "end")
  .text(d => d.value + "%");
