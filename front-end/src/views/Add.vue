<template>
  <Login v-if="!user"/>
  <div v-else class = "add">
    <h1>Add a Listing</h1>
    <form class="editForm">
      <div class="shortFormBox">
        <div class="formRow">
          <h2>Apartment Name</h2>
          <input type="text" v-model="apartmentName" value="item.apartmentName" />
        </div>
        <div class="formRow">
          <h2>Price Per Month</h2>
          <input type="text" v-model="price" value="item.price" />
        </div>
      </div>
      <div class="formRow">
        <h2>Address</h2>
        <input type="text" v-model="address" value="item.address" />
      </div>
      <div class="formRow">
        <h2>Description</h2>
        <textarea type="text" v-model="description" value="item.description" />
      </div>
      <div class="formRow">
        <button class="addButton" @click="addListing()">Add Listing</button>
      </div>
    </form>
    <div class="user-footer">
      <p class="user-name">{{user.firstName}} {{user.lastName}}</p>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import Login from '@/components/Login.vue';
export default {
  name: "Home",
  components: {
    Login,
  },
  data() {
    return {
      apartmentName: "",
      address: "",
      price: "",
      description: "",
    }
  },
  methods: {
    async addListing() {
      try {
        await axios.post("/api/listing", {
          username: this.user.username,
          firstName: this.user.firstName,
          apartmentName: this.apartmentName,
          price: this.price,
          address: this.address,
          description: this.description,
        });
      }
      catch (error){
        console.log(error);
      }
    },
    async logout() {
      try {
        await axios.delete("/api/logout");
        this.$root.$data.user = null;
      } catch (error) {
        this.$root.$data.user = null;
      }
    }
  },
  async created() {
    try {
      let response = await axios.get('/api/login');
      this.$root.$data.user = response.data.user;
    } catch(error){
      this.$root.$data.user = null;
    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    }
  }
};
</script>

<style>

.add {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.formRow {
  display: flex;
  flex-direction: column;
  width: 90%;
  margin-bottom: 10px;
  margin-left: 5%;
  margin-right: 5%;
}

.formRow textarea,
.formRow input {
  border-radius: 20px;
  border: none;
  padding: 10px;
  font-size: 16pt;
}

.formRow textArea {
  height: 150px;
}

.shortFormBox {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.addButton {
  align-self: flex-end;
}

.editForm {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}

h1 {
  font-size: 30pt;
}

</style>
