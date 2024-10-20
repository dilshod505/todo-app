const ul = document.querySelector("ul.list-group");
const taskInput = document.querySelector("#task-input");
const addBtn = document.querySelector("#add-btn");
let editIndex = null;

const runConfetti = () => {
  confetti({
    particleCount: 300,
    spread: 200,
    origin: { y: 0.6 },
  });
};

const toastSuccess = (text) => {
  Toastify({
    text,
    duration: 3000,
    style: {
      background: "rgb(79, 179, 79)",
      borderRadius: "10px",
    },
  }).showToast();
};

const toastError = (text) => {
  Toastify({
    text,
    duration: 3000,
    style: {
      background: "rgb(201, 68, 68)",
      borderRadius: "10px",
    },
  }).showToast();
};

const getTasks = async () => {
  const res = await axios.get("https://96adb52186b42af6.mokky.dev/tasks");
  return res.data;
};

const renderTasks = async () => {
  const tasks = await getTasks();

  ul.innerHTML = "";

  tasks.map((item, index) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-start";
    li.innerHTML = `
    <div class="me-auto">
    <button class="btn border-0 p-0 me-2" onclick="complete(${item.id})">
    ${
      !item.isCompleted
        ? `<i class="fa-regular fa-circle"></i>`
        : `<i class="fa-regular fa-circle-check"></i>`
    }
    </button>
    <span class="${
      item.isCompleted ? "text-secondary text-decoration-line-through" : ""
    }"
      >${item.text}</span
    >
  </div>
  <div>
    <button class="btn border-0 p-0 me-2 edit-btn d-none" onclick="editClick(${
      item.id
    })">
      <i class="fa-solid fa-pencil"></i>
    </button>
    <button class="btn border-0 p-0" onclick="deleteTask(${item.id})">
      <i class="fa-regular fa-trash-can"></i>
    </button>
  </div>
    `;

    ul.appendChild(li);
  });
};

window.onload = () => {
  renderTasks();
};

const complete = async (id) => {
  try {
    const task = (
      await axios.get(`https://96adb52186b42af6.mokky.dev/tasks/${id}`)
    ).data;

    await axios.patch(`https://96adb52186b42af6.mokky.dev/tasks/${id}`, {
      ...task,
      isCompleted: !task.isCompleted,
    });
    renderTasks();

    if (!task.isCompleted) {
      toastSuccess("Checked");
    } else {
      toastError("Unchecked");
    }

    // const completedTasks = tasks.filter((e) => !e.isCompleted);
    // if (completedTasks.length == 0) runConfetti();
  } catch (e) {
    toastError("Eror");
  }
};

const addTask = async () => {
  const text = taskInput.value.trim();

  if (text.length == 0) {
    toastError("Vazifa kiritilmagan");
    taskInput.value = "";
    return;
  }

  try {
    if (editIndex !== null) {
      const res = await axios.patch(
        `https://96adb52186b42af6.mokky.dev/tasks/${editIndex}`,
        {
          text,
          isCompleted: false,
        }
      );
      toastSuccess("Changed  ☑️");
      editIndex = null;
      addBtn.innerHTML = "+ Add";
    } else {
      const res = await axios.post("https://96adb52186b42af6.mokky.dev/tasks", {
        text,
        isCompleted: false,
      });
      toastSuccess("Vazifa muvaffaqiyatli qo'shildi");
    }
    renderTasks();
    taskInput.value = "";
  } catch (error) {
    toastError("Xatolik");
    console.error(error);
  }
};

// const addTask = async () => {
//   const text = taskInput.value.trim();

//   if (text.length == 0) {
//     toastError("No task");
//     taskInput.value = "";
//     return;
//   }

//   const res = await axios.post("https://96adb52186b42af6.mokky.dev/tasks", {
//     text,
//     isCompleted: false,
//   });

//   if (editIndex !== null) {
//     text[editIndex].text = text;
//     editIndex = null;
//     addBtn.innerHTML = "+ Add";
//   } else {
//     tasks.unshift({ text, isCompleted: false });
//   }
//   //   console.log(res);

//   renderTasks();

//   toastSuccess("Saved");
//   taskInput.value = "";
// };

const deleteTask = async (id) => {
  console.log(id);
  const res = await axios.delete(
    `https://96adb52186b42af6.mokky.dev/tasks/${id}`
  );

  console.log(res);

  renderTasks();

  toastError("Delete task");
};

const editClick = async (id) => {
  try {
    const task = (
      await axios.get(`https://96adb52186b42af6.mokky.dev/tasks/${id}`)
    ).data;
    taskInput.value = task.text;
    editIndex = id;
    addBtn.innerHTML = "Edit";
  } catch (e) {
    toastError("Error");
  }
};

// const editClick = async (id) => {
//   try {
//     const task = (
//       await axios.get(`https://96adb52186b42af6.mokky.dev/tasks/${id}`)
//     ).data;
//     taskInput.value = task.text;
//     editIndex = id;
//     addBtn.innerHTML = "Edit";
//   } catch (e) {
//     toastError("Error");
//   }
// };
