import logo from './logo.svg';
import './App.css';
import AppNavbar from './components/AppNavbar';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const URL = process.env.REACT_APP_SERVER_URL;

function App() {
  const navigate = useNavigate();
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
      navigate("/");
    })
  },[])

  return (
    <>
    <AppNavbar />
    <Container className="p-4 font-mono">
      <Row>
        <div className='d-lg-flex align-items-center justify-content-evenly'>
          <div className='p-lg-5'>
          <h1 className='text-sm-fs-1'>Start Organizing Your Tasks Today!</h1>
          <br></br>
          <p className='fs-4'>Get ready to tackle your day with our Todlist, the ultimate task manager.</p>
          <br/>
          <div className="d-grid">
            <Button variant="primary" size="lg">
             <Link to='/signup'><span style={{color:"white",textDecoration:null}}>Sign up for free </span></Link>
            </Button>
          </div>
          <br/>
          <br/>
          </div>
          <div><img className='w-100 ' src="https://i.postimg.cc/zfzpXDT1/demo.png" /></div>
        </div>
      </Row>
      <br/>
      <br/>
      {/* <Row>
      <div className=' d-lg-flex align-items-center justify-content-evenly'>
      <div><img className='w-100' src="https://evernote.com/c/assets/features/notes-app/searching_made_easy@2x.png?f5f007e5bd4d17dd" /></div>
      
      <div className='p-lg-5'>
      <h1>Searching made easy</h1>
        <br></br>
        <p className='fs-4'>Find notes by searching for titles, dates, content types, and keywords—including words in pictures and handwriting—and get suggestions while you type.</p></div>
        </div>
      </Row> */}
     <br/>
     <br/>
     <br/>
     <br/>
      <Row>
      <div className=' d-lg-flex align-items-center justify-content-evenly'>
      <div><img className='w-100' src="https://i.postimg.cc/Kj21xjgP/analytics.png" /></div>
      <div className='p-lg-5'>
      <br/>
      <br/>
      <h1>Take notes and take action</h1>
        <br></br>
        <p className='fs-4'> • Revolutionize your productivity starting today!</p>
        <p className='fs-4'> • Streamline your daily tasks effortlessly.</p>
        <p className='fs-4'> • Never overlook important deadlines again!</p>
        <p className='fs-4'> • Seize control of your schedule with ease.</p>
        <p className='fs-4'> • Stay organized and focused - sign up now!</p>

        </div>
        
        </div>
      </Row>
      <Row>
        <div className='container text-center ' >© 2024 TaskNexa project. All rights reserved</div>
      </Row>
    </Container>
  
    </>
    
  );
}
  export default App;
  