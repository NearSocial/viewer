const { Modal, Button, ProgressState } = VM.require(
  "buildhub.near/widget/components"
) || {
  Modal: () => <></>,
  Button: () => <></>,
  ProgressState: () => <></>
};

const ThemeContainer =
  props.ThemeContainer ||
  styled.div`
    --primary-color: rgb(255, 175, 81);
    --border-color: rgba(255, 255, 255, 0.2);
    --font-color: #fff;
    --menu-bg-color: #0b0c14;
    --secondary-font-color: rgba(176, 176, 176, 1);
    --card-bg-color: rgba(35, 36, 43, 1);
  `;

const Wrapper = styled.div`
  color: white;

  .border {
    border-color: var(--border-color) !important;
  }
  input::placeholder {
    color: var(--secondary-font-color) !important;
  }

  input[type="text"] {
    background: #23242b !important;
    color: #fff !important;
    border: 1px solid var(--border-color) !important;
  }

  .form-check-input:checked {
    background-color: var(--primary-color) !important;
    border-color: var(--primary-color) !important;
  }

  .cbx:hover span:first-child {
    border-color: var(--primary-color) !important;
  }

  .pointer {
    cursor: pointer;
  }

  .red {
    color: #dc3545;
  }

  .badge {
    border: 1px solid var(--primary-color) !important;
  }

  .hashtag {
    color: var(--primary-color) !important;
  }

  .secondary-text{
    color: var(--secondary-font-color) !important;
  }
  
  .dropdown-menu {
    background-color: var(--menu-bg-color) !important;
    color: var(--font-color) !important;

    li.dropdown-item {
      display:flex;
      gap:10px;
      align-items:center;
      cursor:pointer;
      color: var(--font-color) !important;
      &:hover {
        a {
          color: var(--menu-bg-color) !important;
        }
      }
    }

    .link-dark,
    .dropdown-item {
      color: var(--font-color) !important;

      &:hover {
        color: var(--menu-bg-color) !important;

        span {
          color: var(--menu-bg-color) !important;
        }
      }
    }

    .dropdown-item.active, .dropdown-item:active {
      background-color: var(--primary-color) !important;
    }
`;

const projectID = "";

const StatusValues = {
  PROPOSED: "proposed",
  PROGRESS: "progress",
  COMPLETED: "completed"
};

const listItem = { title: "", isCompleted: false };
const task = {
  title: "",
  description: "",
  author: "",
  tags: "",
  list: [], // listItem
  status: ""
};

const dummyTask = {
  title: "title",
  description: "description",
  author: "megha19.near",
  tags: "test, build",
  list: [{ title: "UX Design", isCompleted: false }],
  status: "proposed"
};

const [tasks, setTasks] = useState([
  dummyTask,
  { ...dummyTask, status: "progress" },
  { ...dummyTask, status: "completed" }
]);
const [proposedTasks, setProposedTasks] = useState([]);
const [progressTasks, setProgresTasks] = useState([]);
const [completedTasks, setCompletedTasks] = useState([]);
const [showAddTaskModal, setShowAddTaskModal] = useState(false);
const [taskDetail, setTaskDetail] = useState({});
const [showDropdownIndex, setShowDropdownIndex] = useState(null);
const [isEditTask, setIsEdit] = useState(false);
const [showDeleteConfirmationModalIndex, setDeleteConfirmationIndex] =
  useState(null);
const [showViewTaskModal, setViewTaskModal] = useState(false);

useEffect(() => {
  if (Array.isArray(tasks)) {
    setProposedTasks(tasks.filter((i) => i.status === StatusValues.PROPOSED));
    setProgresTasks(tasks.filter((i) => i.status === StatusValues.PROGRESS));
    setCompletedTasks(tasks.filter((i) => i.status === StatusValues.COMPLETED));
  }
}, [tasks]);

const onEdit = () => {
  const modifications = Social.index("modify", item, {
    limit: 1,
    order: "desc"
  });

  if (modifications.length) {
    const modification = modifications[0].value;
    if (modification.type === "edit") {
      content = modification.value;
    } else if (modification.type === "delete") {
      return <></>;
    }
  }
};

