<template>
  <div class="container">
    <h1 class="text-center mt-5 mb-5">Form</h1>
    <form class="row g-3" @submit.prevent="isConfirm" ref="formRef">
      <!-- Name & Surname -->
      <div class="col-md-6">
        <label class="form-label">Name</label>
        <input
          type="text"
          class="form-control"
          id="name"
          name="name"
          v-model="member.name"
        />
      </div>
      <div class="col-md-6">
        <label class="form-label">Surname</label>
        <input
          type="text"
          class="form-control"
          id="surname"
          v-model="member.surname"
        />
      </div>

      <!-- Date Picker -->
      <div class="col-md-3">
        <label class="form-label">Birth Date</label>
        <input type="date" v-model="member.birthDate" class="form-control" />
      </div>

      <!-- Status -->
      <div class="col-md-3">
        <label for="inputState" class="form-label">Status</label>
        <select id="inputState" class="form-select" v-model="member.isActive">
          <option selected>Choose</option>
          <option value="true">Online</option>
          <option value="false">Offline</option>
        </select>
      </div>
      <div class="row-12">
        <div class="col-md-6">
          <label class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            id="inputEmail"
            v-model="member.email"
          />
        </div>
      </div>

      <!-- Button -->
      <div class="col-12 mt-5 text-end">
        <button type="submit" class="btn btn-primary">Sign up</button>
      </div>
    </form>
  </div>
  <div>
    <p>Count: {{ member.count }}</p>
    <p>Double: {{ member.doubleCount }}</p>
    <button @click="handleClick">Increment</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useMemberStore } from "../../stores/member";
import Swal from "sweetalert2";

const formRef = ref(null);

const member = useMemberStore();

function handleClick() {
  member.increment();
}
function isConfirm() {
  if (!member.name) {
    Swal.fire({
      title: "Name is required",
      text: "That thing is still around?",
      icon: "warning",
    });
    console.log("name is require");
    return 0;
  }


  console.log("pass")


    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then((result) => {
      if (result.isConfirmed) {
  member.submitForm()
        Swal.fire({
          title: "Save!",
          text: "Your information has been saved.",
          icon: "success",
        });
      }
    });
}
</script>
