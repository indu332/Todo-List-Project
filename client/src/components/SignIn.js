import axios from 'axios';
import { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Navigate, useNavigate } from 'react-router-dom';
import AppNavbar from './AppNavbar';
import Alert from 'react-bootstrap/Alert';
import { URL } from '../App';

function SignIn() {
  const navigate = useNavigate();

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [toast,setToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${URL}/signin`,{email,password}).then(user => {
      // console.log(user);
      localStorage.setItem('token',user.data.token);
      setEmail('');
      setPassword('');
      navigate('/todos')
    }).catch(err => {
      console.log(err)
      setToast(true)
    })
  }

  function handleEmail(e){
    setEmail(e.target.value)
    setToast(false)
  }

  function handlePassword(e){
    setPassword(e.target.value)
    setToast(false)
  }

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
      navigate("/signin");
    })
  },[])

  return (
    <>
    <AppNavbar/>
    {toast ? <Alert key={'danger'} variant={"danger"}>
          Username or Password is incorrect. Please try again!
        </Alert> : null}
    <Container className="d-flex p-5 justify-content-center align-items-center">

    <Form style={{width:"450px",backgroundColor:"white"}} className="border shadow p-5" onSubmit={handleSubmit}>
    <h4 className='bg-primary text-light text-center rounded p-1'> Sign In </h4><br/>
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control value={email} onChange={(e) => handleEmail(e)} type="email" placeholder="Enter email" required/>
        </Form.Group>
        <br/>
        <Form.Group as={Col} controlId="formGridPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control value={password} onChange={(e) => handlePassword(e)} type="password" placeholder="Password" required/>
        </Form.Group>
        <br/>
      <Button style={{width:"100%"}} variant="success" type="submit">
        Submit
      </Button>
    </Form>
    
    </Container>
    </>
  );
}

export default SignIn;