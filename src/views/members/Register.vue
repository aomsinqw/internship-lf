<template>
  <div class="container">
    <h1 class="text-center mt-5 mb-5">Form</h1>
    <form class="row g-3" @submit.prevent="submitHandler" ref="formRef">
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
          <option :value="null">Choose</option>
          <option :value="true">Online</option>
          <option :value="false">Offline</option>
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
        <button type="submit" class="btn btn-primary">
          Sign up
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
import { useMemberStore } from "../../stores/member";
import Swal from "sweetalert2";
import { useRouter, useRoute } from "vue-router";

const formRef = ref(null);
const member = useMemberStore();

const router = useRouter();
const route = useRoute();

const id = route.query.id;

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
    showMessage("Name is required", text, "warning");
    return false;
  }

  if (!member.surname) {
    showMessage("Surname is required", text, "warning");
    return false;
  }

  if (!member.birthDate) {
    showMessage("Birth Date is required", text, "warning");
    return false;
  }

  if (member.isActive === null || member.isActive === undefined) {
    showMessage("Status is required", text, "warning");
    return false;
  }

  if (!member.email) {
    showMessage("Email is required", text, "warning");
    return false;
  }

  return true; // ผ่านหมด
}

// โหลดข้อมูลถ้าแก้ไข (id มีค่า)
onMounted(async () => {
  if (id) {
    await member.getMember(); // โหลดสมาชิกทั้งหมด
    const data = member.members.find((m) => m.id === id);
    if (data) {
      member.name = data.name;
      member.surname = data.surname;
      member.birthDate = data.birthDate;
      member.isActive = data.isActive;
      member.email = data.email;
    } else {
      showMessage("Error", "Member not found.", "error");
      router.push("/memberlist");
    }
  }
});

// ฟังก์ชัน submit แบบเพิ่ม/แก้ไข
async function submitHandler() {
  if (!isConfirm()) return;

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
    // ตรวจสอบ email ซ้ำ (ถ้าแก้ไขและ email ไม่เปลี่ยนข้ามได้)
    let emailExists = await member.emailIsExist();

    if (id) {
      // กรณีแก้ไข ถ้า email เหมือนเดิมถือว่าไม่ซ้ำ
      const currentMember = member.members.find((m) => m.id === id);
      if (currentMember && currentMember.email === member.email) {
        emailExists = false;
      }
    }

    if (emailExists) {
      Swal.fire("Duplicate Email", "This email is already used.", "warning");
      return;
    }

    let isSuccess = false;

    if (id) {
      // แก้ไขสมาชิก
      isSuccess = await member.updateMember(id, {
        name: member.name,
        surname: member.surname,
        birthDate: member.birthDate,
        isActive: member.isActive,
        email: member.email,
      });
    } else {
      // เพิ่มสมาชิกใหม่
      isSuccess = await member.submitForm();
    }

    if (isSuccess) {
      Swal.fire("Success", "Data saved successfully", "success");
      router.push("/memberlist");
    } else {
      Swal.fire("Error", "Something went wrong while saving.", "error");
    }
  } else {
    Swal.fire({
      title: "Cancelled",
      text: "Your action has been cancelled.",
      icon: "error",
    });
  }
}
</script>