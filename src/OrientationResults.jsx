import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
export default function OrientationResults(props) {
  const { item } = props;
  const [screenOrientation, setScreenOrientation] = useState("landscape");

  const changeScreenOrientation = () => {
    if (window.matchMedia("(orientation: portrait)").matches) {
      setScreenOrientation("portrait");
    }
    if (window.matchMedia("(orientation: landscape)").matches) {
      setScreenOrientation("landscape");
    }
  };

  window.addEventListener("resize", changeScreenOrientation);
  useEffect(() => {
    changeScreenOrientation();
  });

  let number = item.product_info_id ? item.profitmargin + "% (estimate)" : 0;
  let number1;
  let number2;
  if (item.price.includes("-")) {
    number1 = item.price
      .split("-")[0]
      .substring(1, item.price.length)
      .replaceAll(",", "");
    number2 = item.price
      .split("-")[1]
      .substring(1, item.price.length)
      .replaceAll(",", "");
  } else {
    number2 = item.price.substring(1, item.price.length).replaceAll(",", "");
  }
  console.log(number2);
  let profit = Number(
    ((item.profitmargin / 100) * Number(number2.replaceAll("$", ""))).toFixed(2)
  );
  let production = Number(
    (Number(number2.replaceAll("$", "")) - profit).toFixed(2)
  );
  let options = item.product_info_id
    ? {
        chart: { type: "column" },
        xAxis: { categories: ["Market Price: " + item.price] },
        plotOptions: {
          column: {
            stacking: "normal",
          },
        },
        yAxis: { title: "percentage" },
        title: { text: "Profit Margin: " + number },
        series: [
          {
            name: "Profit: $".concat(profit),
            data: [profit],
          },
          {
            name: "Production Cost: $".concat(production),
            data: [production],
          },
        ],
        tooltip: {
          outside: true,
        },
      }
    : {};

  return (
    <div>
      {screenOrientation === "landscape" ? (
        <div className={window.innerWidth < 1250 ? "" : "form3"}>
          <div className="row">
            <div className="column">
              <img
                id="pic"
                className="picture"
                src={item.url}
                alt="no picture found"
              />
            </div>
            <div className="column2">
              <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="row2">
            <img
              id="pic"
              className="picture"
              src={item.url}
              alt="no picture found"
            />
          </div>
          <div className="row2">
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
        </div>
      )}
    </div>
  );
}
