<template>
  <div id="app">
    <AppModal v-if="selectedTruck">
      <div>

      </div>

    </AppModal>
    <button @click="sendMessage('START')">click me</button>
    <button @click="sendMessage('STOP')">STOP me</button>
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import AppModal from './components/AppModal.vue'
var list = [];
export default {
  name: "App",
  components: {HelloWorld,AppModal},
  data() {
    return {
      list: list,
    };
  },
  computed: {
    selectedTruck() {
      return this.$store.getters.selectedTruck;
    },
  },
  methods: {
    sendMessage: function (message) {
      console.log(this.connection);
      this.connection.send(message);
    },
    closeConnection: function () {
      console.log(this.connection);
      this.connection.close();
    },

    openConection() {
      console.log("Starting connection to WebSocket Server");
      this.connection = new WebSocket("ws://localhost:3000");
      // this.connection.binaryType = "blob";
      var vue = this;
      this.connection.onmessage = async function (event) {
        // console.log(event, this);
        // var read;
        if (event.data instanceof Blob) {
          var reader = new FileReader();

          reader.onload = () => {
            // vue.parseData(reader);
            vue.$store.dispatch({ type: "setTrucksData" ,reader});
          };

          reader.readAsArrayBuffer(event.data);
        } else {
          console.log("Result: " + event.data);
        }
      };

      this.connection.onopen = function (event) {
        console.log(event);
        console.log("Successfully connected to the echo websocket server...");
      };
    },
  },
  created() {
    this.openConection();
  },
  destroyed() {
    this.closeConnection();
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
