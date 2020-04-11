<template>
	<div id="app">
		<h3>Firebase Data</h3>
		<pre>{{ firebaseData }}</pre>

		<h3>Form data</h3>
		<pre>{{ formData }}</pre>

		<div v-if="state === 'synced'">
			✅
		</div>

		<div v-else-if="state === 'modified'">
			✏️
		</div>

		<div v-else-if="state === 'error'">
			❌
		</div>

		<div v-else-if="state === 'loading'">
			⏱
		</div>

		<form @submit.prevent="updateFirebase">
			<label>
				Name:
				<input
					type="text"
					name="name"
					v-model="formData.name"
					@input="fieldUpdate"
			/></label>
			<br />
			<label>
				Email:
				<input
					type="email"
					name="email"
					v-model="formData.email"
					@input="fieldUpdate"
			/></label>
			<br />
			<label>
				Phone:
				<input
					type="tel"
					name="phone"
					v-model="formData.phone"
					@input="fieldUpdate"
			/></label>
			<br />

			<input type="submit" value="Ok" />

			<button @click="revertToOriginal">Revert</button>
		</form>
	</div>
</template>

<script>
import { debounce } from "debounce";

import db from "./firebase/db";

const documentPath = "contacts/mckayla";

export default {
	name: "App",

	data() {
		return {
			firebaseData: null,
			originalData: null,
			formData: {},
			state: "loading",
			errorMessage: "",
		};
	},

	firestore() {
		return {
			firebaseData: db.doc(documentPath),
		};
	},

	methods: {
		async updateFirebase() {
			try {
				await db.doc(documentPath).set(this.formData);
				this.state = "synced";
			} catch (e) {
				this.errorMessage = JSON.stringify(error);
				this.state = "error";
			}
		},

		fieldUpdate() {
			this.state = "modified";
			this.debouncedUpdateFirebase();
		},

		debouncedUpdateFirebase: debounce(function () {
			this.updateFirebase();
		}, 1500),

		revertToOriginal() {
			this.state = "revoked";
			this.formData = { ...this.originalData };
		},
	},

	created: async function () {
		const docRef = db.doc(documentPath);

		let data = (await docRef.get()).data();

		if (!data) {
			data = { name: "", phone: "", email: "" };
			docRef.set(data);
		}

		this.originalData = { ...data };
		this.state = "synced";
	},
};
</script>

<style>
:root {
	font-size: 30px;
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
