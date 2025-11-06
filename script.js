const tasks = [];

// previne que a pagina recarregue ao pressionar um botao dentro de um formulario
$('button').on('click', (e) => {
    e.preventDefault();
});

$('#add-task-button').on('click', (e) => {
    const taskName = $('#task-name-input').val();
    createTask(taskName);
    $('#add-task-modal').modal('hide');
});

function createTask(taskName) {
    
    let taskId;

    if (tasks.length <= 0) {
        taskId = 1;
    } else {
        // reverte o array e pega o ID do primeiro objeto (index 0), que no caso seria o ultimo no array não invertido.
        taskId = tasks.reverse()[0].id + 1;
    }

    tasks.push({
        taskName,
        id: taskId
    });

    renderTasksHTML();

    console.log(tasks);
}

function renderTasksHTML() {

    let tasksHTML = ``;

    tasks.forEach((task) => {
        
        const taskHTML = `
            <li class="list-group-item task d-flex justify-content-between align-items-center">

                    <div>
                        <input type="checkbox" class="form-check-input me-2" id="task-check-${task.id}">
                        <label class="form-check-label" for="task-check-${task.id}">
                            ${task.taskName}
                        </label>    
                    </div>

                    <button class="btn btn-danger align-self-end" id="delete-task-button" data-task-id="${task.id}" data-bs-toggle="modal" data-bs-target="#delete-task-modal">
                        Excluir
                    </button>

            </li>
        `;

        tasksHTML += taskHTML;

    });

    $('#task-list').html(tasksHTML);

};

