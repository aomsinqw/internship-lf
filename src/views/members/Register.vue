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
          <option value="">Choose</option>
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
        <button @click="submitHandler" type="submit" class="btn btn-primary">
          Sign up
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
import { useMemberStore } from "../../stores/member";
import Swal from "sweetalert2";
import { useRouter } from 'vue-router';

const formRef = ref(null);

const member = useMemberStore();

const router = useRouter();

function showMessage(varTitle, varText, varIcon) {
  Swal.fire({
    title: varTitle,
    text: varText,
    icon: varIcon,
  });
}

function isConfirm() {
  const text = "Please complete all fields before proceeding";
  if (!member.name) {
    showMessage("name is required", text, "warning");
    console.log("name is required");
    return 0;
  }

  if (!member.surname) {
    showMessage("Surname is required", text, "warning");

    console.log("surname is required");
    return 0;
  }

  if (!member.birthDate) {
    showMessage("Birth Date required", text, "warning");
    console.log("birth date is required");
    return 0;
  }

  if (
    member.isActive === null ||
    member.isActive === undefined ||
    member.isActive === ""
  ) {
    showMessage("Status is required", text, "warning");
    console.log("isActive is required");
    return false;
  }

  if (!member.email) {
    showMessage("Email is required", text, "warning");
    console.log("email is required");
    return 0;
  }

  return 1; // All validations passed
}

// ฟังก์ชันหลักที่ใช้เรียกเวลา submit
async function submitHandler() {
  if (!isConfirm()) {
    return; // ถ้า validation ไม่ผ่าน ให้หยุดที่นี่
  }
  console.log("pass");
  member.getAllMember;
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes!",
  });

  if (result.isConfirmed) {
    //Confirm
    console.log("Ok");
    let emailIsExist = await member.emailIsExist();
    console.log("eiei", emailIsExist);
    if (emailIsExist) {
      Swal.fire("Duplicate Email", "This email is already used.", "warning");
    } else {
      const isSuccess = member.submitForm();
      if (isSuccess) {
        Swal.fire("Success", "Data saved to Firebase", "success");
        router.push("/memberlist");
      } else {
        Swal.fire("Error", "Something went wrong while saving.", "error");
      }
    }
  } else {
    //Cancel
    console.log("Cancel");
    Swal.fire({
      title: "Cancel",
      text: "Your information is canceled.",
      icon: "error",
    });
  }
}
</script>
