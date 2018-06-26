import React, {Component} from 'react';

class App extends Component {

    constructor(){
        super();
        this.state = {
            title      : '',
            description: '',
            tasks      : [],
            _id        : ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.addTask      = this.addTask.bind(this);
    }

    componentDidMount(){
        this.fetchTasks();
    }

    addTask(e){
        
        e.preventDefault();

        if (this.state._id) {
            
            fetch(`/api/tasks/${this.state._id}`, {
                method : 'PUT',
                body   : JSON.stringify(this.state),
                headers: {
                'Accept'      : 'appication/json',
                'Content-Type': 'application/json'
            }
            })
            .then(res=>res.json())
            .then(data => {
                console.log(data)
                M.toast({html: 'Task Updated'});
                this.setState({title: '', description: '', _id: ''});
                this.fetchTasks();                
                })



        }else{
            fetch('/api/tasks', {
            method : 'POST',
            body   : JSON.stringify(this.state),
            headers: {
                'Accept'      : 'appication/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json()).then(data => {
            console.log(data);
            M.toast({html: 'Task Saved'});
            this.setState({title: '', description: ''});     
            this.fetchTasks();       
        })
        .catch(err => console.error(err));
        }        
       
        
    }


    fetchTasks(){
        fetch('/api/tasks')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            this.setState({tasks: data});
        });
    }


    handleChange(e){
        const {name, value} = e.target;
        this.setState({
            [name]: value
        });

    }

    deleteTask(id){

        if (confirm('Are you sure you want to delete')) {
            fetch(`/api/tasks/${id}`,{
            method : 'DELETE',
            headers: {
                'Accept'      : 'appication/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data =>{
            console.log(data);
            M.toast({html: 'Task Deleted'});
            this.fetchTasks();
        });
        }
    }

    editTask(id){
        console.log(id)
        fetch(`/api/tasks/${id}`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                this.setState({
                    title      : data.title,
                    description: data.description,
                    _id        : data._id
                });
            })
    }


    render(){
        return (  
            <div>
            {/*NAVEGACION*/}
                <nav className="light-blue darken-4">
                    <div className="container">
                        <a href="/" className="brand-logo">MERN Stack</a>
                    </div>
                </nav>

                <div className="container">
                    <div className="row">
                        <div className="col s5">
                            <div className="card">
                                <div className="card-content">
                                    <form onSubmit={this.addTask}>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <input name="title" onChange={this.handleChange} value={this.state.title} type="text" placeholder="Task Title"/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <textarea name="description" onChange={this.handleChange} value={this.state.description} placeholder="Task Description" className="materialize-textarea"></textarea>
                                            </div>
                                        </div>
                                        <button className="btn light-blue darken-4" type="submit">Send</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col s7">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.tasks.map(task => {
                                        return (
                                            <tr key={task._id}>
                                                <td>{task.title}</td>
                                                <td>{task.description}</td>
                                                <td>
                                                    <button className="btn light-blue darken-4"><i className="material-icons" onClick={() => this.deleteTask(task._id)}>delete</i></button>
                                                    <button style={{margin: '4px'}} className="btn light-blue darken-4" onClick={() => this.editTask(task._id)}><i className="material-icons">edit</i></button>                                                    
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;