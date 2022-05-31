import { useState } from 'react';

const Input = ({ sendMessage }) => {
    const [message, setMessage] = useState('');
    const handleSubmit = e => {
        e.preventDefault();  
        const messageCleared = message.trim();
        if(messageCleared !== '')
            sendMessage(message)
        setMessage('');
    }

    return (
        <form className="input-form" onSubmit={handleSubmit}>
            <input
                className="input"
                type="text"
                placeholder="Type a message..."
                value = {message}
                onChange={e => setMessage(e.target.value)}
                autoFocus
            />
            <button className="send" type="submit">Send</button>
        </form>
    );
};

export default Input;