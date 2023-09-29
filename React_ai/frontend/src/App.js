import './App.css';
import {useState,useEffect} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';

function App() {
  const [value,setValue] = useState(null);
  const [message,setMessage] = useState(null);
  const [chats,setChats] = useState([]);
  const [title,setTitle] = useState(null);
  const [favoriteStory,setFavoriteStory] = useState([]);

  const clearChat=()=>{
    setMessage(null)
    setValue('')
    setTitle(null)
    setFavoriteStory([])
  }

  const save=async()=>{
    try{
      await axios.post('http://localhost:5555/story', { 
        title:title,
        content:message.content
       });
    }catch(err){
      console.log(err)
    }
    setTimeout(() => {
      axios.get('http://localhost:5555/story')
      .then((res)=>{
        setFavoriteStory(res.data.data)
      }).catch(err=>console.log(err))
    }, 2000);
  }

  useEffect(()=>{
    axios.get('http://localhost:5555/story')
    .then((res)=>{
      setFavoriteStory(res.data.data)
    }).catch(err=>console.log(err))
  },[])

  const getMessage = async() =>{
    try {
      const response = await fetch('http://localhost:5555/completions',{
        method:'POST',
        body:JSON.stringify({
          message:value
        }),
        headers:{
          "Content-Type":"application/json"
        }
      })
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(()=>{
    // console.log(title,value,message)

    if(!title && value && message){
      setTitle(value)
    }
    if(title && value && message){
      setChats(chat=>
        [...chat,{
          title:title,
          role:"user",
          content:value
        },{
          title:title,
          role:message.role,
          content:message.content
        }]
        )
    }
  },[message,title])
  const currentChat = chats.filter(chat=>chat.title === title)
  // const uniqueTitles = Array.from(new Set(chats.map(chat=>chat.title)))
  return (
    <div className="app">
      <section className="favorite">
        <div className="title">Your Chats</div>
        <div className="items">
          {
            favoriteStory.map(story=>(
               <ul className='story'>
                <li key={story._id}>Title: {story.title}</li>
                <li key={story._id}>Content: {story.content}</li>
               </ul>
            ))
          }
        </div>
      </section>

      <section className="chat-session">
        <div className='logo'>
          React Ai
          <h5>Kyaw&Coding</h5>
        </div>

        <div className="result-container">
          <div className='clear'>
            <button className='clearBtn' onClick={clearChat}>Clear</button>
          </div>
          <div className='result'>
            <ul className='feed'>
              {currentChat?.map((chatMessage,index)=><li key={index}>
                <p className='role'>{chatMessage.role}</p>
                <p>{chatMessage.content}</p>
              </li>)} 
              <div className='mark'>
                <button className='saveBtn' onClick={save}>Save</button>
              </div>
            </ul>
          </div>
        </div>

        <div className="chat">
          <div className="input-bar">
            <input value={value} onChange={(e)=>setValue(e.target.value)}/>
            <button type='submit' onClick={getMessage}>&gt;&gt;</button>
          </div>
          <div className="year">
            &copy;2023 by Kyaw&Coding
          </div>
        </div>
      </section>
      
    </div>
  );
}

export default App;
