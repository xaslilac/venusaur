<template>
	<div id="app">
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

		<div class="data">
			<h3>Firebase Data</h3>
			<pre>{{ firebaseData }}</pre>
		</div>

		<div class="data">
			<h3>Form data</h3>
			<pre>{{ formData }}</pre>
		</div>

		<div>
			<h3>
				Sync Status
				<span v-if="state === 'synced'">
					✅
				</span>

				<span v-else-if="state === 'modified'">
					✏️
				</span>

				<span v-else-if="state === 'error'">
					❌
				</span>

				<span v-else-if="state === 'loading'">
					⏱
				</span>
			</h3>

			<span v-if="state === 'error'">
				{{ errorMessage }}
			</span>
		</div>
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
				await db.doc(documentPath).set({
					...this.formData,
					enabled: true, // just assume it's enabled. disable from firebase.
				});
				this.state = "synced";
			} catch (error) {
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
			this.updateFirebase();
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
		this.formData = { ...data };
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

.data {
	display: inline-block;
	padding-inline-end: 1em;
}

pre {
	background-color: palegreen;
	border-radius: 4px;
	padding: 0.3em;
	width: max-content;
}

button,
input {
	font-family: inherit;
	font-size: 0.8em;
	line-height: 1.5em;
	padding: 0.3em;
	margin: 0.3em;

	border-color: gray;
	border-radius: 4px;
	border-style: solid;
	border-width: 1px;
}

button,
input[type="submit"] {
	background-color: springgreen;
}
</style>
