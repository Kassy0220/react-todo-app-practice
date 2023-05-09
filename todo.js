class ToDoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {allToDos: [], idCounter: 0};

    this.createToDo = this.createToDo.bind(this);
    this.updateToDo = this.updateToDo.bind(this);
    this.editToDo = this.editToDo.bind(this);
    this.deleteToDo = this.deleteToDo.bind(this);
  }

  componentDidMount() {
    const allToDos = JSON.parse(localStorage.getItem("allToDos"));
    const idCounter = JSON.parse(localStorage.getItem("idCounter"));

    if (allToDos) {
      this.setState({allToDos: allToDos, idCounter: idCounter});
    }
  }

  createToDo(content) {
    const id = this.state.idCounter + 1;

    this.saveToDos([...this.state.allToDos, {id, content, isEditing: false}]);
    this.setState({idCounter: id});
    localStorage.setItem("idCounter", id);
  }

  updateToDo(id, content) {
    const newToDos = [...this.state.allToDos];
    const targetIndex = this.state.allToDos.findIndex((todo) => todo.id === id);
    const updatedToDo = {
      ...this.state.allToDos[targetIndex],
      content: content,
      isEditing: false,
    };
    newToDos[targetIndex] = updatedToDo;

    this.saveToDos(newToDos);
  }

  deleteToDo(id) {
    const todos = this.state.allToDos.filter((todo) => todo.id !== id);

    this.saveToDos(todos);
  }

  editToDo(id) {
    const newToDos = [...this.state.allToDos];
    const targetIndex = this.state.allToDos.findIndex((todo) => todo.id === id);
    const editedToDo = {...this.state.allToDos[targetIndex], isEditing: true};
    newToDos[targetIndex] = editedToDo;

    this.saveToDos(newToDos);
  }

  saveToDos(todos) {
    this.setState({allToDos: todos});
    localStorage.setItem("allToDos", JSON.stringify(todos));
  }

  render() {
    return (
      <div>
        <ToDoCreateForm createToDo={this.createToDo} />
        <ToDoList
          allToDos={this.state.allToDos}
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
  const allToDos = props.allToDos;
  const todoList = allToDos.map((todo) => (
    <ToDoItem
      key={todo.id}
      todo={todo}
      updateToDo={props.updateToDo}
      editToDo={props.editToDo}
      deleteToDo={props.deleteToDo}
    />
  ));

  return <ul>{todoList}</ul>;
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
