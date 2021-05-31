const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const moment = require('moment');
const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify/lib/sync');

const generateCustomData = async () =>{
    const columns = 
        {'Calefactor': [],
        'Aire':[],
        'Ventilador':[],
        'Secadora':[],
        'Lavatrastes':[],
        'Estufa':[],
        'Microondas':[],
        'Lavadora':[],
        'Refrigerador':[],
        'Foco':[]
    };
        
    const filePath = path.join(__dirname, `Cons_Diciembre20.csv`);
    const fileBuffer = fs.readFileSync(filePath);
    const fileString = fileBuffer.toString()
    var record = parse(fileString, {
        columns: true
    });
    
    
    record.forEach(entry =>{

        Object.keys(entry).forEach((value) => {
            if(value !== '' && value !== 'Dia' && value !== 'Hora'){
                columns[value].push(entry[value])
            }
        });
    });
    var day = 0;
    Object.keys(columns).forEach((record, index) => {
        const recordString = columns[record];
        day = 0;
        recordString.forEach((entry) => {
            if(day === 24){
                fs.writeFileSync(`auxiliar-data/${record}.csv`, '\n', {flag: 'a'});
                day = 0;
            }
            fs.writeFileSync(`auxiliar-data/${record}.csv`, entry + ',', {flag: 'a'});
            day++;
        });
        
    });
}

generateCustomData()