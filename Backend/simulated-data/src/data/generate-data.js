const fs = require("fs");
const fetch = require("node-fetch");
const moment = require("moment");
const stringify = require("csv-stringify/lib/sync");

const generateData = async (offset) => {
  let response = await fetch("http://localhost:5000/devices");
  response = await response.json();

  let min = 0;
  let max = 0;
  let freq = 24;
  let on = false;

  let randomDistribution = [1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
  const start = moment().subtract(offset, "month").startOf("month");
  let end = moment().subtract(offset, "month").endOf("month");
  console.log(end);
  console.log(start);
  const now = moment();
  /*if(now.isBefore(end)){
        end = now;
    }*/

  const devices = response.items;
  const records = devices.map((device) => {
    switch (device.type) {
      case 1:
        console.log("Bocina");
        max = 10.15;
        min = 1.2;
        freq = 4;
        break;
      case 2:
        console.log("Consola");
        max = 101.9;
        min = 68.9;
        freq = 4;
        break;
      case 3:
        console.log("Luz");
        max = 10.5;
        min = 10.5;
        freq = 3;
        break;
      case 4:
        console.log("Tv");
        max = 75;
        min = 3;
        freq = 4;
        break;
      case 5:
        console.log("Clima");
        max = 75;
        min = 3;
        break;
      case 6:
        console.log("Impresora");
        max = 151.56;
        min = 14.31;
        break;
      case 7:
        console.log("Lavadora");
        max = 895.5;
        min = 895.5;
        freq = 2;
        break;
      case 8:
        console.log("Licuadora");
        max = 366.7;
        min = 366.7;
        freq = 4;

        break;
      case 9:
        console.log("Modem");
        max = 6;
        min = 6;
        on = true;
        break;
      case 10:
        console.log("CPU");
        max = 10.74;
        min = 166.2;
        break;
      case 11:
        console.log("Refri");
        max = 2861.7;
        min = 2861.7;
        on = true;
        break;
      case 12:
        console.log("Asistente");
        max = 2861.7;
        min = 2861.7;
        break;
      case 13:
        console.log("Cafetera");
        max = 732.6;
        min = 732.6;
        break;
      case 14:
        console.log("Microondas");
        max = 1082.43;
        min = 1245.24;
        break;
      case 15:
        console.log("Calefactor");
        max = 20;
        min = 14;
        break;
    }
    const record = [];
    let aux = freq;
    for (
      let hour = moment(start);
      hour.isBefore(end);
      hour = hour.add(1, "hour")
    ) {
      if (on === true) {
        record.push({
          date: hour.toDate(),
          consumption: max,
        });
      } else if (aux === 0) {
        record.push({
          date: hour.toDate(),
          consumption: 0.0,
        });
        let idx = Math.floor(Math.random() * randomDistribution.length);
        if (randomDistribution[idx] === 1) {
          aux = freq;
        }
      } else {
        record.push({
          date: hour.toDate(),
          consumption:
            Math.round(Math.floor(Math.random() * max) + min * 100) / 100,
        });
        aux--;
      }
    }

    return record;
  });

  records.forEach((record, index) => {
    const recordString = stringify(record, {
      header: true,
    });
    fs.writeFileSync(
      `${start.format("YYYY-MM")}-${devices[index].id}.csv`,
      recordString
    );
  });
};

generateData(0)
  .then((res) => console.log("Generación de datos exitosa"))
  .catch((err) => console.log(err));
