class ToDoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {allTasks: this.props.tasks};

    this.calcMaxId = this.calcMaxId.bind(this);
    this.createToDo = this.createToDo.bind(this);
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

  render() {
    return (
      <div>
        <ToDoCreateForm createToDo={this.createToDo} />
        <ToDoList tasks={this.props.tasks} />
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
  const allTasks = props.tasks;
  const taskList = allTasks.map((task) => (
    <ToDoItem key={task.id} content={task.content} isEditing={task.isEditing} />
  ));

  return <ul>{taskList}</ul>;
}

function ToDoItem(props) {
  const todoItem = (
    <div>
      {props.content}
      <div className="buttons-container">
        <BaseButton text="編集" />
        <BaseButton text="削除" />
      </div>
    </div>
  );
  const todoItemInEditing = <ToDoUpdateForm content={props.content} />;

  return (
    <li className="todo-item">
      {props.isEditing ? todoItemInEditing : todoItem}
    </li>
  );
}

function ToDoUpdateForm(props) {
  return (
    <div>
      <form id="update-form">
        <textarea value={props.content}></textarea>
        {/* "set either `onChange` or `readOnly`"という警告が出るが、ハンドラは現段階で追加しないので無視 */}
        <BaseButton text="更新" />
      </form>
    </div>
  );
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
