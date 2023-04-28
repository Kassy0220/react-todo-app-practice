function ToDoApp(props) {
  return (
    <div>
      <ToDoCreateForm />
      <ToDoList tasks={props.tasks} />
    </div>
  );
}

function ToDoCreateForm() {
  return (
    <div>
      <form id="create-form">
        <textarea placeholder="ToDoの内容を入力"></textarea>
        <BaseButton text="新規作成" />
      </form>
    </div>
  );
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
      <BaseButton text="編集" />
      <BaseButton text="削除" />
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
const allTasks = [
  { id: 1, content: "あ〜ちゃん", isEditing: false },
  { id: 2, content: "のっち", isEditing: false },
  { id: 3, content: "かしゆか", isEditing: true },
];

const root = ReactDOM.createRoot(document.querySelector("#app"));
const element = <ToDoApp tasks={allTasks} />;
root.render(element);
