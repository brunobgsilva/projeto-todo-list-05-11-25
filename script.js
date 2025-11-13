const tasks = JSON.parse(localStorage.getItem('tasks')) ?? [];

// previne que a pagina recarregue ao pressionar um botao dentro de um formulario
$('button').on('click', (e) => {
    e.preventDefault();
});

$('#add-task-button').on('click', (e) => {
    const taskName = $('#task-name-input').val();
    createTask(taskName);
    $('#add-task-modal').modal('hide');
});

$('#modal-delete-task-button').on('click', (e) => {
    const taskIdToDelete = $(this).data('task-id');
    deleteTask(taskIdToDelete);
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

    let tasksHTML = ``;

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
    addClickEventToDeleteButtons();
    addClickEventToCheckboxes();

};

function deleteTask(taskIdToDelete) {
    tasks.splice(taskIdToDelete, 1);
    saveTasksToLocalStorage();
};

function addClickEventToCheckboxes() {
    document.querySelectorAll('.task-checkbox')
        .forEach((checkbox) => {

            let newCheckedState;
            const taskId = parseInt(checkbox.dataset.taskId);
            const taskIndex = tasks.findIndex((task) => task.id === taskId);

            checkbox.addEventListener('click', (e) => {
                if (checkbox.checked) {
                    newCheckedState = 'checked';
                } else {
                    newCheckedState = '';
                }
                
                tasks[taskIndex].checkedState = newCheckedState;
                saveTasksToLocalStorage();
            });

        });
}

function addClickEventToDeleteButtons() {
    $('.delete-task-button').each((i, button) => {
        $(this).on('click', (e) => {
            // pega o data 'task-id' do botão da tarefa e passa pro botão do modal
            const taskIdToDelete = $(button).data('task-id');
            $('#modal-delete-task-button').data('task-id', taskIdToDelete);
        });
    });
};

function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

renderTasksHTML();