const updateTaskDetail = (data) => {
  setTaskDetail((prevState) => ({
    ...prevState,
    ...data
  }));
};

const updateTaskListItem = (index, updatedItem) => {
  const updatedList = [...taskDetail.list];
  updatedList[index] = updatedItem;
  updateTaskDetail({ list: updatedList });
};

const deleteTaskListItem = (index) => {
  const updatedList = [
    ...taskDetail.list.slice(0, index),
    ...taskDetail.list.slice(index + 1)
  ];
  updateTaskDetail({ list: updatedList });
};

const onAddTask = () => {};

const onEditTask = () => {};

const onDeleteTask = () => {};

const DropdownMenu = ({ item, index }) => {
  return (
    <span
      className="ms-auto flex-shrink-0"
      onClick={(event) => event.stopPropagation()}
    >
      <div data-bs-toggle="dropdown" aria-expanded="false">
        <i class="bi bi-three-dots h5 pointer"></i>
      </div>
      <ul className="dropdown-menu border">
        <li
          className="dropdown-item"
          onClick={() => {
            setIsEdit(true);
            setTaskDetail(item);
            setShowAddTaskModal(true);
          }}
        >
          <i class="bi bi-pencil"></i>Edit Task
        </li>
        <li
          className="dropdown-item"
          onClick={() => {
            setDeleteConfirmationIndex(index);
          }}
        >
          <i class="bi bi-trash3"></i>Delete Task
        </li>
        <hr />
        <div
          style={{ color: "var(--secondary-font-color)" }}
          className="px-2 mb-1"
        >
          Change Status
        </div>
        <li className="dropdown-item">
          <i class="bi bi-check2"></i>In Progress
        </li>
        <li className="dropdown-item">
          <i class="bi bi-check2"></i>Completed
        </li>
      </ul>
    </span>
  );
};

