<template>
  <input
    id="datepicker"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script lang="ts">
import { easepick } from "@easepick/core";
import { RangePlugin } from "@easepick/range-plugin";
import { LockPlugin } from "@easepick/lock-plugin";
export default {
  name: "EasePick",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  mounted() {
    const bookedDates = [
      "2022-12-02",
      ["2022-12-06", "2022-12-11"],
      "2022-12-18",
      "2022-12-19",
      "2022-12-20",
      "2022-12-25",
      "2022-12-28",
    ].map((d) => {
      if (d instanceof Array) {
        const start = new Date(d[0], "YYYY-MM-DD");
        const end = new Date(d[1], "YYYY-MM-DD");
        return [start, end];
      }
      return new Date(d, "YYYY-MM-DD");
    });
    const picker = new easepick.create({
      element: document.getElementById("datepicker"),
      css: [
        "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.0/dist/index.css",
        "https://easepick.com/css/demo_hotelcal.css",
      ],
      plugins: [RangePlugin, LockPlugin],
      RangePlugin: {
        tooltipNumber(num) {
          return num - 1;
        },
        locale: {
          one: "night",
          other: "nights",
        },
      },
      LockPlugin: {
        minDate: new Date(),
        // minDays: 2,
        inseparable: true,
        filter(date, picked) {
          if (picked.length === 1) {
            const incl = date.isBefore(picked[0]) ? "[)" : "(]";
            return (
              !picked[0].isSame(date, "day") && date.inArray(bookedDates, incl)
            );
          }
          return date.inArray(bookedDates, "[)");
        },
      },
    });
  },
};
</script>
