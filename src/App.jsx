import React, { useState, useEffect } from 'react';
import supabase from './supabase';
import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [session, setSession] = useState(null);
  const [messagingUser, setMessagingUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, username');

      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data);
      }
    };

    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, user_id, content, created_at, users(username)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data);
      }
    };

    fetchUsers();
    fetchPosts();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      if (session && messagingUser) {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${session.user.id},receiver_id.eq.${messagingUser.id}),and(sender_id.eq.${messagingUser.id},receiver_id.eq.${session.user.id})`)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
        } else {
          setMessages(data || []);
        }
      }
    };

    loadMessages();
  }, [messagingUser, session]);

  const handlePostChange = (event) => {
    setNewPost(event.target.value);
  };

  const handleAddPost = async () => {
    if (newPost.trim() && session) {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            user_id: session.user.id,
            content: newPost,
          },
        ])
        .select('id, user_id, content, created_at, users(username)');

      if (error) {
        console.error('Error adding post:', error);
      } else {
        setPosts([data[0], ...posts]);
        setNewPost('');
      }
    }
  };

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (isLogin) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) {
          setMessage(error.message);
        } else {
          setMessage('Login successful!');
          console.log('Login successful:', data);
        }
      } catch (err) {
        setMessage('An unexpected error occurred.');
        console.error('Login error:', err);
      }
    } else {
      if (password !== confirmPassword) {
        setMessage('Passwords do not match.');
        return;
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              username: username,
            }
          }
        });

        if (error) {
          setMessage(error.message);
        } else {
          // Insert user data into the 'users' table
          const { error: userError } = await supabase
            .from('users')
            .insert([
              {
                id: data.user.id,
                username: username,
                email: email,
              },
            ]);

          if (userError) {
            setMessage('Signup successful, but failed to add user data.');
            console.error('Error adding user data:', userError);
          } else {
            setMessage('Signup successful! Please check your email to verify your account.');
            console.log('Signup successful:', data);
          }
        }
      } catch (err) {
        setMessage('An unexpected error occurred.');
        console.error('Signup error:', err);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMessage('Logged out successfully.');
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && messagingUser) {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: session.user.id,
            receiver_id: messagingUser.id,
            content: newMessage,
          },
        ])
        .select('*');

      if (error) {
        console.error('Error sending message:', error);
      } else {
        setMessages([...messages, data[0]]);
        setNewMessage('');
      }
    }
  };

  const openMessaging = (user) => {
    setMessagingUser(user);
  };

  const closeMessaging = () => {
    setMessagingUser(null);
  };

  return (
    <div className="app-container">
      {session ? (
        <>
          <div className="header">
            <button onClick={handleLogout}>Logout</button>
          </div>

          <div className="main-content">
            <div className="add-post">
              <textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={handlePostChange}
              />
              <button className="add-post-button" onClick={handleAddPost}>Add Post</button>
            </div>

            <div className="posts">
              {posts.map((post, index) => (
                <div key={post.id} className="post">
                  <span className="user-circle"></span>
                  <div className="post-author">{post.users.username}</div>
                  <div className="post-content">{post.content}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar">
            <h3>Users</h3>
            <ul>
              {users.map((user) => (
                <li
                  key={user.id}
                  className={selectedUser === user ? 'selected' : ''}
                  onClick={() => openMessaging(user)}
                >
                  <span className="user-circle"></span>
                  {user.username}
                </li>
              ))}
            </ul>
          </div>

          {messagingUser && (
            <div className="messaging-widget">
              <div className="messaging-header">
                <span>Messaging {messagingUser.username}</span>
                <button onClick={closeMessaging}>X</button>
              </div>
              <div className="message-list">
                {messages &&
                  messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender_id === session.user.id ? 'sent' : 'received'}`}>
                      {msg.content}
                    </div>
                  ))}
              </div>
              <div className="message-input">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="container">
          <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => handleInputChange(e, setUsername)}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => handleInputChange(e, setEmail)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => handleInputChange(e, setPassword)}
            />
            {!isLogin && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => handleInputChange(e, setConfirmPassword)}
              />
            )}
            <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
          </form>
          <p>{message}</p>
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
