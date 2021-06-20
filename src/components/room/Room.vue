<template>
  <div>
    <div v-if="loading">
      <LoadingPage />
    </div>
    <div v-if="roomNotFound && !loading">
      <RoomNotFound />
    </div>
    <div v-if="currentJoinStep === 'join_form' && !loading">
      <PasswordPage />
    </div>
    <div v-else-if="currentJoinStep === 'live_stream' && !loading" class="container-fluid vh-100">
      <b-row style="height: 85% !important;">
        <b-col cols="8" class="pr-0">
          <Stream :options="{ uniqId: this.uniqId, roomId: this.roomId }"/>
        </b-col>
        <b-col cols=4 class="pl-0" style="max-height: 100%">
          <div class="chat-area pb-3">
            <div v-for="message in messages">
              <ChatItem :message="message" />
            </div>
          </div>
          <div>
            <b-row>
              <b-col cols="9" class="pr-0">
                <b-input
                  class="chat-input"
                  @keydown.enter.native.prevent="sendMessage"
                  placeholder="Напишіть повідомлення..."
                  v-model="messageText"
                />
              </b-col>
              <b-col cols="3" class="pl-0">
                <b-button class="send-message-button w-100" @click="sendMessage">
                  Надіслати
                </b-button>
              </b-col>
            </b-row>
          </div>
        </b-col>
      </b-row>
      <DeviceActions />
    </div>
  </div>
</template>

<script>
import ChatItem from './chat/ChatItem';
import RoomNotFound from './states/RoomNotFound';
import LoadingPage from './states/LoadingPage';
import PasswordPage from './states/PasswordPage';
import Stream from './stream/Stream';
import DeviceActions from './stream/DeviceActions'
import isSendFromRemote from './stream/helpers/isSendFromRemote';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    ChatItem,
    RoomNotFound,
    LoadingPage,
    PasswordPage,
    Stream,
    DeviceActions
  },

  data() {
    return {
      messageText: '',
      messages: [],
      uniqId: ''
    }
  },

  sockets: {
    message(message) {
      message.incoming = isSendFromRemote(message.senderId);

      this.messages.push(message);
    },

    participantConnected({ senderId }) {
      if (this.currentJoinStep === 'live_stream' && isSendFromRemote(senderId)) {
        this.$notify({
          group: 'app',
          text: `${senderId} приєднався.`,
          type: 'info'
        });
      }
    },

    participantDisconnected (senderId) {
      if (this.currentJoinStep === 'live_stream' && isSendFromRemote(senderId)) {
        this.$notify({
          group: 'app',
          text: `${senderId} від'єднався.`,
          type: 'warn'
        });
      }
    }
  },

  computed: {
    ...mapGetters('room', ['roomNotFound', 'loading', 'currentJoinStep']),
    ...mapGetters('stream', ['isCameraEnabled', 'isMicrophoneEnabled']),

    roomId() {
      return this.$route.params.id;
    }
  },

  watch: {
    currentJoinStep(joinStep) {
      if (joinStep && joinStep === 'live_stream') {
        this.$socket.emit('participantConnected', {
          roomId: this.roomId,
          senderId: this.uniqId,
          isParticipantCameraEnabled: this.isCameraEnabled,
          isParticipantMicrophoneEnabled: this.isMicrophoneEnabled
        });
      }
    }
  },

  created() {
    this.getRoom(this.roomId)
      .then(() => {
        this.$socket.emit('chatConnected', this.roomId);

        if (!localStorage.uniqId) {
          localStorage.uniqId = this.generateName();
        }

        this.uniqId = localStorage.uniqId;
      });

    window.onbeforeunload = () => {
      this.$socket.emit('participantDisconnected', {
        roomId: this.roomId,
        senderId: this.uniqId
      });
    }
  },

  methods: {
    ...mapActions('room', ['getRoom']),

    sendMessage() {
      if (!this.messageText) return;

      const messageObject = {
        message: this.messageText,
        senderId: this.uniqId
      };

      this.$socket.emit('message', { ...messageObject, roomId: this.roomId });

      this.messages.push(messageObject);
      this.messageText = '';
    },

    generateName() {
      return '_' + Math.random().toString(36).substr(2, 9);
    }
  }
}
</script>

<style scoped>
  .send-message-button {
    background-color: #26495c;
    border-color: #26495c;
    border-radius: 0;
    font-weight: 600;
  }

  .send-message-button:hover {
    background-color: #26495c;
    border-color: #26495c;
  }

  .send-message-button:active {
    background-color: #26495c !important;
    border-color: #26495c !important;
  }

  .chat-area {
    background: #e5e5dc;
    overflow-y: scroll;
    height: calc(100% - 38px) !important;
  }

  .chat-input {
    border-radius: 0;
  }

  .chat-input:focus {
    box-shadow: none;
    border-color: darkgray;
  }

</style>
