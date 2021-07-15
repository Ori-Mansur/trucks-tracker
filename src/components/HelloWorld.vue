<template>
  <div class="hello">
    <h3>Dashboard</h3>
    <div v-if="googleKey" id="map"></div>
  </div>
</template>

<script>
import { Loader } from "@googlemaps/js-api-loader";
import * as truck from "../assets/truck.svg";
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
    openDetails: function (no) {
      this.$store.dispatch({ type: "selectTruck", truckId: no });
    },
    setMap() {
      const loader = new Loader({
        apiKey: this.googleKey,
        version: "weekly",
        libraries: ["geometry"],
        // ...additionalOptions,
      });
      loader.load().then(() => {
        this.google = window.google;
        this.map = new this.google.maps.Map(document.getElementById("map"), {
          center: { lat: 40.137115478515625, lng: -116.52953338623047 },
          zoom: 10,
        });
      });
    },
  },
  created() {
    window.openVueModal = (loc) => {
      this.openDetails(loc);
    };
    window.openMapModal = (loc, marker) => {
      // console.log(this.trucksData[loc].map(d=>{
      //   return { lat: 36.579, lng: -118.292 }
      // }));
      // const path = [
      //   { lat: 36.579, lng: -118.292 },
      //   { lat: 36.606, lng: -118.0638 },
      //   { lat: 36.433, lng: -117.951 },
      //   { lat: 36.588, lng: -116.943 },
      //   { lat: 36.34, lng: -117.468 },
      //   { lat: 36.24, lng: -116.832 },
      // ];
      var total = 0;
      for (var j = 0; j < this.trucksData[loc].length - 1; j++) {
        var path = this.trucksData[loc];
        var pos1 = new this.google.maps.LatLng(path[j].latitude, path[j].longitude);
        var pos2 = new this.google.maps.LatLng(
          path[j + 1].latitude,
          path[j + 1].longitude
        );
        total += this.google.maps.geometry.spherical.computeDistanceBetween(pos1, pos2);
      }
      console.log(total);
      this.infowindow.setContent(
        `<h4>Truck Num. ${loc}</h4> \n   
                     <div>${
                       this.trucksData[loc][0].malfunctionWarning
                         ? "Malfunction Warning"
                         : "No Malfunction Warning"
                     }</div>
                    <div>km ${total.toFixed(2)}</div>
                    <button onclick="openVueModal(${loc})">info</button>`
      );

      this.infowindow.open(this.map, marker);
      return total;

      // var service = new this.google.maps.DistanceMatrixService();
      // service.getDistanceMatrix(
      //   {
      //     origins: [{ lat: 36.579, lng: -118.292 }],
      //     destinations: [{ lat: 55.93, lng: -3.118 }],
      //     travelMode: "DRIVING",
      //   },
      //   callback
      // );

      // function callback(response, status) {
      //   // See Parsing the Results for
      //   // the basics of a callback function.
      //   console.log(response, status);
      // }
      // this.openDetails(loc);
    };
  },
  computed: {
    trucksData() {
      return this.$store.getters.trucksData;
    },
    googleKey() {
      return this.$store.getters.googleKey;
    },
    truckIds() {
      return Object.keys(this.trucksData);
    },
  },
  watch: {
    googleKey: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal) {
          this.setMap();
        }
      },
    },
    truckIds: {
      immediate: false,
      deep: true,
      handler(newVal) {
        // console.log(newVal);
        var locations = newVal.map((v) => {
          return [v, this.trucksData[v][0].latitude, this.trucksData[v][0].longitude, 4];
        });

        // console.log(locations);
        if (!this.infowindow) {
          this.infowindow = new this.google.maps.InfoWindow();
        }
        this.count = 0;

        for (let i = 0; i < locations.length; i++) {
          if (this.markers[locations[i][0]]) {
            var loc = locations[i][0];
            this.markers[locations[i][0]].setPosition({
              lat: locations[i][1],
              lng: locations[i][2],
            });
            var total = 0;
            for (var j = 0; j < this.trucksData[loc].length - 1; j++) {
              var path = this.trucksData[loc];
              var pos1 = new this.google.maps.LatLng(path[j].latitude, path[j].longitude);
              var pos2 = new this.google.maps.LatLng(
                path[j + 1].latitude,
                path[j + 1].longitude
              );
              total += this.google.maps.geometry.spherical.computeDistanceBetween(
                pos1,
                pos2
              );
            }

            this.infowindow.setContent(
              `<h4>Truck Num. ${loc}</h4> \n
                     <div>${
                       this.trucksData[loc][0].malfunctionWarning
                         ? "Malfunction Warning"
                         : "No Malfunction Warning"
                     }</div>
                    <div>km ${total.toFixed(2)}</div>
                    <button onclick="openVueModal(${loc})">info</button>`
            );
          } else {
            this.markers[locations[i][0]] = new this.google.maps.Marker({
              position: new this.google.maps.LatLng(locations[i][1], locations[i][2]),
              icon: truck,
              map: this.map,
              optimized: true,
            });
            this.markers[locations[i][0]].addListener(
              "mouseover",
              (function (marker, i) {
                return function () {
                  window.openMapModal(locations[i][0], marker);
                  // infowindow.setContent(
                  //   `<h4>Truck Num. ${locations[i][0]}</h4> \n
                  //    <div>${data[locations[i][0]][0].malfunctionWarning ? "Malfunction Warning" : "No Malfunction Warning"}</div>
                  //   <div>km ${total.toFixed(2)}</div>
                  //   <button onclick="openVueModal(${locations[i][0]})">info</button>`
                  // );

                  // infowindow.open(this.map, marker);
                };
              })(this.markers[locations[i][0]], i, this.trucksData, this)
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
