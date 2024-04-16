import React, { useState,useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';
import AppNavbar from './AppNavbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/esm/Row';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import {FcSurvey,FcCheckmark} from 'react-icons/fc'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { URL } from '../App';

export default function Todos() {
  const [todoData,setTodoData] = useState('');
  const [time,setTime] = useState('');
  const [date,setDate] = useState('');
  const [username,setUsername] = useState('');
  const [email,setEmail] = useState('')
  const [todos,setTodos] = useState([]);
  const [key, setKey] = useState('todos');
  const [timer,setTimer] = useState(0)
  const [userid,setUserid] = useState('')
  const [update,setUpdate] = useState(false)
  const [todoid,setTodoid] = useState('');

  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${URL}/addtodos`,{username,todoData,time,email,userid,date}).then(res => {
      setTodoData('');
      setTime('');
      setDate('')
      // console.log(res);
      setTodos([...todos,{username,todoData,time}])
      displayData();
    }).catch(err => {
      console.log(err);
    })
  }

  function handleDone(id){
    axios.post(`${URL}/marktodo`,{id,userid}).then(res => {
      // console.log(res);
      displayData();
    }).catch(err => {
      console.log(err);
    })
  }

  function handleDelete(id){
    axios.post(`${URL}/deletetodo`,{id}).then(res => {
      // console.log(res);
      displayData();
    }).catch(err => {
      console.log(err);
    })
  }

  const displayData = () => {
    axios.post(`${URL}/todos`,{username:username}).then(res => {
        setTodos([...res.data.todos])
        // console.log([...res.data.todos]);
      }).catch(err => {
        console.log(err);
      })
  }

  const handleUpdate = (id,data,time,date) => {
    setUpdate(true);
    setTodoData(data);
    setTime(time);
    setDate(new Date(date));
    setTodoid(id);
  }

  const updateTodo = () => {
    axios.post(`${URL}/updatetodo`,{todoid,todoData,time,date}).then(res => {
      // console.log(res);
      setTodoData('');
      setTime('');
      setDate('')
      displayData();
      setUpdate(false)
    }).catch(err => {
      console.log(err);
    })
  }

  const cancelUpdate = () => {
    setTodoData('');
      setTime('');
      setDate('')
      setUpdate(false);
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${URL}/protected`,{
      headers : {
        Authorization : token,
      }
    }).then(res => {
      setUsername(res.data.user.username);
      setEmail(res.data.user.email);
      setUserid(res.data.user.id);
      axios.post(`${URL}/todos`,{username:res.data.user.username}).then(res => {
        setTodos([...res.data.todos])
        // console.log([...res.data.todos]);
      }).catch(err => {
        console.log(err);
      })
    }).catch(err => {
      console.log(err);
      navigate("/signin");
    })
  },[])

  return (
    <>
    <AppNavbar logged={true} />
    <h3  style={{color:"#011440"}} className='text-center'>Save To-do's & Take Actions.</h3>
    <br/>
    <Container className='border shadow p-5 rounded' style={{minHeight:"600px",backgroundColor:"white"}}> 
    <h4 className='text-primary'>Welcome {username} !</h4>     
        <Form onSubmit={handleSubmit}>
    <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>Write your todo..</Form.Label>
          <Form.Control value={todoData} onChange={(e) => setTodoData(e.target.value)} name="todoData" type="text" placeholder="Enter todo" required/>
        </Form.Group>
        <br></br>
        <Row>
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>Target Time</Form.Label>
          <Form.Control value={time} onChange={(e) => setTime(e.target.value)} name="time" type="time" placeholder="Enter time"/>
        </Form.Group>
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>Target Date</Form.Label>
          <Form.Control value={date} onChange={(e) => setDate(e.target.value)} name="time" type="date" placeholder="Enter time"/>
        </Form.Group>
        </Row>
        <br/>
        {update ? <>
          <Button className='me-2' onClick={updateTodo} variant="primary"> Update </Button> 
          <Button onClick={cancelUpdate} variant="danger" type="Cancel">Cancel</Button>
        </> : <Button variant="primary" type="submit">Submit</Button>}
        
        
      </Form>
      <br/>
      <h4>Your To-do's : </h4><br/>
      {todos.length != 0 ? <Row style={{maxHeight:"535px"}} className='overflow-auto'>
        <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3"
    >
      <Tab eventKey="todos" title="Todos">
        {todos.filter((item) => item.completed == false).length != 0 ? 
      <>
      {todos.filter((item) => item.completed == false).map((todo,indx) => {
      return (
        <Container style={{backgroundColor:todo.expired && "rgb(243 178 177)"}} key={indx} className='border shadow p-2 mb-3 rounded '>
        <div  className='d-lg-flex '>
          <div className=' d-flex justify-content-center align-items-center'><FcSurvey fontSize={40}/></div>
          <div className=" m-3 d-lg-flex justify-content-center align-items-center">
          
            <div className="fw-bold text-success">{todo.todoData}
            <div className="fw-light"><span style={{fontSize:"0.8rem"}} className='fw-bold text-danger'>Deadline : </span><span style={{fontWeight:"600",fontSize:"13px"}}>{todo.time != '' ? todo.expired ? "Expired" : todo.time+" "+new Date(todo.date).getDate()+"/"+(new Date(todo.date).getMonth()+1)+"/"+new Date(todo.date).getFullYear() : "Not mentioned"}</span></div>
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center ms-auto">
          <Button onClick={() => handleDone(todo._id)} className='me-2'  variant="success" size='sm'>Done</Button>
          <Button onClick={() => handleDelete(todo._id)} className='me-2' variant="danger" size='sm'>Delete</Button>
          <Button onClick={() => handleUpdate(todo._id,todo.todoData,todo.time,todo.date)} variant="primary" size='sm'>Update</Button>
            </div>
        </div>
      </Container>
      )
     })}
      </>  : <h5>No todos to complete.</h5>
      }
      </Tab>
      <Tab eventKey="history" title="History">
      {todos.filter((item) => item.completed == true).length != 0 ? 
      <>
      {todos.filter((item) => item.completed == true).map((todo,indx) => {
      return (
        <Container style={{backgroundColor:"#a2c4ae"}} key={indx} className='border shadow p-2 mb-3 rounded '>
        <div  className='d-flex'>
          <div className=' d-flex justify-content-center align-items-center'><FcCheckmark fontSize={40}/></div>
          <div className=" m-3 d-flex justify-content-start align-items-center">
            <div className="fw-normal text-decoration-line-through">{todo.todoData}
            <div className="fw-light"> {todo.time}</div>
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center ms-auto">
          <Badge bg='success'>Completed</Badge>
            </div>
        </div>
      </Container>
      )
     })}
     </>  : <h5>No completed todos.</h5>
      }
      </Tab>
    </Tabs>
      </Row> : <h5>No todos</h5>}
      </Container>
    </>
  )
}
