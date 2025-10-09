<script setup lang="ts">
import { DyteMeeting } from "@dytesdk/vue-ui-kit";
import DyteClient from "@dytesdk/web-core";
import { onMounted, shallowRef } from "vue";

// NOTE: Use shallowRef, not ref
const meetingRef = shallowRef<DyteClient>();

onMounted(() => {
	const searchParams = new URLSearchParams(window.location.search);
	const authToken = searchParams.get("authToken");

	if (!authToken) {
		alert(
			"authToken was not passed in the query params, please pass it to join a meeting.",
		);
		return;
	}

	DyteClient.init({
		authToken,
	}).then((meeting) => {
		meetingRef.value = meeting;
	});
});
</script>

<template>
	<DyteMeeting :meeting="meetingRef" />
</template>
