import { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import AppNavbar from './AppNavbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import  Alert  from 'react-bootstrap/Alert';
import { URL } from '../App';
// import 'bootstrap/dist/css/bootstrap.min.css';

function SignUp() {
  const navigate = useNavigate();
  const [username,setUsername] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [toast,setToast] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${URL}/protected`,{
      headers : {
        Authorization : token,
      }
    }).then(res => {
      navigate('/todos')
      // console.log(res);
    }).catch(err => {
      console.log(err);
      navigate("/signup");
    })
  },[])

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("hello")
    axios.post(`${URL}/signup`,{username,email,password}).then(user => {
      // console.log(user)
      setUsername('');
      setEmail('')
      setPassword('');
      navigate('/signin')
    }).catch(err => {
      setToast(true)
      // console.log(err)
    })
  }
  
  function handleEmail(e){
    setEmail(e)
    setToast(false)
  }

  function handlePassword(e){
    setPassword(e)
    setToast(false)
  }

  function handleUsername(e){
    setUsername(e)
    setToast(false)
  }

  return (
    <>
    <AppNavbar/>
    {toast ? <Alert key={'danger'} variant={"danger"}>
          Provided  Email already exists. pease try another mail!
        </Alert> : null}
    <Container className="d-flex p-5 justify-content-center align-items-center">
    
    <Form style={{width:"450px",backgroundColor:"white"}} className="border shadow p-5" onSubmit={handleSubmit}>
    <h4 className='bg-primary text-light text-center rounded p-1'> Sign Up </h4><br/>
        <Form.Group  as={Col} controlId="formGridEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control value={username} onChange={(e) => handleUsername(e.target.value)} type="text" placeholder="Enter username" required/>
        </Form.Group>
        <br/>
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control value={email} onChange={(e) => handleEmail(e.target.value)} type="email" placeholder="Enter email" required/>
        </Form.Group>
        <br/>
        <Form.Group as={Col} controlId="formGridPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control value={password} onChange={(e) => handlePassword(e.target.value)} type="password" placeholder="Password" required/>
        </Form.Group>
        <br/>
      <Button style={{width:"100%"}} onClick={handleSubmit} variant="success" type="submit">
        Submit
      </Button>
    </Form>
    </Container>
    
    </>
  );
}

export default SignUp;