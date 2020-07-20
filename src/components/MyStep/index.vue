<template>
  <div class="my-step">
    <template v-for="item in steps">
      <div :key="item.key" class="my-step-item">
        <step-item
          :text="item.text"
          :isActive="item.key <= currentStep"
          :isDone="currentStep > 1 && item.key <= currentStep"
          @click.native="toPath(item)"
        ></step-item>
        <div
          v-if="item.key < stepArr.length"
          :class="[
            'divide',
            item.key < currentStep ? 'divide-active' : 'divide-normal'
          ]"
        ></div>
      </div>
    </template>
  </div>
</template>

<script>
import StepItem from "./stepItem";
export default {
  components: {
    StepItem
  },
  props: {
    stepArr: {
      type: Array,
      required: true
    },
    currentStep: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      steps: []
    };
  },
  created() {
    this.formatData();
  },
  methods: {
    formatData() {
      this.stepArr.forEach((item, index) => {
        let newItem = Object.assign({}, item, { key: index + 1 });
        this.steps.push(newItem);
      });
    },
    toPath(item) {
      if (this.currentStep > item.key) {
        this.$router.push(item.path);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.my-step {
  margin: 20px 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .my-step-item {
    display: flex;
    align-items: center;
    .divide {
      margin: 0 6px;
      width: 130px;
    }
    .divide-active {
      border-top: 2px solid #3369ff;
    }
    .divide-normal {
      border-top: 2px solid #d6d8df;
    }
  }
}
</style>
