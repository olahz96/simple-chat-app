let date = new Date();
let currentTime = ('0' + date.getHours()).slice(-2) + ':' + date.getMinutes();

const app = new Vue({
    el: '#app',
    data() {
        return  {
            name: '',
            message: '',
            socket: null,
            output: [],
            feedback: '',
            typing: false,
            state: 0,
            joinMessage: null
        }      
    },
    methods: {
        send() {
            if (this.message === '') {
                alert('The message field cannot be empty!')
            } 
            else {
                this.socket.emit('chat', {
                    name: this.name,
                    message: this.message,
                    time: currentTime
                })
                this.message = "";
            } 
        },
        setUser() {
            if (this.name === '') {
                alert('The name field cannot be empty!')
            } 
            else {
                this.socket.emit('setUser', this.name);
                this.state = 1;
            }   
        },
        changeUser() {
            this.state = 0;
        }
    },
    created() {
        this.socket = io.connect('http://localhost:3000');
    },
    mounted() {
        this.socket.on('chat', data => {
            this.output.push({
                name: data.name,
                message: data.message,
                time: data.time
            });
        });

        this.socket.on('typing', data => {
            data = data.charAt(0).toUpperCase() + data.slice(1);

            this.feedback = data + ' is typing...'; 
            this.typing = true;       
        });

        this.socket.on('stopTyping', () => {
            this.typing = false;
        });

        this.socket.on('joinMessage', data => {
            this.joinMessage = data;

            setTimeout(() => {
                this.joinMessage = null;
            }, 5000);
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