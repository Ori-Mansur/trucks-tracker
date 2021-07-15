<template>
  <div id="app">
    <AppModal v-if="selectedTruck">
      <div>
        <h3>Truck No.{{ selectedTruck }}</h3>
        <h5>Total Record: {{ trucksData[selectedTruck].length }}</h5>
        <h5>
          First Status:
          {{
            trucksData[selectedTruck][trucksData[selectedTruck].length - 1].epoch
              | dateTimeFormat
          }}
        </h5>
        <h5>Last Status: {{ trucksData[selectedTruck][0].epoch | dateTimeFormat }}</h5>
        <h5>
          Last Location: {{ trucksData[selectedTruck][0].latitude.toFixed(4) }} N |
          {{ trucksData[selectedTruck][0].longitude.toFixed(4) }} E
        </h5>
        <button @click="unselectTruck">Close</button>
      </div>
    </AppModal>
    <button @click="sendMessage('START')">click me</button>
    <button @click="sendMessage('STOP')">STOP me</button>
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import AppModal from "./components/AppModal.vue";
var list = [];
export default {
  name: "App",
  components: { HelloWorld, AppModal },
  data() {
    return {
      list: list,
    };
  },
  computed: {
    selectedTruck() {
      return this.$store.getters.selectedTruck;
    },
    trucksData() {
      return this.$store.getters.trucksData;
    },
    BASE_URL() {
      return this.$store.getters.BASE_URL;
    },
  },
  methods: {
    unselectTruck() {
      this.$store.dispatch({ type: "selectTruck", truckId: null });
    },
    sendMessage(message) {
      this.connection.send(message);
    },
    closeConnection() {
      this.connection.close();
    },

    openConection() {
      console.log("Starting connection to WebSocket Server");
      this.connection = new WebSocket("ws:" + this.BASE_URL);
      // this.connection.binaryType = "blob";

      var vue = this;
      this.connection.onmessage = async function (event) {
        // var read;
        if (event.data instanceof Blob) {
          var reader = new FileReader();

          reader.onload = () => {
            vue.$store.dispatch({ type: "setTrucksData", reader });
          };

          reader.readAsArrayBuffer(event.data);
        } else {
          vue.$store.dispatch("getGoogleKey", { key: event.data });
        }
      };

      this.connection.onopen = function () {
        vue.sendMessage("GOOGLE_KEY");
        console.log("Successfully connected to the echo websocket server...");
      };
    },
  },
  async created() {
    await this.$store.dispatch("getBASE_URL");
  },
  destroyed() {
    this.closeConnection();
  },
  watch: {
    BASE_URL: {
      immediate: true,
      deep: true,
      handler(newVal) {
        console.log(newVal);
        if (newVal) {
          this.openConection();
        }
      },
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
