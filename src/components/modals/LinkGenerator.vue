<template>
  <modal
    name="link-generator"
    width="420px"
    height="150px"
  >
    <b-row style="height:100px">
      <b-col>
        <div class="d-flex justify-content-center align-items-center h-100 flex-column mx-3">
          <b-input id="generator-input" class="generator-input" v-model="generatedLink" readonly />
        </div>
      </b-col>
    </b-row>
    <b-row style="height:50px">
      <b-col class="text-center">
        <b-button class="copy-button" @click="copyToClipboard" :class="{'copied-button': copied}">
          {{ copyText() }}
        </b-button>
      </b-col>
    </b-row>
  </modal>
</template>

<script>
  export default {
    props: {
      generatedLink: {
        type: String,
        default: 'https://google.com'
      }
    },

    data() {
      return {
        copied: false,
        copyText: () => {
          return this.copied ? 'СКОПІЙОВАНО!' : 'КОПІЮВАТИ!';
        }
      }
    },

    methods: {
      copyToClipboard() {
        const body = document.getElementsByTagName('body')[0];
        const linkInput = document.createElement('input');

        body.append(linkInput);

        linkInput.value = this.generatedLink;
        linkInput.select();

        document.execCommand("copy");

        linkInput.remove();

        this.copied = true;
      }
    }
  }
</script>

<style scoped>
  .generator-input {
    border-top-color: white;
    border-left-color: white;
    border-right-color: white;
    background: white;
  }

  .generator-input:focus {
    box-shadow: none;
    border-top-color: white;
    border-left-color: white;
    border-right-color: white;
  }

  .copy-button {
    background-color: #ac3b61;
    border-color: #ac3b61;
    font-size: 15px;
    border-radius: 30px;
  }

  .copied-button {
    background-color: #a3f358;
    border-color: #a3f358;
  }
</style>

