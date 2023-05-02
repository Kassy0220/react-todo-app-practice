class ToDoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {allTasks: this.props.tasks};

    this.calcMaxId = this.calcMaxId.bind(this);
    this.createToDo = this.createToDo.bind(this);
    this.updateToDo = this.updateToDo.bind(this);
  }

  // 暫定的にメモのIDを取得する処理を作成
  calcMaxId() {
    const maxId = Math.max.apply(
      null,
      this.state.allTasks.map((todo) => todo.id)
    );
    return maxId;
  }

  createToDo(content) {
    const tasks = this.state.allTasks;
    const id = this.calcMaxId() + 1;
    tasks.push({id, content, isEditing: false});
    this.setState({allTasks: tasks});
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
  }

  render() {
    return (
      <div>
        <ToDoCreateForm createToDo={this.createToDo} />
        <ToDoList allTasks={this.state.allTasks} updateToDo={this.updateToDo} />
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
          <BaseButton text="新規作成" />
        </form>
      </div>
    );
  }
}

function ToDoList(props) {
  const allTasks = props.allTasks;
  const taskList = allTasks.map((todo) => (
    <ToDoItem key={todo.id} todo={todo} updateToDo={props.updateToDo} />
  ));

  return <ul>{taskList}</ul>;
}

function ToDoItem(props) {
  const todoId = props.todo.id;
  const todoContent = props.todo.content;
  const todoIsEditing = props.todo.isEditing;
  const updateToDo = props.updateToDo;

  const todoItemInEditing = (
    <ToDoUpdateForm id={todoId} content={todoContent} updateToDo={updateToDo} />
  );
  const todoItem = (
    <div>
      {todoContent}
      <div className="buttons-container">
        <BaseButton text="編集" />
        <BaseButton text="削除" />
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
          <BaseButton text="更新" />
        </form>
      </div>
    );
  }
}

function BaseButton(props) {
  return <button>{props.text}</button>;
}

// サンプルデータを用意
let allTasks = [
  {id: 1, content: "あ〜ちゃん", isEditing: false},
  {id: 2, content: "のっち", isEditing: false},
  {id: 3, content: "かしゆか", isEditing: true},
];

const root = ReactDOM.createRoot(document.querySelector("#app"));
const element = <ToDoApp tasks={allTasks} />;
root.render(element);
