import React ,{ Component,Fragment } from 'react';
import img from '../static/number1.jpg';

class Sentence extends Component{
    constructor(props){
        super(props);
        const url='https://api.ooopn.com/ciba/api.php?type=json';
        this.state={
            ciba:'',
            ciba_en:'',
            imgurl:'',
            date:new Date()
        };
        
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            mode: 'cors',
            cache: 'default'
        })
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                this.setState({
                    ciba:data.ciba,
                    ciba_en:data['ciba-en'],
                    imgurl:data.imgurl
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    

    render(){
        return(
            <Fragment>
            <div style={{height:'700px', background:"url("+require("../static/number1.jpg")+")",backgroundSize:'100% 100%'}}>
                &nbsp;
                <div style={{ width:'80%',margin:'100px auto'}}>
                    <div style={{fontSize:'30px',color:'#ff9900',marginBottom:'40px'}}>{this.state.ciba_en}</div>
                    <div style={{fontSize:'25px',textIndent:'2em'}}>{this.state.ciba}</div>
                    <div>{this.state.date.getDay}</div>
                </div>
                &nbsp;
                &nbsp;
                

                

                
            </div>
            </Fragment>
        )
    }
}

export default Sentence;