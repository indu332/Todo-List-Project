import 'bootstrap/dist/css/bootstrap.css';
import AppNavbar from "./AppNavbar";
import {FaUserCircle} from 'react-icons/fa'

import {Link,Outlet} from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { URL } from '../App';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Profile = () => {
    const navigate = useNavigate();
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [userdata,setUserdata] = useState([]);
    const [isData,setIsdata] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${URL}/protected`,{
          headers : {
            Authorization : token,
          }
        }).then(res => {
            axios.post(`${URL}/analatics`,{id:res.data.user.id}).then(resp => {
                setUsername(resp.data.userdata.username);
                setEmail(resp.data.userdata.email);
                setUserdata([resp.data.userdata.todos-resp.data.userdata.completedTodos,resp.data.userdata.todos,resp.data.userdata.completedTodos]);
            }).catch(err => {
                console.log(err);
            })

        }).catch(err => {
          console.log(err);
          navigate("/signin");
        })
      },[])


 const data = {
        labels: [ 'Not Completed', 'To-do\'s', 'Completed'],
        datasets: [
          {
            label: '# of items',
            data:userdata,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };

    return (
        <>
            <AppNavbar logged={true}/>
            <div style={{background:"linear-gradient(270deg, rgba(75, 106, 160, 1), rgba(223, 228, 242, 1))"}} className="container d-lg-flex justify-content-evenly align-items-center border shadow p-5 rounded">
                <div><FaUserCircle color='white' fontSize={"120"}/></div>
                <div className=''>
                    <h4>{username}</h4>
                    <p>{email}</p>
                    <p><Link className='bg-danger border rounded text-decoration-none' style={{padding:"5px",backgroundColor:"#2249c"}} to="/logout"><span className='rounded' style={{color:"white"}}>Logout</span></Link></p>
                </div>
            </div>
            <br/>
            <br/>
            <div style={{background: "linear-gradient(90deg, rgba(75, 106, 160, 1), rgba(223, 228, 242, 1))"}} className="container d-lg-flex justify-content-evenly align-items-center border shadow p-5 rounded">
                <div className='p-4'><h4>User Analatics</h4>
                <p>A complete analysis about number of to-do's and completed to-do's
                    are represented using a beautiful pie chart to understand your usage of the app. You can also get a clearing understanding of 
                    how determined you are for completing the tasks.
                </p>
                </div>
                <div>
                {(userdata[0]==0 && userdata[1]==0) ? null : <Pie data={data} />}
                </div>
            </div>
        </>
        
    )
}

export default Profile;