const DeleteConfirmationModal = () => {
  return (
    <Modal
      open={typeof showDeleteConfirmationModalIndex === "number"}
      title={"Delete Task"}
      onOpenChange={() => setDeleteConfirmationIndex(null)}
    >
      <div className="d-flex flex-column gap-2">
        Are you sure you want to delete the task ?
        <div className="d-flex justify-content-end gap-3 align-items-center mt-3">
          <Button
            variant="outline"
            onClick={() => setDeleteConfirmationIndex(null)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={onDeleteTask}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const AddTaskModal = () => {
  return (
    <Modal
      open={showAddTaskModal}
      title={(isEditTask ? "Edit" : "Add") + " Task"}
      onOpenChange={() => {
        setShowAddTaskModal(!showAddTaskModal);
        setTaskDetail(null);
      }}
    >
      <div className="d-flex flex-column gap-4">
        <div>
          <label class="mb-1">Title</label>
          <input
            placeholder="Enter task title"
            type="text"
            value={taskDetail.title}
            onChange={(e) => updateTaskDetail({ title: e.target.value })}
          />
        </div>
        <div>
          <label class="mb-1">Description</label>
          <input
            placeholder="Enter description"
            type="text"
            value={taskDetail.description}
            onChange={(e) => updateTaskDetail({ description: e.target.value })}
          />
        </div>
        <div>
          <label class="mb-1">Tags</label>
          <input
            placeholder="Enter tags e.g community, Open source"
            type="text"
            value={taskDetail.tags}
            onChange={(e) => updateTaskDetail({ tags: e.target.value })}
          />
        </div>
        <div>
          <div className="d-flex justify-content-between mb-1 align-items-center">
            <label>Task List</label>
            <div
              onClick={() =>
                updateTaskDetail({
                  list: [...(taskDetail.list ?? []), { ...listItem }]
                })
              }
            >
              <i class="bi bi-plus-circle h5 pointer"></i>
            </div>
          </div>
          <div className="d-flex flex-column gap-2">
            {Array.isArray(taskDetail.list) &&
              taskDetail.list?.map((item, index) => (
                <div>
                  <div className="d-flex gap-2 justify-content-between align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={item.isCompleted}
                      onChange={(e) =>
                        updateTaskListItem(index, {
                          title: item.title,
                          isCompleted: e.target.checked
                        })
                      }
                    />
                    <input
                      type="text"
                      value={item.title}
                      placeholder="Task name"
                      onChange={(e) =>
                        updateTaskListItem(index, {
                          title: e.target.value,
                          isCompleted: false
                        })
                      }
                    />
                    <div onClick={() => deleteTaskListItem(index)}>
                      <i class="bi bi-trash3 h6 red pointer"></i>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="d-flex justify-content-end gap-3 align-items-center mt-3">
          {!isEditTask && (
            <Button variant="outline" onClick={() => setTaskDetail(null)}>
              Clear Inputs
            </Button>
          )}
          <Button
            variant="primary"
            onClick={isEditTask ? onAddTask : onEditTask}
          >
            {isEditTask ? "Save" : "Add Task"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const ViewTaskModal = () => {
  return (
    <Modal
      open={showViewTaskModal}
      title={"Task Details"}
      onOpenChange={() => {
        setViewTaskModal(!showViewTaskModal);
        setTaskDetail(null);
      }}
    >
      <div className="d-flex flex-column gap-4">
        <div>
          <label class="mb-1">Title</label>
          <div className="secondary-text">{taskDetail.title}</div>
        </div>
        <div>
          <label class="mb-1">Description</label>
          <div className="secondary-text">{taskDetail.description}</div>
        </div>
        <div>
          <label class="mb-1">Tags</label>
          <div className="d-flex gap-2 align-items-center">
            {taskDetail.tags &&
              taskDetail.tags.split(",").map((tag) => (
                <span key={i} className="badge p-2 rounded-0">
                  <span className="hashtag">#</span>
                  {tag.trim()}
                </span>
              ))}
          </div>
        </div>
        <div>
          <div className="d-flex justify-content-between mb-1 align-items-center">
            <label>Task List</label>
          </div>
          <div className="d-flex flex-column gap-2">
            {Array.isArray(taskDetail.list) &&
              taskDetail.list?.map((item) => (
                <div>
                  <div className="d-flex gap-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={item.isCompleted}
                      disabled={true}
                    />
                    <label>{item.title}</label>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

const Column = ({ title, addTask, tasks }) => {
  return (
    <div className="d-flex flex-column gap-1 col-md-4">
      <div className="border p-3 rounded-2 d-flex justify-content-between align-items-center h6">
        {title}
        <div onClick={addTask}>
          <i class="bi bi-plus-lg pointer"></i>
        </div>
      </div>
      <div className="d-flex flex-column gap-2">
        {tasks.map((item, index) => (
          <div
            onClick={() => {
              setViewTaskModal(true);
              setTaskDetail(item);
            }}
            style={{ backgroundColor: "var(--card-bg-color)" }}
            className="p-3 d-flex justify-content-between rounded-2 gap-2 pointer"
          >
            <div className="d-flex flex-column gap-2">
              <div className="h6 bold">{item.title}</div>
              <div className="h6">Author: {item.author}</div>
              <div className="h6">Last edited: </div>
            </div>
            <DropdownMenu item={item} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

const columns = [
  {
    title: "Proposed",
    tasks: proposedTasks,
    addTask: () => {
      setTaskDetail({ ...task, status: StatusValues.PROPOSED });
      setShowAddTaskModal(true);
    }
  },
  {
    title: "In Progress",
    tasks: progressTasks,
    addTask: () => {
      setTaskDetail({ ...task, status: StatusValues.PROGRESS });
      setShowAddTaskModal(true);
    }
  },
  {
    title: "Completed",
    tasks: completedTasks,
    addTask: () => {
      setTaskDetail({ ...task, status: StatusValues.COMPLETED });
      setShowAddTaskModal(true);
    }
  }
];

return (
  <ThemeContainer>
    <Wrapper>
      <AddTaskModal />
      <ViewTaskModal />
      <DeleteConfirmationModal />
      <div class="container">
        <div class="row">
          {columns.map((item) => (
            <Column
              title={item.title}
              addTask={item.addTask}
              tasks={item.tasks}
            />
          ))}
        </div>
      </div>
    </Wrapper>
  </ThemeContainer>
);
