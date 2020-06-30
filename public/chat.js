const app = new Vue({
    el: '#app',
    data() {
        return  {
            name: '',
            message: '',
            socket: null,
            output: [],
            feedback: '',
            typing: false
        }      
    },
    methods: {
        send() {
            if (this.message === '' || this.name === '') {
                alert('The name or message field cannot be empty!')
            } 
            else {
                this.socket.emit('chat', {
                    name: this.name,
                    message: this.message
                })
                this.message = "";
            } 
        }
    },
    created() {
        this.socket = io.connect('http://localhost:3000');
    },
    mounted() {
        this.socket.on('chat', data => {
            this.output.push({
                name: data.name,
                message: data.message
            });
        });

        this.socket.on('typing', data => {
            this.feedback = data + ' is typing...'; 
            this.typing = true;       
        });

        this.socket.on('stopTyping', () => {
            this.typing = false;
        });
    },
    watch: {
        message(value) {
            value ? this.socket.emit('typing', this.name) : this.socket.emit('stopTyping')
        }
    },
    filters: {
        capitalize: function (value) {
          if (!value) return ''
          value = value.toString()
          return value.charAt(0).toUpperCase() + value.slice(1)
        }
      }
})