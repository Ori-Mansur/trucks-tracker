<template>
  <div id="app">
    <AppModal v-if="selectedTruck">
      <div class="info-modal">
        <h3>Truck No.{{ selectedTruck }}</h3>
        <div>
          <h5>Total Record:</h5>
          {{ trucksData[selectedTruck].length }}
        </div>
        <div>
          <h5>First Status:</h5>
          {{
            trucksData[selectedTruck][trucksData[selectedTruck].length - 1].epoch
              | dateTimeFormat
          }}
        </div>
        <div>
          <h5>Last Status:</h5>
          {{ trucksData[selectedTruck][0].epoch | dateTimeFormat }}
        </div>
        <div>
          <h5>Last Location:</h5>
          {{ trucksData[selectedTruck][0].latitude.toFixed(4) }} N |
          {{ trucksData[selectedTruck][0].longitude.toFixed(4) }} E
        </div>
        <button @click="unselectTruck">Close</button>
      </div>
    </AppModal>
    <div>
      <button @click="sendMessage('START')">click me</button>
      <button @click="sendMessage('STOP')">STOP me</button>
    </div>
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
      this.connection = new WebSocket("wss:" + this.BASE_URL);
      // this.connection = new WebSocket("ws://trucks-tracker-socket.herokuapp.com");
      // this.connection.binaryType = "blob";

      this.connection.onmessage = async (event) => {
        // var read;
        // console.log(event);
        if (event.data instanceof Blob) {
          var reader = new FileReader();

          reader.onload = () => {
            this.$store.dispatch({ type: "setTrucksData", reader });
          };

          reader.readAsArrayBuffer(event.data);
        } else {
          this.$store.dispatch("getGoogleKey", { key: event.data });
        }
      };

      this.connection.onopen = () => {
        this.sendMessage("GOOGLE_KEY");
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
@font-face {
  font-family: "Montserrat";
  src: url(~@/assets/fonts/Montserrat-Regular.ttf);
  font-display: swap;
}
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  font-family: "Montserrat", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
button {
  font-family: "Montserrat", Avenir, Helvetica, Arial, sans-serif;
  border: none;
  background: #2c3e50;
  color: white;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
}
.info-modal {
  padding: 30px;
}
.info-modal div {
  margin-bottom: 10px;
  border-bottom: 1px solid #2c3e501f;
  display: flex;
  justify-content: space-between;
}
.info-modal h5 {
  background-color: #2c3e501f;
  padding: 3px;
  width: 150px;
  margin: 0 5px 0 0;
  text-align: start;
  display: inline-block;
}
</style>
