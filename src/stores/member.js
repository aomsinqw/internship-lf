import { defineStore } from 'pinia';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL; // ✅ ไม่รวม /members.json

export const useMemberStore = defineStore("member", {
  state: () => ({
    name: "",
    surname: "",
    birthDate: "",
    isActive: null,
    email: "",
    members: [],
  }),

  actions: {
    async submitForm() {
      try {
        const payload = {
          name: this.name,
          surname: this.surname,
          birthDate: this.birthDate,
          isActive: this.isActive,
          email: this.email,
        };
        await axios.post(`${baseURL}/members.json`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        await this.getMember();
        this.resetForm();
        return true;
      } catch (err) {
        console.error("Error submitting:", err);
        return false;
      }
    },

    async emailIsExist() {
      try {
        const query = `?orderBy="email"&equalTo="${this.email}"`;
        const res = await axios.get(`${baseURL}/members.json${query}`);
        return res.data && Object.keys(res.data).length > 0;
      } catch (err) {
        console.error("Error checking email:", err);
        return false;
      }
    },

    async getMember() {
      try {
        const res = await axios.get(`${baseURL}/members.json`);
        this.members = res.data
          ? Object.entries(res.data).map(([id, value]) => ({ id, ...value }))
          : [];
      } catch (err) {
        console.error("Error loading members:", err);
        this.members = [];
      }
    },

    async deleteMember(id) {
      try {
        await axios.delete(`${baseURL}/members/${id}.json`);
        await this.getMember();
      } catch (err) {
        console.error("Error deleting member:", err);
      }
    },

    async updateMember(id, updatedData) {
      try {
        await axios.patch(`${baseURL}/members/${id}.json`, updatedData, {
          headers: { "Content-Type": "application/json" },
        });
        await this.getMember();
        return true;
      } catch (err) {
        console.error("Error updating member:", err);
        return false;
      }
    },

    resetForm() {
      this.name = "";
      this.surname = "";
      this.birthDate = "";
      this.isActive = null;
      this.email = "";
    },
  },

  getters: {
    usersWithStatus: (state) =>
      state.members.map((m) => ({
        ...m,
        statusText: m.isActive ? "active" : "inactive",
      })),
  },
});