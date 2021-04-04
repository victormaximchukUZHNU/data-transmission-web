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
      <b-row class="h-100">
        <b-col cols="8">
          VIDEO HERE
        </b-col>
        <b-col cols=4>
          <div class="h-75 chat-area pb-3">
            <div v-for="message in messages">
              <ChatItem :message="message" />
            </div>
          </div>
          <div>
            <b-row>
              <b-col cols="9" class="pr-0">
                <b-input class="chat-input" splaceholder="Type message here..." v-model="messageText"/>
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
    </div>
  </div>
</template>

<script>
import ChatItem from './chat/ChatItem';
import RoomNotFound from './states/RoomNotFound';
import LoadingPage from './states/LoadingPage';
import PasswordPage from './states/PasswordPage';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    ChatItem,
    RoomNotFound,
    LoadingPage,
    PasswordPage
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
      if (this.isSendFromRemote(message.senderId)) {
        message.incoming = true;
      }

      this.messages.push(message);
    },

    participantConnected(senderId) {
      if (this.currentJoinStep === 'live_stream' && this.isSendFromRemote(senderId)) {
        this.$notify({
          group: 'app',
          text: `${senderId} приєднався.`,
          type: 'info'
        })
      }
    }
  },

  computed: {
    ...mapGetters('room', ['roomNotFound', 'loading', 'currentJoinStep']),

    roomId() {
      return this.$route.params.id;
    }
  },

  watch: {
    currentJoinStep(joinStep) {
      if (joinStep && joinStep === 'live_stream') {
        this.$socket.emit('participantConnected', {
          roomId: this.roomId,
          senderId: this.uniqId
        })
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
    },

    isSendFromRemote(senderId) {
      return this.uniqId !== senderId;
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
    max-height: 75vh;
  }

  .chat-input {
    border-radius: 0;
  }

  .chat-input:focus {
    box-shadow: none;
    border-color: darkgray;
  }

</style>
