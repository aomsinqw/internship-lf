import { defineStore } from "pinia";
import axios from "axios";
const url =
  "https://backend-f224d-default-rtdb.asia-southeast1.firebasedatabase.app/members.json";

function validateForm() {
  console.log("validate");
}

export const useMemberStore = defineStore("member", {
  state: () => ({
    count: 0,
    name: "",
    surname: "",
    birthDate: "",
    isActive: "",
    email: "",
  }),
  actions: {
    increment() {
      this.count++;
    },
    async submitForm() {
      console.log("name", this.name);
      console.log("date", this.birthDate);
      console.log("status", this.isActive);
      console.log("mail", this.email);
      console.log("surname", this.surname);

      //
      validateForm();
      //

      let headers = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      let body = {
        name: this.name,
        date: this.birthDate,
        status: this.isActive,
        email: this.email,
        surname: this.surname,
      };

      let response = await axios.post(url, body, headers);

      console.log("response", response);
    },
  },
  getters: {
    doubleCount: (state) => state.count * 2,
  },
});
