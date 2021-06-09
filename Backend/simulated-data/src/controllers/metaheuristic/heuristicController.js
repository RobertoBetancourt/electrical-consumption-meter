const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const parse = require('csv-parse/lib/sync');
const { exec } = require("child_process");
const csv = require('csv-parser');
/* 
Este controlador se encarga de utilizar la metaheuristica (MH)
de la Dra. Blanca Nydia.
Primero obtiene los dispositivos solicitados, genera u obtiene los consumos, dependiendo del
tipo de dispositivo (algunos tienen valores reales y otros son simulados), se obtienen junto
con su timestamp. 
Como la metaheuristica requiere de 10 dispositivos, el controlador genera datos aleatorios de
dispostivos anteriores y los añade al final de los dispositivos obtenidos. Estos consumos 
se generaron con el programa generate-custom-data.js.
Dicho archivo generó 10 csv's de datos de consumo, en la carpeta /auxiliar-data.
Posteriormente, el controlador prepara los datos para que puedan ser consumidos por la heurística.
Ejecuta la metaheuristica. Obtiene los datos, les da formato y envia la respuesta de la petición
con los consumo optimizados.
*/

exports.optDevicesMonthly = async (req, res) => {
    
    try{
        //Obtención de los dispositivos disponibles
        let response = await fetch('http://localhost:5000/devices');
        response = await response.json();
        const devices = response.items;

        /*Declaración de arreglos auxiliares para la preparación de los datos
        aux_columns almacena los headers esperados por la MH*/
        let columns = ['day'];
        const aux_columns = ['Calefactor','Aire','Ventilador','Secadora','Lavatrastes','Estufa','Refrigerador', 'Lavadora','Foco'];
        //Función que lee los datos de los archivos de consumo REALES
        var getData = (filename) =>{
            const filePath = path.join(__dirname, `${filename}.csv`);
            const fileBuffer = fs.readFileSync(filePath);
            const fileString = fileBuffer.toString()
                .split('\n')
                .map(e => e.trim())
                .map(e => e.split(',').map(e => e.trim()))
                .flat();
            return fileString
        }
        /*Filtrado de los dispositivos solicitado y primer procesamiento */
        const records = devices.filter((device) => {
            return req.query.room == -1 || device.room_id == req.query.room;
        }).map((device) => {
           
            let arr = [];
            let index = 0;
            let type;
            switch(device.type){
                //Dependiendo del tipo de dispositivo se utilizan datos simulados o reales
                case 1: //Simulados
                    type = 'Bocinas';
                    break;
                case 2: //Simulados
                    type = 'Consola';
                    break;
                case 3: //Simulados
                    type = 'Luces';
                    break;
                case 4: //Simulados
                    type = 'Televisiones';
                    break;
                case 5: //Reales
                    type = 'Aire';
                    index = aux_columns.indexOf(type)
                    aux_columns.splice(index, 1); 
                    console.log('Hola soy ' + type);
                    console.log(aux_columns);
                    /*Elimina el header de aux_columns para poder crear los datos auxiliares 
                    de ser necesarios para no repetir dispositivos
                    */ 
                    arr = getData('../../data/aireAcondicionado'); //Obtención de datos reales
                    break;
                case 6: //Simulados
                    type = 'Impresora';
                    break;
                case 7: //Simulados
                    type = 'Lavadoras';
                    break;
                case 8: //Simulados
                    type = 'Licuadoras';
                    break;
                case 10: //Simulados
                    type = 'Computadoras';
                    break;
                case 11: //Simulados
                    type = 'Refrigeradores';
                    break;
                case 13: //Simulados
                    type = 'Cafeteras';
                    break;
                case 14: //Simulados
                    type = 'Microondas';
                    break;
                case 15: //Reales
                    type = 'Calefactor';
                    index = aux_columns.indexOf(type)
                    aux_columns.splice(index, 1); 
                    console.log(aux_columns);
                    arr = getData('../../data/calefactor'); //Obtención de datos reales
                    break;
                case 16: //Reales
                    type = 'Secadora';
                    index = aux_columns.indexOf(type)
                    aux_columns.splice(index, 1); 
                    console.log(aux_columns);
                    arr = getData('../../data/secadora'); //Obtención de datos reales
                    break;
                case 17: //Reales
                    type = 'Ventilador';
                    index = aux_columns.indexOf(type)
                    aux_columns.splice(index, 1);
                    console.log(aux_columns);
                    arr = getData('../../data/ventilador'); //Obtención de datos reales
                    break;
            }
            if(!columns.includes(type)){
                columns.push(type);
            }
            //Obtención de datos simulados
            /*Aunque se utilicen datos reales, estos utilizan los timestamps de los
            simulados para su correcta organización
            */
            var recordPath = path.join(__dirname, `../../data/${req.query.month}-${device.id}.csv`);
            var recordBuffer = fs.readFileSync(recordPath);
            var recordString = recordBuffer.toString();

            var record = parse(recordString, {
                columns: true
            });
            
            return record.map((entry, index) => {
                //Dependiendo del uso de datos (real o simulado) se generan los mapas de consumo
                if(arr.length === 0){
                    return {
                        consumption: parseFloat(entry.consumption),
                        type,
                        day: index
                    };
                }else{
                    return {
                        consumption: parseFloat(arr[index]),
                        type,
                        day: index
                    };
                }
                
            });
        });
        //console.log(records);

        const consumption = {}
        //Se calculan la cantidad de tipos distintos de dispositivos
        var type_arr = [];
        records.forEach((entry) =>{
            if(!type_arr.includes(entry[0]['type'])){
                type_arr.push(entry[0]['type']);
            }
        });

        var margin = 10 - type_arr.length; //Dispositivos extra necesarios para el funcionamiento de MH

        consumption[''] = []; //Primer header
        consumption['Hora'] = []; //Segundo header
        /*Ciclo para generar datos auxiliares*/
        while(margin != 0){
            //Se necesitan los timestamps de un archivo simulado arbitrario
            var recordPath = path.join(__dirname, `../../data/2021-05-1.csv`);
            var recordBuffer = fs.readFileSync(recordPath);
            var recordString = recordBuffer.toString();

            var record = parse(recordString, {
                columns: true
            });

            /*Dependiendo de cuantos headers disponibles haya en aux_columns,
            se toma uno aleatoriamente */
            let columns_length = aux_columns.length;
            let type = aux_columns.splice(Math.floor(Math.random() * columns_length), 1)[0];
            
            //Se obtienen los datos
            let arr = getData(`auxiliar-data/${type}`);
            //Se genera el mapa auxiliar
            var aux = record.map((entry, index) => {
                return {
                    //consumption: arr[index],
                    consumption: 0,
                    type,
                    day: index
                };
            });
            //Se añade a los demas dispositivos
            records.push(aux);
        
            margin--;
        }
        //Se añaden los dispositivos al mapa de cosnumos finales
        //console.log(records);
        records.forEach((entry) => {
            consumption[entry[0].type] = []
            entry.forEach((device) => {
                consumption[device.type].push(device.consumption);
                }
            )
        });
       
        
        consumption['Dia'] = []; //Ultimo header
        var count = 0;
        var count2 = 0.0;
        var day = 1;
        /*Se generan los datos del primer, segundo y último header
        que representan el id, la hora y el día. */
        Object.keys(consumption).forEach((entry, index) => {
            if(index === 2){
                consumption[entry].forEach((value, index)=>{
                    consumption[''].push(count);
                    consumption['Hora'].push(count2);
                    if(day.toString().length === 1){
                        var val = '0'+day.toString()
                        consumption['Dia'].push(val);
                    }else{
                        consumption['Dia'].push(day.toString());
                    }   
                    
                    count++;
                    count2++;
                    if(count == 24){
                        count = 0;
                        day++;
                    }
                });
                return;
            }  
        })
        //Se separan los headers para añadirlos a los csv de entrada en la MH
        let headers = [];
        Object.keys(consumption).forEach(entry => {
            headers.push(entry);
        });

        /*Se separan y organizan los datos de cada header.
        De momento estan almacenados en un mapa de arreglos de esta forma:
        {
            '': [1,2,3,4,5, ....],
            Hora: [1,2,3,4,5, ....],
            Disp1: [0,0,300,43.2,0, ....],
            Disp2: [0,123,0,43.2,0, ....],
            .
            .
            .
            Dia: [1,1,1,1,1, ....]
        }*/
        let data = '';
        let state_data = '';
        //Se toma el primer elemento de los datos, ya que todos los valores tiene la misma extensión
        consumption[headers[0]].forEach((entry, index) => {
            data += entry ; //Datos de id

            for(i=1; i<= 12; i++){
                data +=',' + consumption[headers[i]][index] ;
            }  //Insersión de demás datos

            data +='\n';
            /*MH necesita otro csv con los estados, 0 apagado, 1 prendido
            Si el dispositivo tiene un valor de consumo igual a 0, se toma como
            apagado (0), de los contrario, está prendido (1)*/
            state_data += entry
                + ',' + consumption[headers[1]][index];

            var add = 1;
            for(i = 2; i < 12; i++){
                if(consumption[headers[i]][index] == 0.0) {add = 0}
                state_data += ',' + add;
                add = 1;
            }
            state_data +=',' + consumption[headers[12]][index] + '\n';
            
        });

        //Se crean los archivos de entrada, añadiendo headers y luego datos.
        //LOS NOMBRES NO PUEDEN CAMBIAR
        fs.writeFileSync(`src/controllers/metaheuristic/input-data/Cons_Diciembre20.csv`, headers.toString());
        fs.writeFileSync(`src/controllers/metaheuristic/input-data/Cons_Diciembre20.csv`, '\n' + data.toString(), {flag: 'a'});
        fs.writeFileSync(`src/controllers/metaheuristic/input-data/Estado_Diciembre20.csv`, headers.toString());
        fs.writeFileSync(`src/controllers/metaheuristic/input-data/Estado_Diciembre20.csv`, '\n' + state_data.toString(), {flag: 'a'});

        //Ejecución de la metaherística, esta generará el archivo de salida Consumo_PSO_Diciembre21.csvc
        const executeHeuristic = () =>{
            return new Promise((resolve, reject) => {
                exec("jupyter nbconvert --to notebook --execute src/controllers/metaheuristic/input-data/PSOConsumoDia.ipynb", (error, stdout, stderr) =>{
                    if (error) {
                        console.log(`error: ${error.message}`);
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                    }
                resolve(stdout? stdout : stderr);
                });
            });
        }
        const helper = await executeHeuristic();
        console.log(helper);
        console.log('Terminó la heurística');
        var results = [];

        const optPath = path.join(__dirname, `/input-data/Consumo_PSO_Diciembre21.csv`);
        const readResult = async() => {
            return new Promise(resolve =>{
                const optBuffer = fs.createReadStream(optPath)
                    .pipe(csv())
                    .on('data', (data) => results.push(data))
                    .on('error', ()=> console.log('Algo salio mal'))
                    .on('finish', resolve);
            })
        }

        await readResult();

        let column = ['day'];
        var days = {};
        var used_array = []
        let v = type_arr.length;
        results.forEach((entry) => {
            const day = entry['Dia'];
            days[day] = days[day] || {};
            Object.keys(entry).forEach((value, index) =>{
                if(index > v+1){return}
                if(value !== '' && value !== 'Dia' && value != 'Hora'){
                    used_array.push(value);
                    days[day][value]=  (parseInt(days[day][value]) || 0) + parseInt(entry[value])
                }
            });
        });
        
        const days_optimized = {};
        Object.keys(days).forEach((entry) => {
            if(entry.length === 1){
                days_optimized['0'+entry] = {};
            }else{ days_optimized[entry] = {};}
            
            type_arr.forEach((value, index) => {
                if(entry.length === 1){
                    days_optimized['0'+entry][value] = days[entry][used_array[index]];
                }else{ days_optimized[entry][value] = days[entry][used_array[index]];}
                
            });
            
        });
        
        days = days_optimized;
        Object.keys(days).forEach((day) => {
            
            const sorted = {};

            Object.keys(days[day]).sort((type1, type2) => {
                return days[day][type2] - days[day][type1];
            }).forEach((type) => {
                sorted[type] = days[day][type];
            });

            days[day] = sorted;
        });
        //console.log(days);
        column = [column[0]].concat(column.slice(1).sort((column1, column2) => {
            return Object.keys(days).reduce((acc, day) => {
                return acc + days[day][column2];
            }, 0) - Object.keys(days).reduce((acc, day) => {
                return acc + days[day][column1];
            }, 0)
        }));

        const formatted = Object.keys(days).sort().map((day) => {
            return {
                day,
                ...days[day]
            };
        });
        
        const result = {
            data: formatted,
            columns
        }
        res.send(result);

    }catch(error){
        console.log(error);
        res.status(500).send({
            message: 'Error al recuperar dispositivos'
        })
    }
}