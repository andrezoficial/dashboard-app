// src/components/GraficoCitas.js
import React from "react";
import ReactApexChart from "react-apexcharts";

const GraficoCitas = () => {
  const opciones = {
    chart: {
      id: "citas-mensuales"
    },
    xaxis: {
      categories: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"]
    },
    title: {
      text: "Citas por mes",
      align: "center"
    }
  };

  const series = [
    {
      name: "Citas",
      data: [30, 45, 60, 50, 75]
    }
  ];

  return (
    <div>
      <ReactApexChart options={opciones} series={series} type="line" height={350} />
    </div>
  );
};

export default GraficoCitas;
