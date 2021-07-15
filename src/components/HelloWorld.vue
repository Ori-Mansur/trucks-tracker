<template>
  <div class="hello">
    <h3>Dashboard</h3>
    <div id="map"></div>
    <h3>Essential Links</h3>
    <ul v-for="truckId in truckIds" :key="truckId">
      <h3>Truck No.{{ truckId }}</h3>
      <h5>Total Record: {{ trucksData[truckId].length }}</h5>
      <h5>
        First Status:
        {{ trucksData[truckId][trucksData[truckId].length - 1].epoch | dateTimeFormat }}
      </h5>
      <h5>Last Status: {{ trucksData[truckId][0].epoch | dateTimeFormat }}</h5>
      <h5>
        Last Location: {{ trucksData[truckId][0].latitude.toFixed(4) }} N |
        {{ trucksData[truckId][0].longitude.toFixed(4) }} E
      </h5>
      <!-- <li v-for="(msg, idx) in trucksData[truckId]" :key="idx">
        <span>engineHeat: {{msg.engineHeat}}</span>
        <span>epoch: {{msg.epoch | dateTimeFormat}}</span>
        <span>malfunctionWarning: {{msg.malfunctionWarning ? true : false}}</span>
      </li> -->
      <!-- <span>latitude: {{msg.latitude}}</span>
        <span>longitude: {{msg.longitude}}</span> -->
    </ul>
  </div>
</template>

<script>
import { Loader } from "@googlemaps/js-api-loader";
import * as truck from '../assets/truck.svg'
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      markers: {},
    };
  },
   methods: {
    sendMessage: function (no) {
console.log('nonono ',no);
    },
   },
  created() {
    const loader = new Loader({
      apiKey: "AIzaSyBtIZbV3hkdA38vvKGEGbrpEah3vO1ZPyE",
      version: "weekly",
      // ...additionalOptions,
    });
    loader.load().then(() => {
      this.google = window.google;
      this.map = new this.google.maps.Map(document.getElementById("map"), {
        center: { lat: 40.25580596923828, lng: -116.98463439941406 },
        zoom: 7,
      });
    });
  },
  computed: {
    trucksData() {
      return this.$store.getters.trucksData;
    },
    truckIds() {
      return Object.keys(this.trucksData);
    },
  },
  watch: {
    truckIds: {
      immediate: false,
      deep: true,
      handler(newVal) {
        console.log(newVal);
        var locations = newVal.map((v) => {
          return [v, this.trucksData[v][0].latitude, this.trucksData[v][0].longitude, 4];
        });
        console.log(locations);
        var infowindow = new this.google.maps.InfoWindow();
        this.count = 0;

        for (let i = 0; i < locations.length; i++) {
          if (this.markers[locations[i][0]]) {
            this.markers[locations[i][0]].setPosition({
              lat: locations[i][1],
              lng: locations[i][2],
            });
            infowindow.setContent(
                   `<h4>Truck Num. ${locations[i][0]}</h4> \n    ${
                     this.trucksData[locations[i][0]][0].malfunctionWarning
                       ? "Malfunction Warning"
                       : "No Malfunction Warning"
                   }<button onclick="vue.sendMessage(locations[i][0])">info</button>`
                 );
          } else {
            this.markers[locations[i][0]] = new this.google.maps.Marker({
              position: new this.google.maps.LatLng(locations[i][1], locations[i][2]),
              // label: locations[i][0],
              icon: truck,
              map: this.map,
              optimized: true,
            });
            this.markers[locations[i][0]].addListener(
             "mouseover",
             (function (marker, i, data,vue) {
               return function () {
                 console.log("hi", vue);
                   infowindow.setContent(
                   `<h4>Truck Num. ${locations[i][0]}</h4> \n    ${
                     data[locations[i][0]][0].malfunctionWarning
                       ? "Malfunction Warning"
                       : "No Malfunction Warning"
                   }<button onclick="vue.sendMessage(locations[i][0])">info</button>`
                 );
                
                 
                 infowindow.open(this.map, marker);
               };
             })(this.markers[locations[i][0]], i, this.trucksData,this)
           );
            
           
          }
        }
      },
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
#map {
  height: 60vh;
  width: 90vw;
}
h3 {
  margin: 40px 0 0;
}
ul {
  width: 300px;
  list-style-type: none;
  padding: 0;
}
h5 {
  text-align: start;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
