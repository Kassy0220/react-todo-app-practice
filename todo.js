class ToDoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {allTasks: [], idCounter: 0};

    this.createToDo = this.createToDo.bind(this);
    this.updateToDo = this.updateToDo.bind(this);
    this.editToDo = this.editToDo.bind(this);
    this.deleteToDo = this.deleteToDo.bind(this);
  }

  componentDidMount() {
    const allTasks = JSON.parse(localStorage.getItem("allTasks"));
    const idCounter = JSON.parse(localStorage.getItem("idCounter"));

    if (allTasks) {
      this.setState({allTasks: allTasks, idCounter: idCounter});
    }
  }

  createToDo(content) {
    const tasks = this.state.allTasks;
    const id = this.state.idCounter + 1;
    tasks.push({id, content, isEditing: false});
    this.setState({allTasks: tasks, idCounter: id});

    this.saveTask(tasks);
    localStorage.setItem("idCounter", id);
  }

  updateToDo(id, content) {
    let updatedAllTasks = this.state.allTasks.map((todo) => {
      if (todo.id === id) {
        todo.content = content;
        todo.isEditing = false;
      }
      return todo;
    });
    this.setState({allTasks: updatedAllTasks});

    this.saveTask(updatedAllTasks);
  }

  deleteToDo(id) {
    let deletedAllTasks = this.state.allTasks.filter((todo) => todo.id !== id);
    this.setState({allTasks: deletedAllTasks});

    this.saveTask(deletedAllTasks);
  }

  editToDo(id) {
    let editedAllTasks = this.state.allTasks.map((todo) => {
      if (todo.id === id) {
        todo.isEditing = true;
      }
      return todo;
    });
    this.setState({allTasks: editedAllTasks});

    this.saveTask(editedAllTasks);
  }

  saveTask(allTasks) {
    const json = JSON.stringify(allTasks);
    localStorage.setItem("allTasks", json);
  }

  render() {
    return (
      <div>
        <ToDoCreateForm createToDo={this.createToDo} />
        <ToDoList
          allTasks={this.state.allTasks}
          updateToDo={this.updateToDo}
          editToDo={this.editToDo}
          deleteToDo={this.deleteToDo}
        />
      </div>
    );
  }
}

class ToDoCreateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ""};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.createToDo(this.state.value);
    this.setState({value: ""});
  }

  render() {
    return (
      <div>
        <form id="create-form" onSubmit={this.handleSubmit}>
          <textarea
            placeholder="ToDoの内容を入力"
            value={this.state.value}
            onChange={this.handleChange}
          ></textarea>
          <button>新規作成</button>
        </form>
      </div>
    );
  }
}

function ToDoList(props) {
  const allTasks = props.allTasks;
  const taskList = allTasks.map((todo) => (
    <ToDoItem
      key={todo.id}
      todo={todo}
      updateToDo={props.updateToDo}
      editToDo={props.editToDo}
      deleteToDo={props.deleteToDo}
    />
  ));

  return <ul>{taskList}</ul>;
}

function ToDoItem(props) {
  const todoId = props.todo.id;
  const todoContent = props.todo.content;
  const todoIsEditing = props.todo.isEditing;
  const updateToDo = props.updateToDo;
  const editToDo = props.editToDo;
  const deleteToDo = props.deleteToDo;

  const todoItemInEditing = (
    <ToDoUpdateForm id={todoId} content={todoContent} updateToDo={updateToDo} />
  );
  const todoItem = (
    <div>
      {todoContent}
      <div className="buttons-container">
        <button
          onClick={() => {
            editToDo(todoId);
          }}
        >
          編集
        </button>
        <button
          onClick={() => {
            deleteToDo(todoId);
          }}
        >
          削除
        </button>
      </div>
    </div>
  );

  return (
    <li className="todo-item">
      {todoIsEditing ? todoItemInEditing : todoItem}
    </li>
  );
}

class ToDoUpdateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: this.props.content};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.updateToDo(this.props.id, this.state.value);
  }

  render() {
    return (
      <div>
        <form id="update-form" onSubmit={this.handleSubmit}>
          <textarea
            value={this.state.value}
            onChange={this.handleChange}
          ></textarea>
          <button>更新</button>
        </form>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
const element = <ToDoApp />;
root.render(element);
