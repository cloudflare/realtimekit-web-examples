<script setup>
import DyteClient from "@dytesdk/web-core";
import { onMounted, ref } from "vue";

const $meetingEl = ref();

onMounted(() => {
  const searchParams = new URLSearchParams(window.location.search);

  const authToken = searchParams.get("authToken");
  const roomName = searchParams.get("roomName") || "";

  if (!authToken) {
    alert(
      "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting."
    );
    return;
  }

  DyteClient.init({
    authToken,
    roomName,
  }).then((meeting) => {
    $meetingEl.value.meeting = meeting;
  });
});
</script>

<template>
  <dyte-meeting ref="$meetingEl" />
</template>
