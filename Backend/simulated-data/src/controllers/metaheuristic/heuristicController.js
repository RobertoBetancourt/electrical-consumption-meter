const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const moment = require('moment');
const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify/lib/sync');

/*COMMAND

jupyter nbconvert --to notebook --execute PSOConsumoDia.ipynb

*/

exports.optDevicesMonthly = async (req, res) => {
    
    try{
        let response = await fetch('http://localhost:5000/devices');
        response = await response.json();

        const devices = response.items;
        const columns = ['','Hora','Calefactor','Aire','Ventilador','Secadora','Lavatrastes','Estufa','Microondas','Refrigerador','Foco','Dia'];
        
        
        var getData = (filename) =>{
            const filePath = path.join(__dirname, `../../data/${filename}.csv`);
            const fileBuffer = fs.readFileSync(filePath);
            const fileString = fileBuffer.toString()
                .split('\n')
                .map(e => e.trim())
                .map(e => e.split(',').map(e => e.trim()))
                .flat();
            return fileString
        }

        const records = devices.filter((device) => {
            return req.query.room == -1 || device.room_id == req.query.room;
        }).map((device) => {
           
            var arr = [];
            let type;
            switch(device.type){
                case 1:
                    type = 'Bocinas';
                    break;
                case 2:
                    type = 'Consolas';
                    break;
                case 3:
                    type = 'Luces';
                    break;
                case 4:
                    type = 'Televisiones';
                    break;
                case 5:
                    type = 'Clima';
                    arr = getData('aireAcondicionado');
                    break;
                case 6:
                    type = 'Impresoras';
                    break;
                case 7:
                    type = 'Lavadoras';
                    break;
                case 8:
                    type = 'Licuadoras';
                    break;
                case 10:
                    type = 'Computadoras';
                    break;
                case 11:
                    type = 'Refrigeradores';
                    break;
                case 13:
                    type = 'Cafeteras';
                    break;
                case 14:
                    type = 'Microondas';
                    break;
                case 15:
                    type = 'Calefactor';
                    arr = getData('calefactor');
                    break;
                case 16:
                    type = 'Secadora';
                    arr = getData('secadora')
                    break;
                case 17:
                    type = 'Ventilador';
                    arr = getData('ventilador');
                    break;
            }
            if(!columns.includes(type)){
                columns.push(type);
            }
            var recordPath = path.join(__dirname, `../../data/${req.query.month}-${device.id}.csv`);
            var recordBuffer = fs.readFileSync(recordPath);
            var recordString = recordBuffer.toString();

            var record = parse(recordString, {
                columns: true
            });
            
            return record.map((entry, index) => {
                if(arr.length === 0){
                    e = entry.type
                    return {
                        consumption: parseInt(entry.consumption),
                        type,
                        day: index
                    };
                }else{
                    return {
                        consumption: parseInt(arr[index]),
                        type,
                        day: index
                    };
                }
                
            });
        });
       
        const consumption = {}
        consumption[''] = []
        consumption['Hora'] = [];

        records.forEach((entry) => {
            consumption[entry[0].type] = []
            entry.forEach((device) => {
                consumption[device.type].push(device.consumption);
                }
            )
        });

        const margin = records.length;

        

        consumption['Dia'] = [];
        var count = 0;
        var day = 1;
        Object.keys(consumption).forEach((entry, index) => {
            if(index === 2){
                consumption[entry].forEach((value, index)=>{
                    consumption[''].push(count);
                    consumption['Hora'].push(count);
                    consumption['Dia'].push(day);
                    count++;
                    if(count == 24){
                        count = 0;
                        day++;
                    }
                });
                return;
            }  
        })
        
        
        



        days = {}
        const formatted = Object.keys(days).sort().map((day) => {
            return {
                day,
                ...days[day]
            };
        });
        //console.log(formatted);
        const result = {
            data: formatted,
            columns
        }

        console.log(columns);
        res.send(result);
    }catch(error){
        console.log(error);
        res.status(500).send({
            message: 'Error al recuperar dispositivos'
        })
    }
}