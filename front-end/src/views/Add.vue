<template>
  <div class = "add">
    <h1>Add a Listing</h1>
    <form class="editForm">
      <div class="formRow">
        <h2>Username</h2>
        <input type="text" v-model="username" value="item.apartmentName" />
      </div>
      <div class="formRow">
        <h2>First Name</h2>
        <input type="text" v-model="name" value="item.address" />
      </div>
      <div class="formRow">
        <h2>Apartment Name</h2>
        <input type="text" v-model="apartmentName" value="item.apartmentName" />
      </div>
      <div class="formRow">
        <h2>Address</h2>
        <input type="text" v-model="address" value="item.address" />
      </div>
      <div class="formRow">
        <h2>Price Per Month</h2>
        <input type="text" v-model="price" value="item.price" />
      </div>
      <div class="formRow">
        <h2>Description</h2>
        <input type="text" v-model="description" value="item.description" />
      </div>
      <div class="formRow">
        <button @click="addListing()">Add Listing</button>
      </div>
    </form>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
export default {
  name: "Home",
  data() {
    return {
      username: "",
      name: "",
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
          username: this.username,
          firstName: this.name,
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
  },
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
  width: 33%;
  margin-bottom: 30px;
}

.editForm {
  display: flex;
  justify-content: space-around;
}

h1 {
  font-size: 30pt;
}

</style>
