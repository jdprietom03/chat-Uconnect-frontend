

const Messages  = ({ messages, user }) => {
    return (
        <div className="messages">
            {messages && messages.map((message, key) => (
                <div className={`message ${ user === message.author ? 'me': ''}`} key={key}>
                    <span className="message-username">{message.author}</span>
                    <span className="message-content">{message.message}</span>
                </div>
            ))}
        </div>
    );
}

export default Messages;