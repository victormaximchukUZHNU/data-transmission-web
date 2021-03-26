<template>
  <div>
    <div v-if="message.incoming" class="d-flex justify-content-start ml-2 mt-3">
      <div class='incoming-message p-3'>
        <div class="sender d-flex justify-content-between">
          {{message.senderId}}:
          <span class="timestamp">
            {{timestamp}}
        </span>
        </div>
        <div>
          {{message.message}}
        </div>

      </div>
    </div>
    <div v-else class="d-flex justify-content-end mr-2 mt-3">
      <div class='outgoing-message p-3'>
        <div class="sender d-flex justify-content-between">
          Ви:
          <span class="timestamp">
            {{timestamp}}
          </span>
        </div>
        <div>
          {{message.message}}
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  props: {
    message: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      timestamp: moment().format('hh:mm:ss')
    }
  }
}
</script>

<style scoped>
  .incoming-message {
    text-align: left;
    min-width: 50%;
    max-width: 80%;
    min-height: 75px;
    background-color: white;
    border: 1px solid;
    border-color: #a9a9a9;
    text-overflow: ellipsis;
    border-radius: 10px 10px 10px 0;
    word-break: break-word;
  }

  .outgoing-message {
    text-align: left;
    min-width: 50%;
    max-width: 80%;
    min-height: 75px;
    background-color: white;
    border: 1px solid;
    border-color: #26495c50;
    border-radius: 10px 10px 0 10px;
    word-break: break-word;
  }

  .sender {
    color: darkgray;
    font-size: 13px;
  }

  .timestamp {
    font-size: 10px;
    font-weight: 400;
    color: darkgray;
  }

</style>

