'use strict';


export default {
    state: {
        trucks: {

        },
        selectedTruck:null
    },
    mutations: {
        setTrucksData(state, { data }) {
            state.trucks[data.id] = state.trucks[data.id] && state.trucks[data.id].length ? state.trucks[data.id].concat(data.messages).sort((a,b)=>b.epoch - a.epoch ) : data.messages.sort((a,b)=>b.epoch - a.epoch );
            state.trucks = {
                ...state.trucks
            }
           
        },
        selectTruck(state, { truckId }){
            state.selectedTruck = truckId;
        }
    },
    actions: {
        async setTrucksData(context, { reader }) {
            var data = {};
            var messages = [];
            let id = new DataView(reader.result, 0, 4);
            let numOfMessages = new DataView(reader.result, 4, 1);
            // console.log("id", id.getInt32());
            id = id.getInt32();
            // console.log("numOfMessages", numOfMessages.getUint8());
            data.numOfMessages = numOfMessages.getUint8();
            for (let i = 0; i < numOfMessages.getUint8(); i++) {
                var eli = 5;


                let engineHeat = new DataView(reader.result, eli, 2);
                eli += 2;
                let latitude = new DataView(reader.result, eli, 4);
                eli += 4;
                let longitude = new DataView(reader.result, eli, 4);
                eli += 4;
                let epoch = new DataView(reader.result, eli, 4);
                eli += 4;
                const malfunctionWarning = new DataView(reader.result, eli, 1);
                eli += 1;
                const msg = {
                    "engineHeat": engineHeat.getUint16(),
                    "latitude": latitude.getFloat32(),
                    "longitude": longitude.getFloat32(),
                    "epoch": epoch.getUint32(),
                    "malfunctionWarning": malfunctionWarning.getUint8()
                }
                messages.push(msg)

                // console.log("engineHeat", engineHeat.getUint16());
                // console.log("latitude", latitude.getFloat32());
                // console.log("longitude", longitude.getFloat32());
                // console.log("epoch", epoch.getUint32());
                // console.log("epoch", new Date(epoch.getUint32()));
                // console.log("malfunctionWarning", malfunctionWarning.getUint8());
            }

            context.commit({ type: 'setTrucksData', data: { id, messages: [...messages] } })

        },
        selectTruck(context, { truckId }){
            context.commit({ type: 'selectTruck', truckId })

        }


    },
    getters: {
        trucksData(state) {
            return state.trucks
        },
        selectedTruck(state) {
            return state.selectedTruck
        },


    }

};
