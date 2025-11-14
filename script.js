const tasks = JSON.parse(localStorage.getItem('tasks')) ?? [];

document.getElementById('check-all-tasks')
.addEventListener('click', (e) => {
    const checkbox = e.target; 

    if (checkbox.checked) {
        tasks.forEach((task) => {
            task.checkedState = 'checked';
        });
    } else {
        tasks.forEach((task) => {
            task.checkedState = '';
        });
    }

    saveTasksToLocalStorage();
    renderTasksHTML();
});

// previne que a pagina recarregue ao pressionar um botao dentro de um formulario
$('button').on('click', (e) => {
    e.preventDefault();
});

$('#add-task-button').on('click', () => {
    const taskName = $('#task-name-input').val();
    createTask(taskName);
    $('#add-task-modal').modal('hide');
});

$('#modal-delete-task-button').on('click', (e) => {
    const button = e.target;
    const taskIdToDelete = $(button).data('task-id');
    const taskIndexToDelete = findTaskIndexById(taskIdToDelete);

    deleteTaskByIndex(taskIndexToDelete);
    renderTasksHTML();
});

function createTask(taskName) {
    let taskId;

    if (tasks.length <= 0) {
        taskId = 1;
    } else {
        // inverte o array e pega o ID do primeiro objeto (index 0), que no caso seria o ultimo no array não invertido.
        taskId = tasks.reverse()[0].id + 1;
        // inverte o array novamente para que fique na ordem correta
        tasks.reverse();
    };

    tasks.push({
        id: taskId,
        taskName,
        checkedState: ''
    });

    saveTasksToLocalStorage();
    renderTasksHTML();
};

function renderTasksHTML() {

    let tasksHTML = `
    `;

    tasks.forEach((task) => {
        
        const taskHTML = `
            <li class="list-group-item task d-flex justify-content-between align-items-center">

                    <div>
                        <input type="checkbox" class="form-check-input me-2 task-checkbox" id="task-check-${task.id}" data-task-id="${task.id}" ${task.checkedState}>
                        <label class="form-check-label" for="task-check-${task.id}">
                            ${task.taskName}
                        </label>    
                    </div>

                    <button class="btn btn-danger align-self-end delete-task-button" data-task-id="${task.id}" data-bs-toggle="modal" data-bs-target="#delete-task-modal">
                        Excluir
                    </button>

            </li>
        `;

        tasksHTML += taskHTML;

    });

    $('#task-list').html(tasksHTML);
    updateTaskCounter();
    addClickEventToDeleteButtons();
    addClickEventToCheckboxes();

};

function deleteTaskByIndex(taskIndexToDelete) {
    tasks.splice(taskIndexToDelete, 1);
    saveTasksToLocalStorage();
};

function addClickEventToCheckboxes() {
    document.querySelectorAll('.task-checkbox')
        .forEach((checkbox) => {

            let newCheckedState;
            const taskId = parseInt(checkbox.dataset.taskId);
            const taskIndex = findTaskIndexById(taskId);

            checkbox.addEventListener('click', (e) => {
                if (checkbox.checked) {
                    newCheckedState = 'checked';
                } else {
                    newCheckedState = '';
                }
                
                tasks[taskIndex].checkedState = newCheckedState;
                saveTasksToLocalStorage();
                updateTaskCounter();
            });

        });
};

function addClickEventToDeleteButtons() {
    $('.delete-task-button').each((i, button) => {
        $(button).on('click', (e) => {
            // pega o data 'task-id' do botão da tarefa e passa pro botão do modal
            const button = e.target;
            const taskIdToDelete = $(button).data('task-id');
            $('#modal-delete-task-button').data('task-id', taskIdToDelete);
        });
    });
};

function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

function findTaskIndexById(taskId) {
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    return taskIndex;
};

function updateTaskCounter() {
    let checkedTasks = 0;

    tasks.forEach((task) => {
        if (task.checkedState === "checked") {
            checkedTasks++;
        };
    });

    $('#task-counter').html(`
        <span>Tarefas: ${tasks.length}</span>
        <span class="container mx-2"> | </span>
        <span>Tarefas concluidas: ${checkedTasks}</span>
    `);
};

renderTasksHTML();